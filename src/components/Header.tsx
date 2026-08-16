"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import styles from "./Header.module.css";
import companyData from "../../content/company.json";

const navItems = [
  { id: "home", label: "Início" },
  { id: "about", label: "Quem Somos" },
  { id: "properties", label: "Empreendimentos" },
  { id: "diferenciais", label: "Diferenciais" },
  { id: "testimonials", label: "Depoimentos" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers = navItems.map((item) => {
      const element = document.getElementById(item.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(item.id);
            }
          });
        },
        { rootMargin: "-50% 0px -50% 0px" } // trigger when section is in the middle of viewport
      );
      observer.observe(element);
      return { element, observer };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.element);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
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

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={`${styles.container} container`}>
          <div className={styles.logoContainer} onClick={() => scrollToSection("home")}>
            <Image
              src="/logo.png"
              alt={companyData.name}
              width={72}
              height={72}
              className={styles.logo}
              priority
            />
          </div>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => scrollToSection(item.id)} 
                className={`${styles.navLink} ${activeSection === item.id ? styles.active : ""}`}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="headerNavIndicator"
                    className={styles.navIndicator}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.actions}>
            <button onClick={() => scrollToSection("final-cta")} className="btn-primary">
              Quero Consultoria
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} className="gold-highlight" /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Progress Bar */}
        <motion.div className={styles.progressBar} style={{ scaleX }} />
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
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
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => scrollToSection(item.id)} 
                  className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.mobileActive : ""}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className={styles.mobileMenuDivider} />
              
              <button onClick={() => scrollToSection("final-cta")} className="btn-primary" style={{ width: "100%" }}>
                Quero Consultoria
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
