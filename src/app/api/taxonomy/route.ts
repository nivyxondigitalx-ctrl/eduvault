import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const [
      universities,
      colleges,
      courses,
      departments,
      regulations,
      semesters,
      subjects,
    ] = await Promise.all([
      prisma.university.findMany({ where: { status: "active" } }),
      prisma.college.findMany({ where: { status: "active" } }),
      prisma.course.findMany({ where: { status: "active" } }),
      prisma.department.findMany({ where: { status: "active" } }),
      prisma.regulation.findMany({ where: { status: "active" } }),
      prisma.semester.findMany(),
      prisma.subject.findMany({ where: { status: "active" } }),
    ]);

    return NextResponse.json({
      universities,
      colleges,
      courses,
      departments,
      regulations,
      semesters,
      subjects,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
