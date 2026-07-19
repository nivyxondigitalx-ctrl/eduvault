import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "dealer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dealer = await prisma.dealer.findUnique({
      where: { userId: session.id }
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer profile not found" }, { status: 404 });
    }

    const payouts = await prisma.payout.findMany({
      where: { dealerId: dealer.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(payouts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "dealer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dealer = await prisma.dealer.findUnique({
      where: { userId: session.id }
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer profile not found" }, { status: 404 });
    }

    const { amount, method, paymentDetails } = await req.json();

    const payoutAmount = parseFloat(amount);
    if (payoutAmount > dealer.availableBalance) {
      return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create payout
      const payout = await tx.payout.create({
        data: {
          dealerId: dealer.id,
          amount: payoutAmount,
          method: method || "UPI",
          paymentDetails: paymentDetails || "",
          status: "pending",
        }
      });

      // 2. Deduct from available balance, add to pending payouts
      await tx.dealer.update({
        where: { id: dealer.id },
        data: {
          availableBalance: { decrement: payoutAmount },
          payoutBalance: { increment: payoutAmount }
        }
      });

      // 3. Add ledger entry
      await tx.ledgerEntry.create({
        data: {
          dealerId: dealer.id,
          amount: -payoutAmount,
          type: "payout",
          description: `Payout request of ₹${payoutAmount} submitted (${method})`,
        }
      });

      return payout;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
