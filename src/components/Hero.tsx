"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
      {/* BACKGROUND LAYER */}
      <div className={styles.heroBg} />
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
            {/* PURE HTML/SVG 3D LOGO COMPOSITION (NO PNG/JPG) */}
            <div className={styles.cssLogo}>
              <svg 
                viewBox="0 0 600 350" 
                className={styles.logoSvg} 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Rich Gold Gradient */}
                  <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FDEAA8" />
                    <stop offset="25%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#AA771C" />
                    <stop offset="60%" stopColor="#8A5A19" />
                    <stop offset="75%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#FDEAA8" />
                  </linearGradient>

                  {/* 3D Bevel & Lighting Filter */}
                  <filter id="bevel3d" x="-20%" y="-20%" width="140%" height="140%">
                    {/* Inner Shadow / Bevel */}
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                    <feSpecularLighting in="blur" surfaceScale="3" specularConstant="1.2" specularExponent="30" lightingColor="#FFFFFF" result="specOut">
                      <fePointLight x="150" y="-50" z="200" />
                    </feSpecularLighting>
                    <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                    <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="beveled" />
                    
                    {/* Deep Drop Shadow for depth */}
                    <feDropShadow in="beveled" dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.9" result="shadow" />
                    <feDropShadow in="shadow" dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.7" />
                  </filter>
                </defs>

                {/* LOGO GROUP WITH 3D FILTER */}
                <g filter="url(#bevel3d)" fill="url(#gold)">
                  
                  {/* ROOF ORNAMENT */}
                  <path d="M 300 20 L 120 120 H 150 L 300 40 L 450 120 H 480 Z" />
                  <path d="M 430 70 V 120 H 460 V 55 Z" />
                  {/* Roof Window */}
                  <rect x="282" y="75" width="15" height="15" />
                  <rect x="303" y="75" width="15" height="15" />
                  <rect x="282" y="96" width="15" height="15" />
                  <rect x="303" y="96" width="15" height="15" />

                  {/* Roof Arabesques (Stylized Curves) */}
                  <path d="M 300 50 Q 260 90 230 70 Q 250 50 280 80 Q 290 90 300 75" fill="none" stroke="url(#gold)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 300 50 Q 340 90 370 70 Q 350 50 320 80 Q 310 90 300 75" fill="none" stroke="url(#gold)" strokeWidth="6" strokeLinecap="round" />
                  
                  {/* J&B MASSIVE TEXT */}
                  <text 
                    x="300" y="240" 
                    textAnchor="middle" 
                    fontFamily="var(--font-display), serif" 
                    fontSize="180" 
                    fontWeight="500" 
                    letterSpacing="-0.02em"
                  >
                    J&amp;B
                  </text>

                  {/* ORNAMENTAL LINE */}
                  <rect x="150" y="275" width="300" height="2" />
                  <polygon points="300,270 306,276 300,282 294,276" />
                  <path d="M 285 276 Q 275 265 265 276 Q 275 287 285 276" fill="none" stroke="url(#gold)" strokeWidth="2" />
                  <path d="M 315 276 Q 325 265 335 276 Q 325 287 315 276" fill="none" stroke="url(#gold)" strokeWidth="2" />

                  {/* CORRETORES TEXT */}
                  <text 
                    x="300" y="325" 
                    textAnchor="middle" 
                    fontFamily="var(--font-display), serif" 
                    fontSize="36" 
                    fontWeight="400" 
                    letterSpacing="0.4em"
                  >
                    CORRETORES
                  </text>

                </g>
              </svg>
            </div>
            
            {/* Headline */}
            <h1 className={styles.headline}>
              SEU PRÓXIMO IMÓVEL<br />
              COMEÇA COM UMA<br />
              <span className={styles.headlineGold}>ESCOLHA INTELIGENTE.</span>
            </h1>

            {/* Subtitle */}
            <p className={styles.subtitle}>
              Encontramos oportunidades que combinam com o seu<br />
              momento, seu projeto e o seu investimento.
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
                O IMÓVEL CERTO.<br />O NEGÓCIO CERTO.
              </h2>
              <p className={styles.cardDescription}>
                Mais que imóveis, entregamos segurança,<br />
                confiança e as melhores oportunidades<br />
                para você realizar.
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
