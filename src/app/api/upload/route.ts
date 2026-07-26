import { NextResponse, NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

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
