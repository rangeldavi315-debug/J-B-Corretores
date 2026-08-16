import { NextResponse } from "next/server";
import { getAllProperties, saveAllProperties } from "@/lib/properties";
import type { Property, PropertyCategory } from "@/types/property";

const VALID_CATEGORIES: PropertyCategory[] = ["loteamento", "casa", "chacara", "apartamento"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validateProperty(item: unknown): item is Property {
  if (!isRecord(item)) return false;
  const requiredStrings = ["id", "slug", "title", "category", "status", "city", "description", "coverImage"];
  for (const field of requiredStrings) {
    if (typeof item[field] !== "string" || !item[field]) return false;
  }
  if (!VALID_CATEGORIES.includes(item.category as PropertyCategory)) return false;
  if (!isRecord(item.data)) return false;
  return true;
}

export async function GET() {
  try {
    const properties = await getAllProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error("GET Properties Error:", error);
    return NextResponse.json({ error: "Failed to read properties data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const passcode = request.headers.get("x-admin-passcode");
  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array." }, { status: 400 });
    }

    for (const item of body) {
      if (!validateProperty(item)) {
        return NextResponse.json(
          { error: "Cadastro inválido: verifique título, categoria, cidade, descrição e imagem de capa." },
          { status: 400 }
        );
      }
    }

    const properties = body as Property[];

    const now = new Date().toISOString();
    const processed = properties.map((item, index) => {
      const next: Property = { ...item };
      if (!next.images) next.images = [];
      if (!next.whatsappAgentId) {
        next.whatsappAgentId = index % 2 === 0 ? "62996367042" : "62996071448";
      }
      if (!next.createdAt) next.createdAt = now;
      next.updatedAt = now;
      return next;
    });

    await saveAllProperties(processed);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Properties Error:", error);
    return NextResponse.json({ error: "Failed to write properties data" }, { status: 500 });
  }
}
