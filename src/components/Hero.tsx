"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import styles from "./Hero.module.css";
import { FaKey } from "react-icons/fa";

export default function Hero() {
  const scrollToProperties = () => {
    const element = document.getElementById("properties");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      
      window.scrollTo({
        top: (elementRect - bodyRect) - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      {/* BACKGROUND LAYER — fachada noturna, única foto cinematográfica */}
      <div className={styles.heroBg}>
        <Image
          src="/images/hero/hero-fachada-noturna.jpg"
          alt="Casa moderna com piscina ao entardecer — J&B Consultores Imobiliários"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center right" }}
        />
      </div>
      <div className={styles.heroOverlay} />

      {/* CONTENT LAYER */}
      <div className={`${styles.container} container`}>
        <div className={styles.contentArea}>
          
          {/* LEFT COLUMN: Logo Composition + Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={styles.leftCol}
          >
            <div className={styles.cssLogo}>
              <div className={styles.logoWrap}>
                <Image
                  src="/brand/isologo.png"
                  alt="J&B Consultores Imobiliários — Mais que imóveis, realizamos histórias"
                  width={1536}
                  height={1024}
                  priority
                  className={styles.logoSvg}
                />
              </div>
            </div>

            {/* Headline */}
            <h1 className={styles.headline}>
              O imóvel certo para a sua<br />
              <span className={styles.headlineGold}>próxima conquista.</span>
            </h1>

            {/* Subtitle */}
            <p className={styles.subtitle}>
              Consultoria completa, atendimento personalizado e segurança<br />
              em todas as etapas — em casas, apartamentos, lotes, chácaras e imóveis comerciais.
            </p>
          </motion.div>

          {/* RIGHT COLUMN: Conversion Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className={styles.rightCol}
          >
            <div className={styles.conversionCard}>
              <div className={styles.cardIcon}>
                <FaKey size={18} />
              </div>
              
              <h2 className={styles.cardTitle}>
                Atendimento humano.<br />Do primeiro contato às chaves.
              </h2>
              <p className={styles.cardDescription}>
                Entendemos sua necessidade e caminhamos<br />
                com você em cada etapa, com clareza<br />
                e segurança jurídica.
              </p>
              <button onClick={scrollToProperties} className={styles.cardCta}>
                <span>VER IMÓVEIS DISPONÍVEIS</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
