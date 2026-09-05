"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Better whatsapp icon
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";
import companyData from "../../content/company.json";

const navItems = [
  { id: "home", label: "INÍCIO" },
  { id: "properties", label: "IMÓVEIS" },
  { id: "properties", label: "LOTEAMENTOS" }, // Routing to properties for now
  { id: "properties", label: "EMPREENDIMENTOS" },
  { id: "about", label: "SOBRE NÓS" },
  { id: "final-cta", label: "CONTATO" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const primaryAgent = companyData.agents[0];
  const whatsappUrl = `https://wa.me/${primaryAgent.whatsapp}?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20os%20imóveis%20disponíveis.`;

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logoContainer} onClick={() => scrollToSection("home")}>
            <Image
              src="/logo.png"
              alt={companyData.name}
              width={68}
              height={68}
              className={styles.logo}
              priority
            />
            <svg
              viewBox="70 100 460 240"
              className={styles.brandSvg}
              role="img"
              aria-label="J&amp;B Corretores"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="headerGold" gradientUnits="userSpaceOnUse" x1="300" y1="100" x2="300" y2="340">
                  <stop offset="0%" stopColor="#FDEAA8" />
                  <stop offset="25%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#AA771C" />
                  <stop offset="60%" stopColor="#8A5A19" />
                  <stop offset="75%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#FDEAA8" />
                </linearGradient>
                <filter id="headerBevel3d" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                  <feSpecularLighting in="blur" surfaceScale="3" specularConstant="1.2" specularExponent="30" lightingColor="#FFFFFF" result="specOut">
                    <fePointLight x="150" y="-50" z="200" />
                  </feSpecularLighting>
                  <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                  <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="beveled" />
                  <feDropShadow in="beveled" dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.85" />
                </filter>
              </defs>
              <g filter="url(#headerBevel3d)" fill="url(#headerGold)">
                <text x="300" y="240" textAnchor="middle" fontFamily="var(--font-display), serif" fontSize="180" fontWeight="500" letterSpacing="-0.02em">
                  J&amp;B
                </text>
                <rect x="150" y="275" width="300" height="2" />
                <polygon points="300,270 306,276 300,282 294,276" />
                <path d="M 285 276 Q 275 265 265 276 Q 275 287 285 276" fill="none" stroke="url(#headerGold)" strokeWidth="2" />
                <path d="M 315 276 Q 325 265 335 276 Q 325 287 315 276" fill="none" stroke="url(#headerGold)" strokeWidth="2" />
                <text x="300" y="325" textAnchor="middle" fontFamily="var(--font-display), serif" fontSize="36" fontWeight="400" letterSpacing="0.4em">
                  CORRETORES
                </text>
              </g>
            </svg>
          </div>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav}>
            {navItems.map((item, index) => (
              <button 
                key={`${item.id}-${index}`} 
                onClick={() => scrollToSection(item.id)} 
                className={`${styles.navLink} ${activeSection === item.id ? styles.navActive : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop WhatsApp CTA */}
          <div className={styles.actions}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <FaWhatsapp size={18} />
              <span>FALAR PELO WHATSAPP</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} className={styles.goldText} /> : <Menu size={28} className={styles.goldText} />}
          </button>
        </div>
        
        {/* Bottom line */}
        <div className={styles.headerLine} />
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.mobileMenu}
          >
            <motion.nav 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.mobileNav}
            >
              {navItems.map((item, index) => (
                <button 
                  key={`${item.id}-${index}`} 
                  onClick={() => scrollToSection(item.id)} 
                  className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.mobileActive : ""}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className={styles.mobileMenuDivider} />
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileWhatsapp}
              >
                <FaWhatsapp size={20} />
                <span>FALAR PELO WHATSAPP</span>
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
