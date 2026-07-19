import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { signToken } from "../../../../lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password, name, role, ...profileDetails } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user and associated profile
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        passwordHash,
        studentProfile: role === "student" ? {
          create: {
            universityId: profileDetails.universityId || "univ-1",
            collegeId: profileDetails.collegeId || "coll-1",
            courseId: profileDetails.courseId || "course-1",
            departmentId: profileDetails.departmentId || "dept-1",
            regulationId: profileDetails.regulationId || "reg-2",
            semesterId: profileDetails.semesterId || "sem-1",
          }
        } : undefined,
        dealerProfile: role === "dealer" ? {
          create: {
            name,
            email,
            phone: profileDetails.phone || "",
            status: "pending",
            verificationStatus: "unverified",
            collegeIds: JSON.stringify(profileDetails.collegeIds || []),
          }
        } : undefined,
      },
      include: {
        studentProfile: true,
        dealerProfile: true,
      }
    });

    // Sign the token
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Set cookie
    const response = NextResponse.json({ success: true, user });
    response.cookies.set("ev_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
