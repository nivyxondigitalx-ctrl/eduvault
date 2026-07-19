import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSessionUser } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universityId = searchParams.get("universityId");
    const collegeId = searchParams.get("collegeId");
    const courseId = searchParams.get("courseId");
    const departmentId = searchParams.get("departmentId");
    const regulationId = searchParams.get("regulationId");
    const semesterId = searchParams.get("semesterId");
    const subjectId = searchParams.get("subjectId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const dealerId = searchParams.get("dealerId");

    const where: any = {};

    if (universityId) where.universityId = universityId;
    if (collegeId) where.collegeId = collegeId;
    if (courseId) where.courseId = courseId;
    if (departmentId) where.departmentId = departmentId;
    if (regulationId) where.regulationId = regulationId;
    if (semesterId) where.semesterId = semesterId;
    if (subjectId) where.subjectId = subjectId;
    if (status) where.status = status;
    if (category) where.category = category;
    if (dealerId) where.dealerId = dealerId;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { subjectCode: { contains: search } },
      ];
    }

    const materials = await prisma.material.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        dealer: {
          select: {
            name: true,
            verificationStatus: true,
          }
        },
        reviews: true,
      }
    });

    // Format output to match frontend shape
    const formatted = materials.map((m: any) => ({
      ...m,
      dealerName: m.dealer.name,
      dealerVerified: m.dealer.verificationStatus === "verified",
      accessModes: JSON.parse(m.accessModes),
      tags: JSON.parse(m.tags),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "dealer") {
      return NextResponse.json({ error: "Unauthorized: Only dealers can submit materials" }, { status: 403 });
    }

    const dealer = await prisma.dealer.findUnique({
      where: { userId: session.id }
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      description,
      universityId,
      collegeId,
      courseId,
      departmentId,
      regulationId,
      semesterId,
      subjectId,
      subjectCode,
      category,
      examType,
      examMonth,
      examYear,
      price,
      discount,
      accessModes,
      tags,
      includesAnswerKey,
      fileSize,
      pageCount,
      previewPageCount,
      thumbnailStyle,
    } = body;

    // Generate slug from title
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const material = await prisma.material.create({
      data: {
        slug,
        title,
        description,
        universityId,
        collegeId,
        courseId,
        departmentId,
        regulationId,
        semesterId,
        subjectId,
        subjectCode,
        category,
        examType,
        examMonth,
        examYear,
        price: parseFloat(price || 0),
        discount: parseFloat(discount || 0),
        accessModes: JSON.stringify(accessModes || ["free"]),
        tags: JSON.stringify(tags || []),
        includesAnswerKey: !!includesAnswerKey,
        fileSize: fileSize || "1.0 MB",
        pageCount: parseInt(pageCount || 1),
        previewPageCount: parseInt(previewPageCount || 1),
        thumbnailStyle: thumbnailStyle || "from-indigo-600 to-indigo-800",
        status: "pending", // Default to pending approval
        dealerId: dealer.id,
      }
    });

    return NextResponse.json(material);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
