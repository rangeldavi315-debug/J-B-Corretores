"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, ChevronDown } from "lucide-react";
import styles from "./Hero.module.css";
import companyData from "../../content/company.json";
import { useParallax } from "../hooks/useParallax";

export default function Hero() {
  const primaryAgent = companyData.agents[0];
  const parallaxRef = useParallax(0.3); // Moves background 30% speed

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
      {/* Parallax Background Image */}
      <div className={styles.parallaxContainer}>
        <div ref={parallaxRef} className={styles.heroBackground} />
      </div>
      
      <div className={styles.overlay} />

      {/* Floating Particles */}
      <div className={styles.particlesContainer}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`${styles.particle} ${styles["particle" + (i + 1)]}`} />
        ))}
      </div>

      <div className={`${styles.container} container`}>
        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className={styles.headline}>
              Exclusividade <span className="gold-highlight text-gradient-gold">em cada detalhe</span>,<br />
              Segurança em cada negócio
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={styles.subheadline}
          >
            Lotes, casas e imóveis para todos os gostos! Encontre o imóvel ideal para você, com atendimento do jeito que merece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className={styles.buttonGroup}
          >
            <button onClick={scrollToProperties} className={`btn-primary ${styles.heroBtnPrimary}`}>
              <span>Encontrar meu imóvel</span>
              <ArrowRight size={18} />
            </button>
            
            <a
              href={`https://wa.me/${primaryAgent.whatsapp}?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20as%20opções%20de%20imóveis%20exclusivos.`}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-secondary ${styles.heroBtnSecondary}`}
            >
              <MessageSquare size={18} className="gold-highlight" />
              <span>Falar pelo WhatsApp</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Animated Bottom Accent Line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
        className={styles.bottomAccent} 
      />

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className={styles.scrollIndicator}
      >
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
        <ChevronDown size={20} className={styles.chevron} />
      </motion.div>
    </section>
  );
}
