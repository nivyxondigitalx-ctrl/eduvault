import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { signToken } from "../../../../lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, role, password } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        email: email,
        role: role,
      },
      include: {
        studentProfile: true,
        dealerProfile: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials. Please check your email and password." }, { status: 401 });
    }

    // If user has a password hash, validate it. Otherwise (Google OAuth users), allow login by email+role.
    if (user.passwordHash && password) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials. Please check your email and password." }, { status: 401 });
      }
    }

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
