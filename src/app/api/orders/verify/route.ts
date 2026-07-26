import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized: Student session required" }, { status: 403 });
    }

    const body = await req.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing required Razorpay parameters" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay Key Secret is not configured on the server" }, { status: 500 });
    }

    // Verify signature cryptographically
    const signatureText = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signatureText)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature verification failed" }, { status: 400 });
    }

    // Complete order and distribute dealer cuts in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update order
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "completed",
          gatewayPaymentId: razorpayPaymentId,
          gatewaySignature: razorpaySignature,
        },
        include: {
          items: true,
        },
      });

      // 2. Process order items
      for (const item of order.items) {
        // Fetch material & dealer information
        const mat = await tx.material.findUnique({
          where: { id: item.materialId },
          include: { dealer: true }
        });

        if (mat) {
          // Increment download count
          await tx.material.update({
            where: { id: mat.id },
            data: { downloadCount: { increment: 1 } }
          });

          // Calculate Ledger splits
          const netSalesAmount = item.price - item.discount;
          const commissionPercentage = mat.dealer.commissionPercentage || 70.0;
          const dealerCut = netSalesAmount * (commissionPercentage / 100.0);

          // Update dealer balance stats
          await tx.dealer.update({
            where: { id: mat.dealerId },
            data: {
              totalSales: { increment: netSalesAmount },
              netEarnings: { increment: dealerCut },
              availableBalance: { increment: dealerCut }
            }
          });

          // Add Ledger entry
          await tx.ledgerEntry.create({
            data: {
              orderId: order.id,
              dealerId: mat.dealerId,
              amount: dealerCut,
              type: "sale",
              description: `Earnings from study material sale: ${mat.title}`,
            }
          });
        }
      }

      return order;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
