import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSessionUser } from "../../../../../lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized: Only students can review materials" }, { status: 403 });
    }

    const { rating, comment } = await req.json();

    const review = await prisma.review.create({
      data: {
        materialId: id,
        userId: session.id,
        rating: parseInt(rating),
        comment: comment || "",
      }
    });

    // Update material aggregate rating & review count
    const materialReviews = await prisma.review.findMany({
      where: { materialId: id }
    });

    const totalRating = materialReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / materialReviews.length;

    await prisma.material.update({
      where: { id },
      data: {
        rating: avgRating,
        reviewCount: materialReviews.length,
      }
    });

    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
