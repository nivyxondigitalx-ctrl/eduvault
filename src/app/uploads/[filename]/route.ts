import { NextResponse, NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "../../../lib/prisma";

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

    // If not found locally, try Postgres database (SystemError table)
    if (!fileBuffer) {
      try {
        const dbFile = await prisma.systemError.findFirst({
          where: { message: `upload:${filename}` },
        });

        if (dbFile && dbFile.stack) {
          fileBuffer = Buffer.from(dbFile.stack, "base64");
          
          // Write it to /tmp/uploads cache so subsequent requests on this instance are fast
          try {
            const cacheDir = path.join("/tmp", "uploads");
            await fs.mkdir(cacheDir, { recursive: true });
            await fs.writeFile(path.join(cacheDir, filename), fileBuffer);
          } catch (cacheErr: any) {
            console.warn("Failed to save retrieved database file to /tmp cache:", cacheErr.message);
          }
        }
      } catch (dbError: any) {
        console.error("Database file retrieval failed:", dbError.message);
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
