"use client";

import { UserCheck, Shield, Eye, Bookmark, Activity, type LucideIcon } from "lucide-react";
import styles from "./Diferenciais.module.css";
import RevealOnScroll from "./RevealOnScroll";
import companyData from "../../content/company.json";

// Map string icons from JSON to actual Lucide components
const IconMap: Record<string, LucideIcon> = {
  UserCheck,
  Shield,
  Eye,
  Bookmark,
  Activity,
};

export default function Diferenciais() {
  const { diferenciais } = companyData;

  return (
    <section id="diferenciais" className={styles.section}>
      <div className="container">
        <RevealOnScroll>
          <div className={styles.header}>
            <h2 className="title-premium-center">Nossos Diferenciais</h2>
            <p className={styles.intro}>
              A excelência não é uma promessa, é a nossa metodologia de trabalho
              aplicada em cada transação.
            </p>
          </div>
        </RevealOnScroll>

        <div className={styles.grid}>
          {diferenciais.map((item, index) => {
            const Icon = IconMap[item.icon] || UserCheck;
            // First two cards are larger in the grid
            const isLarge = index === 0 || index === 1;

            return (
              <RevealOnScroll
                key={index}
                delay={index * 0.1}
                className={isLarge ? styles.largeCard : styles.card}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardNumber}>
                    0{index + 1}
                  </div>
                  <div className={styles.iconWrapper}>
                    <Icon size={32} className={styles.icon} />
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
