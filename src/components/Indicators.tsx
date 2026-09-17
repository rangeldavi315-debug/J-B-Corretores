"use client";

import { motion } from "framer-motion";
import { Home, Building2, LandPlot, Trees, Store } from "lucide-react";
import styles from "./Indicators.module.css";
import type { PropertyCategory } from "@/types/property";

const categories: { icon: typeof Home; category: PropertyCategory; label: string; description: string }[] = [
  { icon: Home, category: "casa", label: "Casas", description: "Seu novo lar" },
  { icon: Building2, category: "apartamento", label: "Apartamentos", description: "Praticidade e localização" },
  { icon: LandPlot, category: "loteamento", label: "Lotes", description: "Investimento inteligente" },
  { icon: Trees, category: "chacara", label: "Chácaras", description: "Qualidade de vida" },
  { icon: Store, category: "comercial", label: "Comerciais", description: "Oportunidades para o seu negócio" },
];

/** Nome do evento que a faixa de categorias dispara — Properties.tsx escuta pra filtrar o grid. */
export const CATEGORY_FILTER_EVENT = "jb:filter-category";

export default function Indicators() {
  const goToCategory = (category: PropertyCategory) => {
    window.dispatchEvent(new CustomEvent(CATEGORY_FILTER_EVENT, { detail: category }));
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.section}>
      {/* Faixa de categorias — leva direto pro grid já filtrado */}
      <div className={styles.stripWrapper}>
        <div className={`${styles.strip} container`}>
          {categories.map((item, index) => (
            <motion.button
              key={item.category}
              type="button"
              onClick={() => goToCategory(item.category)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={styles.benefit}
            >
              <div className={styles.benefitIcon}>
                <item.icon size={32} strokeWidth={1.5} />
              </div>
              <div className={styles.benefitText}>
                <h4 className={styles.benefitTitle}>{item.label}</h4>
                <p className={styles.benefitDesc}>{item.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`${styles.taglineWrapper} container`}
      >
        <p className={styles.taglineWords}>
          <span>CONEXÃO</span>
          <span className={styles.diamond}>◆</span>
          <span>EXPERIÊNCIA</span>
          <span className={styles.diamond}>◆</span>
          <span>RESULTADO</span>
        </p>
        <p className={styles.taglineSub}>
          J&amp;B CONSULTORES IMOBILIÁRIOS — MAIS QUE IMÓVEIS, REALIZAMOS HISTÓRIAS.
        </p>
        <div className={styles.ornament}>
          <div className={styles.ornamentLine} />
          <div className={styles.ornamentCenter}>
            <span className={styles.ornamentDiamond}>◆</span>
          </div>
          <div className={styles.ornamentLine} />
        </div>
      </motion.div>
    </section>
  );
}
