"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import styles from "./PropertyFilters.module.css";
import type { CatalogFilters, CatalogFacets, SortOption } from "@/lib/catalog";
import { isDefaultFilters } from "@/lib/catalog";
import { formatBRL } from "@/lib/propertyPresentation";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevância",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
};

interface Props {
  filters: CatalogFilters;
  facets: CatalogFacets;
  resultCount: number;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onClear: () => void;
}

export default function PropertyFilters({ filters, facets, resultCount, onChange, onClear }: Props) {
  const isMobile = useIsMobileViewport();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isFiltered = !isDefaultFilters(filters);

  const activeSecondaryCount = [
    filters.city !== "todas",
    filters.minBedrooms > 0,
    filters.maxPrice > 0,
    filters.sort !== "relevance",
  ].filter(Boolean).length;

  const secondaryControls = (
    <>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Cidade</span>
        <select
          className={styles.select}
          value={filters.city}
          onChange={(e) => onChange({ city: e.target.value })}
        >
          {facets.cities.map((c) => (
            <option key={c.id} value={c.id} disabled={c.count === 0 && c.id !== filters.city}>
              {c.label} {c.id !== "todas" ? `(${c.count})` : ""}
            </option>
          ))}
        </select>
      </label>

      {facets.bedroomOptions.length > 0 && (
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Quartos</span>
          <select
            className={styles.select}
            value={filters.minBedrooms}
            onChange={(e) => onChange({ minBedrooms: Number(e.target.value) })}
          >
            <option value={0}>Qualquer</option>
            {facets.bedroomOptions.map((n) => (
              <option key={n} value={n}>
                {n}+ quarto{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
      )}

      {facets.priceCeiling > 0 && (
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Valor até</span>
          <select
            className={styles.select}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          >
            <option value={0}>Sem limite</option>
            {[0.25, 0.5, 0.75, 1].map((frac) => {
              const value = Math.ceil((facets.priceCeiling * frac) / 10000) * 10000;
              return (
                <option key={frac} value={value}>
                  Até {formatBRL(value)}
                </option>
              );
            })}
          </select>
        </label>
      )}

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Ordenar por</span>
        <select
          className={styles.select}
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as SortOption })}
        >
          {Object.entries(SORT_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.categoryTabs}>
        {facets.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange({ category: cat.id })}
            className={`${styles.tabBtn} ${filters.category === cat.id ? styles.activeTab : ""}`}
            disabled={cat.count === 0 && filters.category !== cat.id}
          >
            <span className={styles.tabLabel}>
              {cat.label}
              <span className={styles.tabCount}>{cat.count}</span>
            </span>
            {filters.category === cat.id && (
              <motion.div
                layoutId="propertiesTabBg"
                className={styles.tabBackground}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {isMobile ? (
        <div className={styles.mobileBar}>
          <button className={styles.filterToggle} onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal size={16} />
            <span>Filtros</span>
            {activeSecondaryCount > 0 && <span className={styles.filterBadge}>{activeSecondaryCount}</span>}
          </button>
          <span className={styles.resultCount}>{resultCount} encontrados</span>
        </div>
      ) : (
        <div className={styles.desktopBar}>
          <div className={styles.desktopControls}>{secondaryControls}</div>
          <div className={styles.desktopMeta}>
            {isFiltered && (
              <button className={styles.clearBtn} onClick={onClear}>
                <X size={14} />
                Limpar filtros
              </button>
            )}
            <span className={styles.resultCount}>{resultCount} imóveis encontrados</span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isMobile && drawerOpen && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className={styles.drawer}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.drawerHeader}>
                <span>Filtrar imóveis</span>
                <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.drawerControls}>{secondaryControls}</div>
              <div className={styles.drawerFooter}>
                <button
                  className={styles.drawerClearBtn}
                  onClick={() => {
                    onClear();
                  }}
                >
                  Limpar filtros
                </button>
                <button className={styles.drawerApplyBtn} onClick={() => setDrawerOpen(false)}>
                  Ver {resultCount} imóveis
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
