"use client";

import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, Home, Handshake } from "lucide-react";
import styles from "./Indicators.module.css";

const benefits = [
  {
    icon: ShieldCheck,
    title: "NEGÓCIOS\nSEGUROS",
    description: "Transparência e segurança\nem cada etapa.",
  },
  {
    icon: UserCheck,
    title: "ATENDIMENTO\nPERSONALIZADO",
    description: "Entendemos você para\nentregar o melhor.",
  },
  {
    icon: Home,
    title: "IMÓVEIS\nSELECIONADOS",
    description: "Opções escolhidas com\ncritério e excelência.",
  },
  {
    icon: Handshake,
    title: "EXPERIÊNCIA QUE\nGERA CONFIANÇA",
    description: "Anos de mercado, resultados\ne clientes satisfeitos.",
  },
];

export default function Indicators() {
  return (
    <section className={styles.section}>
      {/* Benefits Strip */}
      <div className={styles.stripWrapper}>
        <div className={`${styles.strip} container`}>
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={styles.benefit}
            >
              <div className={styles.benefitIcon}>
                <item.icon size={36} strokeWidth={1.5} />
              </div>
              <div className={styles.benefitText}>
                <h4 className={styles.benefitTitle}>{item.title}</h4>
                <p className={styles.benefitDesc}>{item.description}</p>
              </div>
            </motion.div>
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
          J&B CORRETORES, CONECTANDO VOCÊ AO IMÓVEL CERTO E AO FUTURO QUE VOCÊ MERECE.
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
