// Modelo de dados de imóveis: base comum + payload específico por categoria.
// Cada categoria tem seu próprio conjunto de campos (união discriminada por `category`),
// evitando um cadastro genérico com dezenas de campos opcionais sem sentido entre si.

export type PropertyCategory = "loteamento" | "casa" | "chacara" | "apartamento" | "comercial";

export type PropertyStatus = "draft" | "published" | "reserved" | "sold";

export const CATEGORY_LABELS: Record<PropertyCategory, string> = {
  loteamento: "Loteamento / Lote",
  casa: "Casa",
  chacara: "Chácara",
  apartamento: "Apartamento",
  comercial: "Imóvel Comercial",
};

export const CATEGORY_ICONS: Record<PropertyCategory, string> = {
  loteamento: "🏘️",
  casa: "🏠",
  chacara: "🌳",
  apartamento: "🏢",
  comercial: "🏬",
};

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  reserved: "Reservado",
  sold: "Vendido",
};

/** Selo comercial opcional exibido no card — independente do status interno (rascunho/publicado/etc). */
export type PropertyTag = "venda" | "lancamento" | "oportunidade";

export const TAG_LABELS: Record<PropertyTag, string> = {
  venda: "Venda",
  lancamento: "Lançamento",
  oportunidade: "Oportunidade",
};

export interface SEOData {
  title?: string;
  description?: string;
}

