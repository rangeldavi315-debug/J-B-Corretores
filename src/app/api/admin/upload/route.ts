import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "properties");

export async function POST(request: Request) {
  const passcode = request.headers.get("x-admin-passcode");
  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WEBP and AVIF are allowed." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create directory if it doesn't exist
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate safe filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const basename = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const newFilename = `${timestamp}-${basename}${ext}`;
    
    const filePath = path.join(UPLOAD_DIR, newFilename);
    
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ path: `/images/properties/${newFilename}` });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
