import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";

// GET all payout requests (Admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payouts = await prisma.payout.findMany({
      include: {
        dealer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payouts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT to update payout status (completed or rejected)
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !["completed", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Fetch the payout
    const payout = await prisma.payout.findUnique({
      where: { id },
      include: { dealer: true },
    });

    if (!payout) {
      return NextResponse.json({ error: "Payout request not found" }, { status: 404 });
    }

    if (payout.status !== "pending") {
      return NextResponse.json({ error: "Payout has already been processed" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update payout status
      const updatedPayout = await tx.payout.update({
        where: { id },
        data: { status },
      });

      if (status === "completed") {
        // Deduct from pending payout balance (since it was already decremented from availableBalance on request)
        await tx.dealer.update({
          where: { id: payout.dealerId },
          data: {
            payoutBalance: { decrement: payout.amount },
          },
        });
      } else if (status === "rejected") {
        // Refund back to available balance and decrement from pending payout balance
        await tx.dealer.update({
          where: { id: payout.dealerId },
          data: {
            availableBalance: { increment: payout.amount },
            payoutBalance: { decrement: payout.amount },
          },
        });
      }

      // Add audit log entry
      await tx.auditLog.create({
        data: {
          action: `PAYOUT_${status.toUpperCase()}`,
          details: `Payout of ₹${payout.amount} for dealer ${payout.dealer.name} marked as ${status}`,
          userId: session.id,
        },
      });

      return updatedPayout;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
