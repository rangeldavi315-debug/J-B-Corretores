import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const TESTIMONIALS_PATH = path.join(process.cwd(), "content", "testimonials.json");

export async function GET() {
  try {
    const data = await fs.readFile(TESTIMONIALS_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("GET Testimonials Error:", error);
    return NextResponse.json({ error: "Failed to read testimonials data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const passcode = request.headers.get("x-admin-passcode");
  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array." }, { status: 400 });
    }

    await fs.writeFile(TESTIMONIALS_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Testimonials Error:", error);
    return NextResponse.json({ error: "Failed to write testimonials data" }, { status: 500 });
  }
}
