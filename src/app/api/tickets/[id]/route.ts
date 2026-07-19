import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: true,
        replies: {
          include: {
            user: true
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Verify ownership
    if (session.role !== "admin" && ticket.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Format output
    const formatted = {
      id: ticket.id,
      userId: ticket.userId,
      userName: ticket.user.name,
      userRole: ticket.user.role,
      subject: ticket.subject,
      status: ticket.status,
      createdAt: ticket.createdAt,
      replies: ticket.replies.map((r: any) => ({
        id: r.id,
        senderRole: r.user.role,
        senderName: r.user.name,
        message: r.message,
        createdAt: r.createdAt,
      }))
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, status } = await req.json();

    const reply = await prisma.$transaction(async (tx) => {
      // 1. Create reply
      const r = await tx.supportTicketReply.create({
        data: {
          ticketId: id,
          userId: session.id,
          message,
        }
      });

      // 2. Update status if specified or set to resolved/pending
      const updatedStatus = status || (session.role === "admin" ? "resolved" : "open");
      await tx.supportTicket.update({
        where: { id },
        data: { status: updatedStatus }
      });

      return r;
    });

    return NextResponse.json(reply);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
