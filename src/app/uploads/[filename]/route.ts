import { NextResponse, NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Sanitize filename to prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Try reading from public/uploads first
    let filePath = path.join(process.cwd(), "public", "uploads", filename);
    let fileBuffer: Buffer | null = null;

    try {
      fileBuffer = await fs.readFile(filePath);
    } catch (e) {
      // If not in public/uploads, try /tmp/uploads
      try {
        filePath = path.join("/tmp", "uploads", filename);
        fileBuffer = await fs.readFile(filePath);
      } catch (e2) {
        // Not found in either
      }
    }

    if (!fileBuffer) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Determine the content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".pdf") {
      contentType = "application/pdf";
    } else if (ext === ".png") {
      contentType = "image/png";
    } else if (ext === ".jpg" || ext === ".jpeg") {
      contentType = "image/jpeg";
    } else if (ext === ".gif") {
      contentType = "image/gif";
    } else if (ext === ".svg") {
      contentType = "image/svg+xml";
    }

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Error serving uploaded file:", error);
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 });
  }
}
