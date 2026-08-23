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
            <div className={styles.brandText}>
              <span className={styles.brandMain}>J&amp;B</span>
              <span className={styles.brandSub}>Corretores</span>
            </div>
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
