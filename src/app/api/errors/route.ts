import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSessionUser } from "../../../lib/auth";

// Public endpoint to log client-side or global errors
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, stack, url } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemError = await prisma.systemError.create({
      data: {
        message,
        stack: stack || "",
        url: url || "",
      },
    });

    return NextResponse.json({ success: true, error: systemError });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin-only endpoints to manage errors
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const errors = await prisma.systemError.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(errors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin-only update to resolve/unresolve
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, resolved } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await prisma.systemError.update({
      where: { id },
      data: { resolved },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin-only delete error
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      // If no ID is provided, allow clearing resolved errors
      const clearResolved = searchParams.get("clearResolved");
      if (clearResolved === "true") {
        await prisma.systemError.deleteMany({
          where: { resolved: true }
        });
        return NextResponse.json({ success: true, message: "Cleared all resolved errors" });
      }
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.systemError.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
