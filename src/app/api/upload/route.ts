import { NextResponse, NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a safe, unique filename
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedOriginalName}`;
    let uploadDir = path.join(process.cwd(), "public", "uploads");
    let filePath = path.join(uploadDir, filename);
    let writeSuccessful = false;

    try {
      // Ensure the uploads directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      writeSuccessful = true;
    } catch (e: any) {
      console.warn("Failed to write to public/uploads, falling back to /tmp/uploads:", e.message);
    }

    if (!writeSuccessful) {
      uploadDir = path.join("/tmp", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
    }

    // Save copy to Postgres (SystemError table) to persist on serverless platforms
    try {
      await prisma.systemError.create({
        data: {
          message: `upload:${filename}`,
          stack: buffer.toString("base64"),
          url: file.type || "application/octet-stream",
          resolved: true,
        },
      });
    } catch (dbError: any) {
      console.error("Database file backup failed:", dbError.message);
    }

    return NextResponse.json({
      success: true,
      filePath: `/uploads/${filename}`,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
