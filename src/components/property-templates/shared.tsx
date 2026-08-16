"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  MapPin,
  MessageSquare,
  X,
} from "lucide-react";
import type { PropertyBase } from "@/types/property";
import { getGoogleMapsSearchUrl, getLocationLine, getMapEmbedUrl } from "@/lib/propertyPresentation";
import { ImageCarousel } from "./ImageCarousel";
import styles from "./shared.module.css";

// ─── Nav / topo da página ──────────────────────────────────────────────────
export function PropertyTopNav() {
  return (
    <div className={styles.topNav}>
      <Link href="/#properties" className={styles.backLink}>
        <ArrowLeft size={15} /> Voltar ao portfólio
      </Link>
      <div className={styles.logoCircle}>
        <Image src="/logo.png" alt="JB Consultores" width={44} height={44} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

// ─── Lightbox ───────────────────────────────────────────────────────────────
export function Lightbox({ images, startIdx, onClose }: { images: string[]; startIdx: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIdx);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.lightboxOverlay}
      onClick={onClose}
    >
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className={styles.lightboxClose} aria-label="Fechar">
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className={styles.lightboxNav} style={{ left: "1rem" }} aria-label="Anterior">
            <ChevronLeft size={22} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className={styles.lightboxNav} style={{ right: "1rem" }} aria-label="Próxima">
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className={styles.lightboxImageWrap}
      >
        <Image src={images[current]} alt={`foto ${current + 1}`} fill style={{ objectFit: "contain" }} />
      </motion.div>

      {images.length > 1 && (
        <div className={styles.lightboxDots}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`${styles.lightboxDot} ${i === current ? styles.lightboxDotActive : ""}`}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Galeria premium: carrossel principal + miniaturas + lightbox ──────────
export function PremiumGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className={styles.premiumGallery}>
      <AnimatePresence>
        {lightboxIdx !== null && <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
      </AnimatePresence>

      <div className={styles.premiumGalleryMain} onClick={() => setLightboxIdx(activeIdx)}>
        <ImageCarousel images={images} alt={title} sizes="(max-width: 860px) 100vw, 900px" onIndexChange={setActiveIdx} />
        <div className={styles.heroExpandHint}>
          <Maximize2 size={12} /> Ampliar
        </div>
      </div>

      {images.length > 1 && (
        <div className={styles.premiumGalleryThumbs}>
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setLightboxIdx(idx)}
              className={`${styles.thumb} ${idx === activeIdx ? styles.thumbActive : ""}`}
              aria-label={`Ver foto ${idx + 1} em tamanho maior`}
            >
              <Image src={img} alt={`foto ${idx + 1}`} fill style={{ objectFit: "cover" }} sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Botão de CTA principal (WhatsApp), com microanimação opcional ─────────
export function PrimaryCtaButton({
  href,
  label,
  pulse,
  inline,
}: {
  href: string;
  label: string;
  pulse?: boolean;
  inline?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.ctaButton} ${inline ? styles.ctaButtonInline : ""} ${pulse ? styles.ctaPulse : ""}`}
    >
      <MessageSquare size={16} />
      {label}
    </a>
  );
}

// ─── Lista dinâmica (infraestrutura / diferenciais / características) ──────
export function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className={styles.tagList}>
      {items.map((item) => (
        <div key={item} className={styles.tagItem}>
          <span className={styles.tagCheck}>✓</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Título de seção padrão ─────────────────────────────────────────────────
export function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <>
      {eyebrow && <span className={styles.sectionEyebrow}>{eyebrow}</span>}
      <h2 className={styles.sectionTitle}>{title}</h2>
    </>
  );
}

// ─── Faixa de CTA final ──────────────────────────────────────────────────────
export function FinalCTABand({ whatsappLink, ctaLabel }: { whatsappLink: string; ctaLabel: string }) {
  return (
    <div className={styles.finalCta}>
      <p className={styles.finalCtaText}>Gostou do que viu? Fale agora mesmo com nosso consultor.</p>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={`${styles.ctaButton} ${styles.ctaButtonInline}`}>
        <MessageSquare size={16} />
        {ctaLabel}
      </a>
      <div>
        <Link href="/#properties" className={styles.finalCtaBack}>
          Ver todo o portfólio
        </Link>
      </div>
    </div>
  );
}

// ─── Localização + mapa (embed quando há API key, fallback visual quando não) ──
type LocationLike = Pick<
  PropertyBase,
  "title" | "city" | "state" | "neighborhood" | "address" | "reference" | "latitude" | "longitude" | "googleMapsUrl"
>;

export function PropertyLocationSection({ property }: { property: LocationLike }) {
  const embedUrl = getMapEmbedUrl(property);
  const mapsUrl = getGoogleMapsSearchUrl(property);
  const locationLine = getLocationLine(property);
  const primaryLine = property.address || locationLine;

  return (
    <div>
      {(primaryLine || property.reference) && (
        <div style={{ marginBottom: "1.25rem" }}>
          {primaryLine && <p className={styles.description}>{primaryLine}</p>}
          {property.reference && <p className={styles.locationReference}>{property.reference}</p>}
        </div>
      )}

      {embedUrl ? (
        <div className={styles.mapEmbedWrap}>
          <iframe
            src={embedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={`Mapa de localização — ${property.title}`}
            className={styles.mapEmbedFrame}
          />
        </div>
      ) : (
        <div className={styles.mapFallback}>
          <MapPin size={26} style={{ color: "#d4af37" }} />
          <p className={styles.mapFallbackTitle}>{property.title}</p>
          {locationLine && <p className={styles.mapFallbackLine}>{locationLine}</p>}
          {property.reference && <p className={styles.mapFallbackLine}>{property.reference}</p>}
        </div>
      )}

      {mapsUrl && (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.mapOpenLink}>
          <ExternalLink size={13} /> Abrir no Google Maps
        </a>
      )}
    </div>
  );
}

// ─── Barra fixa de WhatsApp no mobile (CTA sempre acessível) ────────────────
export function MobileStickyWhatsApp({ whatsappLink, agentFirstName }: { whatsappLink: string; agentFirstName: string }) {
  return (
    <div className={styles.mobileStickyCta}>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
        <MessageSquare size={16} />
        Falar com {agentFirstName}
      </a>
    </div>
  );
}
