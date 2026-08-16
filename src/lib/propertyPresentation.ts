import type { Agent, LotProperty, Property, PropertyBase } from "@/types/property";

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR");
}

export function formatArea(value: number, unit: "m2" | "ha" = "m2"): string {
  return `${formatNumber(value)} ${unit === "ha" ? "ha" : "m²"}`;
}

const CATEGORY_SEO_SUFFIX: Record<Property["category"], string> = {
  loteamento: "Loteamento",
  casa: "Casa à venda",
  chacara: "Chácara à venda",
  apartamento: "Apartamento à venda",
};

/** Título de SEO construído a partir de dados reais do cadastro, nunca inventado. */
export function getSeoTitle(property: Property, companyName: string): string {
  if (property.seo?.title) return property.seo.title;

  if (property.category === "loteamento") {
    return `Lote no ${property.title} em ${property.city} | ${companyName}`;
  }

  return `${property.title} — ${CATEGORY_SEO_SUFFIX[property.category]} em ${property.city} | ${companyName}`;
}

export function getSeoDescription(property: Property): string {
  if (property.seo?.description) return property.seo.description;
  const text = property.description.trim();
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

/** Preço de destaque para o card do grid — nunca confunde preço total com parcela/entrada. */
export function getCardHeadlinePrice(property: Property): string | undefined {
  if (property.category === "loteamento") {
    const { commercial } = property.data;
    if (commercial.installment != null) return `A partir de ${formatBRL(commercial.installment)}/mês`;
    if (commercial.priceFrom != null) return `A partir de ${formatBRL(commercial.priceFrom)}`;
    return undefined;
  }
  if (property.data.price == null) return undefined;
  const formatted = formatBRL(property.data.price);
  return property.data.priceFrom ? `A partir de ${formatted}` : formatted;
}

/** Specs curtas para o card do grid — só mostra o que existir. */
export function getCardSpecs(property: Property): string[] {
  const specs: string[] = [];
  switch (property.category) {
    case "loteamento": {
      const { minLotSize, maxLotSize } = property.data;
      if (minLotSize != null && maxLotSize != null) {
        specs.push(`Lotes de ${formatNumber(minLotSize)} a ${formatNumber(maxLotSize)} m²`);
      } else if (minLotSize != null) {
        specs.push(`A partir de ${formatNumber(minLotSize)} m²`);
      }
      break;
    }
    case "casa": {
      const { builtArea, bedrooms, garageSpots } = property.data;
      if (builtArea != null) specs.push(`${formatNumber(builtArea)} m²`);
      if (bedrooms != null) specs.push(`${bedrooms} quarto${bedrooms === 1 ? "" : "s"}`);
      if (garageSpots != null) specs.push(`${garageSpots} vaga${garageSpots === 1 ? "" : "s"}`);
      break;
    }
    case "chacara": {
      const { totalArea, areaUnit } = property.data;
      if (totalArea != null) specs.push(formatArea(totalArea, areaUnit));
      break;
    }
    case "apartamento": {
      const { area, bedrooms, garageSpots } = property.data;
      if (area != null) specs.push(`${formatNumber(area)} m²`);
      if (bedrooms != null) specs.push(`${bedrooms} quarto${bedrooms === 1 ? "" : "s"}`);
      if (garageSpots != null) specs.push(`${garageSpots} vaga${garageSpots === 1 ? "" : "s"}`);
      break;
    }
  }
  return specs;
}

export function getWhatsAppMessage(property: Pick<Property, "title" | "city" | "category">, agent: Agent): string {
  const complement = property.category === "loteamento" ? "e quero saber mais sobre os lotes e as condições" : "e gostaria de saber mais";
  return `Olá, ${agent.name}! Vi o ${property.title} no seu site ${complement}.`;
}

export function buildWhatsAppLink(agent: Agent, property: Pick<Property, "title" | "city" | "category">): string {
  const message = getWhatsAppMessage(property, agent);
  return `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_LOT_CTA_LABEL = "Quero saber as condições";

function describeLotSize(data: LotProperty["data"]): string | undefined {
  if (data.minLotSize != null && data.maxLotSize != null) {
    return `Lotes de ${formatNumber(data.minLotSize)} a ${formatNumber(data.maxLotSize)} m²`;
  }
  if (data.minLotSize != null) return `Lotes a partir de ${formatNumber(data.minLotSize)} m²`;
  if (data.maxLotSize != null) return `Lotes de até ${formatNumber(data.maxLotSize)} m²`;
  return undefined;
}

export interface QuickFact {
  icon: string;
  label: string;
  value: string;
}

/** Resumo rápido do loteamento em 4 blocos — só aparece o que existir no cadastro. */
export function getLotQuickFacts(property: LotProperty): QuickFact[] {
  const { data } = property;
  const facts: QuickFact[] = [];

  const location = property.neighborhood ? `${property.neighborhood}, ${property.city}` : property.city;
  if (location) facts.push({ icon: "📍", label: "Localização", value: location });

  const size = describeLotSize(data);
  if (size) facts.push({ icon: "📐", label: "Metragem", value: size });

  if (data.infrastructure.length > 0) {
    facts.push({
      icon: "🏗️",
      label: "Infraestrutura",
      value: data.infrastructure.slice(0, 3).join(", ") + (data.infrastructure.length > 3 ? "..." : ""),
    });
  }

  const price = getCardHeadlinePrice(property);
  if (price) facts.push({ icon: "💰", label: "Condições", value: price });

  return facts;
}

// ─── Localização / Google Maps ──────────────────────────────────────────────
// A chave da Maps Embed API é opcional e pertence à configuração do site
// (NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY), nunca ao cadastro do imóvel.
// Sem chave configurada, o site funciona normalmente com um fallback visual
// (card + botão "Abrir no Google Maps"), sem nunca tentar carregar um iframe quebrado.

type LocationLike = Pick<
  PropertyBase,
  "title" | "city" | "state" | "neighborhood" | "address" | "reference" | "latitude" | "longitude" | "googleMapsUrl"
>;

const GOOGLE_MAPS_HOSTS = new Set(["www.google.com", "google.com", "maps.google.com", "maps.app.goo.gl", "goo.gl"]);

/** Valida que o link colado pelo usuário é de fato um domínio do Google Maps — nunca confia cegamente no cadastro. */
export function isValidGoogleMapsUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return GOOGLE_MAPS_HOSTS.has(parsed.hostname) && (parsed.hostname !== "goo.gl" || parsed.pathname.startsWith("/maps"));
  } catch {
    return false;
  }
}

/** Texto composto "Bairro, Cidade - UF" — só inclui o que existir. */
export function getLocationLine(property: LocationLike): string {
  const parts = [property.neighborhood, property.city].filter(Boolean);
  let line = parts.join(", ");
  if (property.state) line += line ? ` - ${property.state}` : property.state;
  return line;
}

/** Query textual usada quando não há coordenadas: nome + bairro/cidade/estado. */
function getLocationQuery(property: LocationLike): string | undefined {
  const parts = [property.address, property.neighborhood, property.city, property.state].filter(Boolean);
  if (parts.length === 0) return property.title || undefined;
  return [property.title, ...parts].filter(Boolean).join(", ");
}

/**
 * URL de destino para o botão "Abrir no Google Maps" — nunca exige chave de API.
 * Prioridade: link válido cadastrado > coordenadas > busca por texto (endereço/cidade).
 */
export function getGoogleMapsSearchUrl(property: LocationLike): string | undefined {
  if (isValidGoogleMapsUrl(property.googleMapsUrl)) return property.googleMapsUrl;

  if (property.latitude != null && property.longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`;
  }

  const query = getLocationQuery(property);
  if (!query) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * URL para <iframe> via Maps Embed API — só retorna algo se a chave estiver configurada.
 * Prioridade: coordenadas (mais preciso) > endereço/texto.
 */
export function getMapEmbedUrl(property: LocationLike): string | undefined {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  if (!apiKey) return undefined;

  const q =
    property.latitude != null && property.longitude != null
      ? `${property.latitude},${property.longitude}`
      : getLocationQuery(property);

  if (!q) return undefined;
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(q)}`;
}