export interface PropertyBase {
  id: string;
  slug: string;
  title: string;
  category: PropertyCategory;
  status: PropertyStatus;
  city: string;
  state?: string;
  neighborhood?: string;
  /** Endereço/rua (opcional — nem todo cadastro tem endereço exato). */
  address?: string;
  /** Linha de contexto sob o endereço, ex: "35 km de Goiânia", "Próximo ao Parque Vaca Brava". */
  reference?: string;
  latitude?: number;
  longitude?: number;
  /** Link do Google Maps colado pelo usuário no cadastro (validado antes de usar como destino do botão). */
  googleMapsUrl?: string;
  description: string;
  coverImage: string;
  /** Ponto focal da imagem de capa/hero (CSS object-position), ex: "50% 30%". */
  coverImagePosition?: string;
  /** Imagem vertical (9:16) opcional para o Hero no mobile. Sem ela, usa coverImage com recorte inteligente. */
  heroImageMobile?: string;
  images: string[];
  featured: boolean;
  /** Selo comercial exibido no card (Venda/Lançamento/Oportunidade) — opcional, não confundir com `status`. */
  tag?: PropertyTag;
  order: number;
  whatsappAgentId: string;
  seo?: SEOData;
  /** Marca cadastros de demonstração (dados fictícios de placeholder). Nunca deve ficar visível publicamente. */
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Condição comercial genérica: preço total, entrada e parcela nunca podem ser confundidos. */
export interface CommercialCondition {
  priceFrom?: number;
  downPayment?: number;
  installment?: number;
  installmentCount?: number;
  conditions?: string;
}

export interface LotData {
  minLotSize?: number;
  maxLotSize?: number;
  availableUnits?: number;
  lotTypes: string[];
  commercial: CommercialCondition;
  infrastructure: string[];
  differentials: string[];
  /** Headline comercial do Hero — vende o benefício, não repete o título. */
  heroHeadline?: string;
  heroSubheadline?: string;
  /** Seção emocional "Por que conhecer". */
  whyKnowTitle?: string;
  whyKnowText?: string;
  /** Texto do CTA principal (ex: "Quero saber as condições"). Se vazio, usa um padrão. */
  ctaLabel?: string;
}

export interface HouseData {
  builtArea?: number;
  lotArea?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  garageSpots?: number;
  livingRooms?: number;
  hasKitchen?: boolean;
  hasLaundry?: boolean;
  leisure: string[];
  price?: number;
  /** true quando o valor é "a partir de" e não um preço fechado. */
  priceFrom?: boolean;
  condominiumFee?: number;
  iptu?: number;
  conditions?: string;
  differentials: string[];
}

export interface FarmData {
  totalArea?: number;
  areaUnit?: "m2" | "ha";
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  garageSpots?: number;
  hasHouse?: boolean;
  builtArea?: number;
  hasPool?: boolean;
  hasBbqArea?: boolean;
  hasGourmetArea?: boolean;
  energyType?: string;
  waterSource?: string;
  access?: string;
  propertyFeatures: string[];
  price?: number;
  priceFrom?: boolean;
  conditions?: string;
  differentials: string[];
}

export interface ApartmentData {
  area?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  garageSpots?: number;
  floor?: number;
  hasElevator?: boolean;
  condominiumFee?: number;
  hasPool?: boolean;
  hasGym?: boolean;
  hasPartyRoom?: boolean;
  hasPortaria?: boolean;
  hasSecurity?: boolean;
  price?: number;
  priceFrom?: boolean;
  conditions?: string;
  differentials: string[];
}

export interface CommercialData {
  /** Tipo de uso comercial — texto livre porque "comercial" cobre loja, sala, galpão, prédio etc. */
  businessType?: string;
  area?: number;
  bathrooms?: number;
  garageSpots?: number;
  floor?: number;
  hasElevator?: boolean;
  condominiumFee?: number;
  hasSecurity?: boolean;
  price?: number;
  priceFrom?: boolean;
  conditions?: string;
  differentials: string[];
}

export interface LotProperty extends PropertyBase {
  category: "loteamento";
  data: LotData;
}

export interface HouseProperty extends PropertyBase {
  category: "casa";
  data: HouseData;
}

export interface FarmProperty extends PropertyBase {
  category: "chacara";
  data: FarmData;
}

export interface ApartmentProperty extends PropertyBase {
  category: "apartamento";
  data: ApartmentData;
}

export interface CommercialProperty extends PropertyBase {
  category: "comercial";
  data: CommercialData;
}

export type Property = LotProperty | HouseProperty | FarmProperty | ApartmentProperty | CommercialProperty;

export interface Agent {
  name: string;
  creci: string;
  phone: string;
  whatsapp: string;
  photo?: string;
}

export function emptyDataForCategory(category: "loteamento"): LotData;
export function emptyDataForCategory(category: "casa"): HouseData;
export function emptyDataForCategory(category: "chacara"): FarmData;
export function emptyDataForCategory(category: "apartamento"): ApartmentData;
export function emptyDataForCategory(category: "comercial"): CommercialData;
export function emptyDataForCategory(category: PropertyCategory): LotData | HouseData | FarmData | ApartmentData | CommercialData;
export function emptyDataForCategory(
  category: PropertyCategory
): LotData | HouseData | FarmData | ApartmentData | CommercialData {
  switch (category) {
    case "loteamento":
      return { lotTypes: [], commercial: {}, infrastructure: [], differentials: [] };
    case "casa":
      return { leisure: [], differentials: [] };
    case "chacara":
      return { propertyFeatures: [], differentials: [] };
    case "apartamento":
      return { differentials: [] };
    case "comercial":
      return { differentials: [] };
  }
}

/** Constrói um Property vazio para a categoria escolhida no wizard de cadastro. */
export function createEmptyProperty(category: PropertyCategory, base: Omit<PropertyBase, "category">): Property {
  switch (category) {
    case "loteamento":
      return { ...base, category, data: emptyDataForCategory("loteamento") };
    case "casa":
      return { ...base, category, data: emptyDataForCategory("casa") };
    case "chacara":
      return { ...base, category, data: emptyDataForCategory("chacara") };
    case "apartamento":
      return { ...base, category, data: emptyDataForCategory("apartamento") };
    case "comercial":
      return { ...base, category, data: emptyDataForCategory("comercial") };
  }
}
