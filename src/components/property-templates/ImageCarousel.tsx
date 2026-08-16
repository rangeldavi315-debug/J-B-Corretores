"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import styles from "./ImageCarousel.module.css";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  intervalMs?: number;
  priority?: boolean;
  showIndicators?: boolean;
  showArrows?: boolean;
  objectPosition?: string;
  sizes?: string;
  className?: string;
  onIndexChange?: (index: number) => void;
}

/**
 * Carrossel de imagens com crossfade, autoplay, pausa em hover/interação/swipe
 * e respeito a prefers-reduced-motion. Usado no Hero e na Galeria.
 */
export function ImageCarousel({
  images,
  alt,
  intervalMs = 2000,
  priority = false,
  showIndicators = true,
  showArrows = true,
  objectPosition,
  sizes = "100vw",
  className,
  onIndexChange,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const reducedMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const hasMultiple = images.length > 1;
  const shouldAutoplay = hasMultiple && !hovered && !userInteracted && !reducedMotion;

  useEffect(() => {
    if (!shouldAutoplay) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [shouldAutoplay, intervalMs, images.length]);

  useEffect(() => {
    onIndexChange?.(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goTo = (i: number) => {
    setUserInteracted(true);
    setIndex(((i % images.length) + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) goTo(index - 1);
    else goTo(index + 1);
  };

  if (images.length === 0) return null;

  return (
    <div
      className={`${styles.root} ${reducedMotion ? styles.reducedMotion : ""} ${className || ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((src, i) => (
        <div key={src + i} className={`${styles.slide} ${i === index ? styles.slideActive : ""}`} aria-hidden={i !== index}>
          <Image
            src={src}
            alt={i === index ? alt : ""}
            fill
            priority={priority && i === 0}
            sizes={sizes}
            style={{ objectFit: "cover", objectPosition: objectPosition || "center" }}
          />
        </div>
      ))}

      <span className={styles.srOnly} aria-live="polite">
        {alt} — foto {index + 1} de {images.length}
      </span>

      {hasMultiple && showArrows && (
        <>
          <button type="button" className={`${styles.arrow} ${styles.arrowPrev}`} onClick={() => goTo(index - 1)} aria-label="Foto anterior">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => goTo(index + 1)} aria-label="Próxima foto">
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {hasMultiple && showIndicators && (
        <div className={styles.indicators}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Ir para foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
