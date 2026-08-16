"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import styles from "./AboutUs.module.css";
import companyData from "../../content/company.json";
import RevealOnScroll from "./RevealOnScroll";

export default function AboutUs() {
  const scrollToFinalCta = () => {
    document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className={styles.section}>
      <div className={`${styles.container} container`}>
        <div className={styles.imageColumn}>
          <RevealOnScroll direction="right">
            <div className={styles.imageWrapper}>
              <div className={styles.imageFrame} />
              <Image
                src="/images/agents.jpg"
                alt="Corretores JB Consultoria"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.image}
              />
              <div className={styles.badge}>
                <span className={styles.badgeText}>Desde 2014</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className={styles.textColumn}>
          <RevealOnScroll direction="left">
            <span className={styles.tagline}>Quem Somos</span>
            <h2 className="title-premium">Sua Conquista é Nosso Legado</h2>
            
            <p className={styles.description}>
              {companyData.about}
            </p>

            <div className={styles.agentsInfo}>
              <p>Conheça nossos consultores especialistas:</p>
              <ul>
                {companyData.agents.map((agent) => (
                  <li key={agent.creci}>
                    <strong>{agent.name}</strong> – CRECI F {agent.creci}
                  </li>
                ))}
              </ul>
            </div>

            <div className="gold-separator" />

            <div className={styles.valuesList}>
              <div className={styles.valueItem}>
                <Check size={20} className="gold-highlight" />
                <span>Atendimento Private e Exclusivo</span>
              </div>
              <div className={styles.valueItem}>
                <Check size={20} className="gold-highlight" />
                <span>Segurança Jurídica Absoluta</span>
              </div>
              <div className={styles.valueItem}>
                <Check size={20} className="gold-highlight" />
                <span>Parceria de Longo Prazo</span>
              </div>
            </div>

            <button onClick={scrollToFinalCta} className="btn-secondary" style={{ marginTop: "2rem" }}>
              Conheça nossa consultoria
            </button>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
