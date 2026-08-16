"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, MessageSquare, Maximize2 } from "lucide-react";
import styles from "./Properties.module.css";
import initialProperties from "../../content/properties.json";
import companyData from "../../content/company.json";
import RevealOnScroll from "./RevealOnScroll";
import PropertyFilters from "./PropertyFilters";
import type { Agent, Property, PropertyCategory } from "@/types/property";
import { CATEGORY_LABELS } from "@/types/property";
import { getCardHeadlinePrice, getCardSpecs, buildWhatsAppLink } from "@/lib/propertyPresentation";
import { DEFAULT_FILTERS, computeFacets, filterProperties, sortProperties, isDefaultFilters } from "@/lib/catalog";
import type { CatalogFilters } from "@/lib/catalog";

const agents = companyData.agents as Agent[];
const VISIBLE_STATUSES = new Set(["published", "reserved", "sold"]);

function filtersFromSearchParams(params: URLSearchParams): CatalogFilters {
  const category = params.get("categoria");
  const city = params.get("cidade");
  const minBedrooms = params.get("quartos");
  const maxPrice = params.get("precoMax");
  const sort = params.get("ordenar");

  return {
    category: (category as "todos" | PropertyCategory) || DEFAULT_FILTERS.category,
    city: city || DEFAULT_FILTERS.city,
    minBedrooms: minBedrooms ? Number(minBedrooms) : DEFAULT_FILTERS.minBedrooms,
    maxPrice: maxPrice ? Number(maxPrice) : DEFAULT_FILTERS.maxPrice,
    sort: (sort as CatalogFilters["sort"]) || DEFAULT_FILTERS.sort,
  };
}

function searchParamsFromFilters(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.category !== DEFAULT_FILTERS.category) params.set("categoria", filters.category);
  if (filters.city !== DEFAULT_FILTERS.city) params.set("cidade", filters.city);
  if (filters.minBedrooms !== DEFAULT_FILTERS.minBedrooms) params.set("quartos", String(filters.minBedrooms));
  if (filters.maxPrice !== DEFAULT_FILTERS.maxPrice) params.set("precoMax", String(filters.maxPrice));
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("ordenar", filters.sort);
  return params.toString();
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>(initialProperties as Property[]);
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const hydratedFromUrl = useRef(false);

  useEffect(() => {
    fetch("/api/admin/properties")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProperties(data as Property[]);
        }
      })
      .catch(() => {
        // Fallback to static import if fetch fails
      });
  }, []);

  // Hidrata os filtros a partir da URL uma única vez, no mount (página é estática, sem window no servidor).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if ([...params.keys()].length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza estado inicial com a URL do navegador, sem equivalente em render
      setFilters(filtersFromSearchParams(params));
    }
    hydratedFromUrl.current = true;
  }, []);

  // Mantém a URL sincronizada com os filtros ativos (sem navegação/reload).
  useEffect(() => {
    if (!hydratedFromUrl.current) return;
    const query = searchParamsFromFilters(filters);
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", url + window.location.hash);
  }, [filters]);

  const visibleProperties = useMemo(
    () => properties.filter((p) => VISIBLE_STATUSES.has(p.status) && !p.isDemo),
    [properties]
  );

  const facets = useMemo(() => computeFacets(visibleProperties, filters), [visibleProperties, filters]);

  const filteredProperties = useMemo(
    () => sortProperties(filterProperties(visibleProperties, filters), filters.sort),
    [visibleProperties, filters]
  );

  const handleFilterChange = (patch: Partial<CatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleClear = () => setFilters(DEFAULT_FILTERS);

  return (
    <section id="properties" className={styles.section}>
      <div className="container">
        <RevealOnScroll>
          <div className={styles.header}>
            <span className={styles.tagline}>Nossos Empreendimentos</span>
            <h2 className="title-premium-center">Portfólio Exclusivo</h2>
            <p className={styles.intro}>
              Selecione uma categoria abaixo para explorar oportunidades únicas de investimento e moradia de alto padrão.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <PropertyFilters
            filters={filters}
            facets={facets}
            resultCount={filteredProperties.length}
            onChange={handleFilterChange}
            onClear={handleClear}
          />
        </RevealOnScroll>

        {/* Properties Grid */}
        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((prop, index) => {
              const agent = agents.find((a) => a.whatsapp === prop.whatsappAgentId) ?? agents[0];
              const whatsappLink = buildWhatsAppLink(agent, prop);
              const headlinePrice = getCardHeadlinePrice(prop);
              const cardSpecs = getCardSpecs(prop);

              return (
                <motion.article
                  layout
                  key={prop.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={styles.card}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={prop.coverImage}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.image}
                      loading="lazy"
                    />
                    <div className={styles.imageOverlay}>
                      <Maximize2 size={32} className={styles.expandIcon} />
                    </div>

                    {prop.featured && <div className={styles.featuredBadge}>Destaque</div>}

                    <div className={styles.categoryBadge}>{CATEGORY_LABELS[prop.category]}</div>
                  </div>

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{prop.title}</h3>
                    <p className={styles.cardCity}>
                      <MapPin size={12} style={{ display: "inline", verticalAlign: "-1px", marginRight: "0.3rem" }} />
                      {prop.city}
                    </p>
                    <p className={styles.cardDescription}>{prop.description}</p>

                    {/* Price and Specs */}
                    <div className={styles.cardSpecsWrapper}>
                      <p className={styles.cardPrice}>{headlinePrice || "Sob consulta"}</p>

                      {cardSpecs.length > 0 && (
                        <div className={styles.cardSpecs}>
                          {cardSpecs.map((spec) => (
                            <span key={spec}>{spec}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.cardFooter}>
                      <a href={`/imovel/${prop.slug}`} className={styles.detailLink}>
                        Ver detalhes
                      </a>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
                        <MessageSquare size={16} />
                        <span>Quero saber mais</span>
                      </a>
                    </div>
                  </div>

                  {/* Hover animated bottom line */}
                  <div className={styles.cardBottomLine} />
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProperties.length === 0 && (
          <div className={styles.empty}>
            <p>
              {isDefaultFilters(filters)
                ? "Nenhum empreendimento ativo no momento."
                : "Nenhum empreendimento encontrado com esses filtros."}
            </p>
            {!isDefaultFilters(filters) && (
              <button className={styles.emptyClearBtn} onClick={handleClear}>
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
