// Fonte única de verdade para filtro, ordenação e facetas do grid de empreendimentos.
// Mantém a lógica fora do componente para que Properties.tsx só cuide de UI/estado.

import type { Property, PropertyCategory } from "@/types/property";
import { CATEGORY_LABELS } from "@/types/property";

export type SortOption = "relevance" | "price-asc" | "price-desc";

export interface CatalogFilters {
  category: "todos" | PropertyCategory;
  city: string; // "todas" = sem filtro
  minBedrooms: number; // 0 = sem filtro
  maxPrice: number; // 0 = sem filtro (usa o teto real)
  sort: SortOption;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  category: "todos",
  city: "todas",
  minBedrooms: 0,
  maxPrice: 0,
  sort: "relevance",
};

export function isDefaultFilters(filters: CatalogFilters): boolean {
  return (
    filters.category === DEFAULT_FILTERS.category &&
    filters.city === DEFAULT_FILTERS.city &&
    filters.minBedrooms === DEFAULT_FILTERS.minBedrooms &&
    filters.maxPrice === DEFAULT_FILTERS.maxPrice &&
    filters.sort === DEFAULT_FILTERS.sort
  );
}

/** Preço de referência para ordenar/filtrar — nunca mistura entrada/parcela com preço total. */
export function getEffectivePrice(property: Property): number | undefined {
  if (property.category === "loteamento") return property.data.commercial.priceFrom;
  return property.data.price;
}

export function getBedrooms(property: Property): number | undefined {
  if (property.category === "loteamento") return undefined;
  return property.data.bedrooms;
}

function matchesCategory(property: Property, filters: CatalogFilters): boolean {
  return filters.category === "todos" || property.category === filters.category;
}

function matchesCity(property: Property, filters: CatalogFilters): boolean {
  return filters.city === "todas" || property.city === filters.city;
}

function matchesBedrooms(property: Property, filters: CatalogFilters): boolean {
  if (filters.minBedrooms <= 0) return true;
  const bedrooms = getBedrooms(property);
  return bedrooms != null && bedrooms >= filters.minBedrooms;
}

function matchesPrice(property: Property, filters: CatalogFilters): boolean {
  if (filters.maxPrice <= 0) return true;
  const price = getEffectivePrice(property);
  // Sem preço cadastrado (ex.: "sob consulta") permanece visível — não penaliza cadastro incompleto.
  return price == null || price <= filters.maxPrice;
}

type FacetKey = keyof Pick<CatalogFilters, "category" | "city" | "minBedrooms" | "maxPrice">;

/** Aplica todos os filtros exceto um — usado para contar quantos itens cada opção de faceta liberaria. */
function applyExcept(properties: Property[], filters: CatalogFilters, except: FacetKey): Property[] {
  return properties.filter((p) => {
    if (except !== "category" && !matchesCategory(p, filters)) return false;
    if (except !== "city" && !matchesCity(p, filters)) return false;
    if (except !== "minBedrooms" && !matchesBedrooms(p, filters)) return false;
    if (except !== "maxPrice" && !matchesPrice(p, filters)) return false;
    return true;
  });
}

export function filterProperties(properties: Property[], filters: CatalogFilters): Property[] {
  return properties.filter(
    (p) =>
      matchesCategory(p, filters) &&
      matchesCity(p, filters) &&
      matchesBedrooms(p, filters) &&
      matchesPrice(p, filters)
  );
}

export function sortProperties(properties: Property[], sort: SortOption): Property[] {
  const sorted = [...properties];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => {
        const pa = getEffectivePrice(a);
        const pb = getEffectivePrice(b);
        if (pa == null && pb == null) return (a.order || 0) - (b.order || 0);
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pa - pb;
      });
    case "price-desc":
      return sorted.sort((a, b) => {
        const pa = getEffectivePrice(a);
        const pb = getEffectivePrice(b);
        if (pa == null && pb == null) return (a.order || 0) - (b.order || 0);
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pb - pa;
      });
    case "relevance":
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (a.order || 0) - (b.order || 0);
      });
  }
}

export interface FacetOption<T> {
  id: T;
  label: string;
  count: number;
}

export interface CatalogFacets {
  categories: FacetOption<"todos" | PropertyCategory>[];
  cities: FacetOption<string>[];
  bedroomOptions: number[];
  priceCeiling: number;
}

/** Facetas dinâmicas: cada opção mostra quantos itens sobrariam se ela fosse escolhida, dado o resto dos filtros ativos. */
export function computeFacets(properties: Property[], filters: CatalogFilters): CatalogFacets {
  const forCategory = applyExcept(properties, filters, "category");
  const forCity = applyExcept(properties, filters, "city");
  const forBedrooms = applyExcept(properties, filters, "minBedrooms");

  const categoryIds = Array.from(new Set(properties.map((p) => p.category))) as PropertyCategory[];
  const categories: FacetOption<"todos" | PropertyCategory>[] = [
    { id: "todos", label: "Todos", count: forCategory.length },
    ...categoryIds.map((id) => ({
      id,
      label: CATEGORY_LABELS[id],
      count: forCategory.filter((p) => p.category === id).length,
    })),
  ];

  const cityNames = Array.from(new Set(properties.map((p) => p.city))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const cities: FacetOption<string>[] = [
    { id: "todas", label: "Todas as cidades", count: forCity.length },
    ...cityNames.map((city) => ({
      id: city,
      label: city,
      count: forCity.filter((p) => p.city === city).length,
    })),
  ];

  const bedroomOptions = Array.from(
    new Set(
      forBedrooms
        .map((p) => getBedrooms(p))
        .filter((b): b is number => b != null && b > 0)
    )
  ).sort((a, b) => a - b);

  const allPrices = properties.map((p) => getEffectivePrice(p)).filter((p): p is number => p != null);
  const priceCeiling = allPrices.length > 0 ? Math.max(...allPrices) : 0;

  return { categories, cities, bedroomOptions, priceCeiling };
}
