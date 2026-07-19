import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSessionUser } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let tickets;

    if (session.role === "admin") {
      tickets = await prisma.supportTicket.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    } else {
      tickets = await prisma.supportTicket.findMany({
        where: { userId: session.id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    }

    // Format output
    const formatted = tickets.map((t: any) => ({
      id: t.id,
      userId: t.userId,
      userName: t.user.name,
      userEmail: t.user.email,
      userRole: t.user.role,
      subject: t.subject,
      status: t.status,
      createdAt: t.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await req.json();

    const ticket = await prisma.$transaction(async (tx) => {
      // 1. Create ticket
      const t = await tx.supportTicket.create({
        data: {
          userId: session.id,
          subject,
          status: "open",
        }
      });

      // 2. Create the first reply with user's message
      await tx.supportTicketReply.create({
        data: {
          ticketId: t.id,
          userId: session.id,
          message,
        }
      });

      return t;
    });

    return NextResponse.json(ticket);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
