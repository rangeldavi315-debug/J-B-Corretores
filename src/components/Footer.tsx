"use client";

import Image from "next/image";
import { Instagram, Phone, MapPin, Mail, Shield } from "lucide-react";
import styles from "./Footer.module.css";
import companyData from "../../content/company.json";
import socialData from "../../content/social.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [jonathan, barbara] = companyData.agents;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
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
    <footer className={styles.footer}>
      <div className={styles.goldSeparator} />
      
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {/* Brand Col */}
          <div className={styles.col}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <Image
              src="/logo.png"
              alt={companyData.name}
              width={50}
              height={50}
              className={styles.logo}
            />
            <div>
              <p style={{ fontFamily: "var(--font-trajan)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>JB Consultores</p>
              <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>Imobiliários</p>
            </div>
          </div>
            <p className={styles.about}>{companyData.about}</p>
            <div className={styles.social}>
              <a href={socialData.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Instagram size={20} />
              </a>
              {/* Other socials could go here */}
            </div>
            
            <div className={styles.creciBadge}>
              <Shield size={16} className="gold-highlight" />
              <span>CRECI Registrado</span>
            </div>
          </div>

          {/* Links Col */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navegação</h4>
            <nav className={styles.nav}>
              <button onClick={() => scrollToSection("home")}>Início</button>
              <button onClick={() => scrollToSection("about")}>Quem Somos</button>
              <button onClick={() => scrollToSection("properties")}>Empreendimentos</button>
              <button onClick={() => scrollToSection("diferenciais")}>Diferenciais</button>
              <button onClick={() => scrollToSection("testimonials")}>Depoimentos</button>
              <a href="/admin" className={styles.adminLink}>Acesso Restrito</a>
            </nav>
          </div>

          {/* Contact Col */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contato</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin size={18} className="gold-highlight" />
                <span>{companyData.address}</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={18} className="gold-highlight" />
                <span>{companyData.email}</span>
              </div>
              
              <div className={styles.contactItem} style={{ marginTop: "1rem" }}>
                <Phone size={18} className="gold-highlight" />
                <div className={styles.phones}>
                  <p><strong>{jonathan.name}:</strong> {jonathan.phone}</p>
                  <p><strong>{barbara.name}:</strong> {barbara.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {currentYear} {companyData.name}. Todos os direitos reservados.</p>
          <p className={styles.credits}>
            <a href="https://uall-desing.vercel.app" target="_blank" rel="noopener noreferrer">Feito por Uall Design</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
