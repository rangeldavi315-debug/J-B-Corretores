"use client";

import { useRef, useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";
import { motion, useMotionValue } from "framer-motion";
import styles from "./Testimonials.module.css";
import RevealOnScroll from "./RevealOnScroll";
import testimonialsData from "../../content/testimonials.json";

export default function Testimonials() {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeTestimonials = testimonialsData.filter(t => t.status === "active");

  return (
    <section id="testimonials" className={styles.section}>
      <div className="container">
        <RevealOnScroll>
          <div className={styles.header}>
            <h2 className="title-premium-center">O Que Dizem Nossos Clientes</h2>
            <p className={styles.intro}>
              A satisfação de quem confia em nossa consultoria é o nosso maior patrimônio.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className={styles.carouselContainer} ref={carouselRef}>
            <motion.div 
              className={styles.grid}
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              whileTap={{ cursor: "grabbing" }}
              style={{ x }}
            >
              {activeTestimonials.map((item) => (
                <motion.div
                  key={item.id}
                  className={styles.card}
                >
                  <Quote size={40} className={styles.quoteIcon} />

                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < item.rating ? "var(--color-secondary)" : "transparent"}
                        className={i < item.rating ? styles.starFilled : styles.starEmpty}
                      />
                    ))}
                  </div>

                  <p className={styles.text}>&ldquo;{item.text}&rdquo;</p>
                  
                  <div className={styles.authorInfo}>
                    <p className={styles.author}>{item.author}</p>
                    <p className={styles.role}>{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
