"use client";

import Image from "next/image";
import { MessageSquare, ArrowRight } from "lucide-react";
import styles from "./FinalCTA.module.css";
import companyData from "../../content/company.json";
import RevealOnScroll from "./RevealOnScroll";

export default function FinalCTA() {
  const [jonathan, barbara] = companyData.agents;

  const steps = [
    { num: "01", title: "Fale Conosco", desc: "Entre em contato via WhatsApp" },
    { num: "02", title: "Agenda Privativa", desc: "Consultoria exclusiva e sigilosa" },
    { num: "03", title: "Imóvel Ideal", desc: "Fechamento com segurança" },
  ];

  return (
    <section id="final-cta" className={styles.section}>
      <div className={styles.animatedBg} />
      <div className={`${styles.container} container`}>
        <RevealOnScroll>
          <div className={styles.glassPanel}>
            
            <div className={styles.content}>
              <h2 className={styles.title}>Agende uma Consultoria Privativa</h2>
              <p className={styles.description}>
                Estamos prontos para ouvir suas necessidades e planejar a aquisição do seu imóvel ideal com segurança e privacidade. Fale diretamente com o consultor de sua escolha.
              </p>

              {/* Timeline Steps */}
              <div className={styles.timeline}>
                {steps.map((step, idx) => (
                  <div key={idx} className={styles.step}>
                    <div className={styles.stepNum}>{step.num}</div>
                    <div className={styles.stepInfo}>
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                    {idx < steps.length - 1 && (
                      <ArrowRight size={16} className={styles.stepArrow} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.agentsGrid}>
              {/* Jonathan */}
              <div className={styles.agentCard}>
                <div className={styles.agentHeader}>
                  <div className={styles.avatarPlaceholder}>
                    <Image src="/images/agents/jonathan.jpg" alt={jonathan.name} fill style={{ objectFit: "cover" }} sizes="50px" />
                  </div>
                  <div>
                    <h3 className={styles.agentName}>{jonathan.name}</h3>
                    <div className={styles.agentCreci}>C.F.: {jonathan.creci}</div>
                  </div>
                </div>
                <a 
                  href={`https://wa.me/${jonathan.whatsapp}?text=Olá,%20Jonathan.%20Gostaria%20de%20agendar%20uma%20consultoria%20imobiliária.`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ width: "100%" }}
                >
                  <MessageSquare size={16} />
                  <span>Falar com Jonathan</span>
                </a>
              </div>

              {/* Bárbara Rios */}
              <div className={styles.agentCard}>
                <div className={styles.agentHeader}>
                  <div className={styles.avatarPlaceholder}>
                    <Image src="/images/agents/barbara.jpg" alt={barbara.name} fill style={{ objectFit: "cover" }} sizes="50px" />
                  </div>
                  <div>
                    <h3 className={styles.agentName}>{barbara.name}</h3>
                    <div className={styles.agentCreci}>C.F.: {barbara.creci}</div>
                  </div>
                </div>
                <a 
                  href={`https://wa.me/${barbara.whatsapp}?text=Olá,%20Bárbara.%20Gostaria%20de%20agendar%20uma%20consultoria%20imobiliária.`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ width: "100%" }}
                >
                  <MessageSquare size={16} />
                  <span>Falar com Bárbara</span>
                </a>
              </div>
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
