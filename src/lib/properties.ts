import fs from "fs/promises";
import path from "path";
import type { Property, PropertyStatus } from "@/types/property";

export const PROPERTIES_PATH = path.join(process.cwd(), "content", "properties.json");

export async function getAllProperties(): Promise<Property[]> {
  try {
    const raw = await fs.readFile(PROPERTIES_PATH, "utf-8");
    return JSON.parse(raw) as Property[];
  } catch {
    return [];
  }
}

const VISIBLE_STATUSES: PropertyStatus[] = ["published", "reserved", "sold"];

/** Imoveis visiveis publicamente (rascunho e cadastros de demonstração nunca aparecem no site). */
export async function getVisibleProperties(): Promise<Property[]> {
  const all = await getAllProperties();
  return all
    .filter((p) => VISIBLE_STATUSES.includes(p.status) && !p.isDemo)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const all = await getAllProperties();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function saveAllProperties(properties: Property[]): Promise<void> {
  await fs.writeFile(PROPERTIES_PATH, JSON.stringify(properties, null, 2), "utf-8");
}

export { slugify } from "./slugify";
