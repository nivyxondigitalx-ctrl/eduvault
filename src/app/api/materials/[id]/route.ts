import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const material = await prisma.material.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      },
      include: {
        dealer: {
          select: {
            name: true,
            verificationStatus: true,
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
              }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    // Format output
    const formatted = {
      ...material,
      dealerName: material.dealer.name,
      dealerVerified: material.dealer.verificationStatus === "verified",
      accessModes: JSON.parse(material.accessModes),
      tags: JSON.parse(material.tags),
      reviews: material.reviews.map((r: any) => ({
        id: r.id,
        materialId: r.materialId,
        studentName: r.user.name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }))
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, title, description, price, discount } = body;

    // Check if user is admin or the owner dealer
    const material = await prisma.material.findUnique({
      where: { id },
      include: { dealer: true }
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const isAdmin = session.role === "admin";
    const isOwner = session.role === "dealer" && material.dealer.userId === session.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden: You cannot modify this material" }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (discount !== undefined) updateData.discount = parseFloat(discount);
    
    // Only admins can change status
    if (status && isAdmin) {
      updateData.status = status;
    }

    const updated = await prisma.material.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
