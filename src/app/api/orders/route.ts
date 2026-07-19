import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSessionUser } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "student") {
      const orders = await prisma.order.findMany({
        where: { userId: session.id },
        include: {
          items: {
            include: {
              material: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(orders);
    } else if (session.role === "dealer") {
      const dealer = await prisma.dealer.findUnique({
        where: { userId: session.id }
      });
      if (!dealer) return NextResponse.json([]);

      // Find all ledger entries for this dealer
      const ledger = await prisma.ledgerEntry.findMany({
        where: { dealerId: dealer.id },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(ledger);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized: Only students can buy materials" }, { status: 403 });
    }

    const body = await req.json();
    const { items, paymentMethod, couponCode, subtotal, tax, discount, total } = body;

    const orderNumber = `EV-${Date.now().toString().slice(-8)}`;

    // Create the order using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          userId: session.id,
          orderNumber,
          subtotal: parseFloat(subtotal),
          tax: parseFloat(tax || 0),
          discount: parseFloat(discount || 0),
          total: parseFloat(total),
          paymentStatus: "completed", // Assume payment is successful immediately for simulation
          paymentMethod: paymentMethod || "UPI",
          couponCode,
        }
      });

      // 2. Create order items and update material download/purchase statistics
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            materialId: item.materialId,
            price: parseFloat(item.price),
            discount: parseFloat(item.discount || 0),
          }
        });

        // Fetch material & dealer information
        const mat = await tx.material.findUnique({
          where: { id: item.materialId },
          include: { dealer: true }
        });

        if (mat) {
          // Increment material download count
          await tx.material.update({
            where: { id: mat.id },
            data: { downloadCount: { increment: 1 } }
          });

          // Calculate Ledger splits
          const netSalesAmount = parseFloat(item.price) - parseFloat(item.discount || 0);
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
