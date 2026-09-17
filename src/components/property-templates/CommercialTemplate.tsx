"use client";

import Image from "next/image";
import { MapPin, Maximize2, Bath, Car, Layers, Phone } from "lucide-react";
import type { Agent, CommercialProperty } from "@/types/property";
import { CATEGORY_LABELS } from "@/types/property";
import { formatBRL, formatNumber, sanitizeForDisplay } from "@/lib/propertyPresentation";
import {
  PropertyTopNav,
  PremiumGallery,
  PropertyLocationSection,
  TagList,
  SectionHeading,
  FinalCTABand,
  MobileStickyWhatsApp,
  PrimaryCtaButton,
} from "./shared";
import { ImageCarousel } from "./ImageCarousel";
import sharedStyles from "./shared.module.css";
import styles from "./ApartmentTemplate.module.css";

interface Props {
  property: CommercialProperty;
  agent: Agent;
  whatsappLink: string;
}

const CTA_LABEL = "Quero saber mais";

export default function CommercialTemplate({ property, agent, whatsappLink }: Props) {
  const { data } = property;
  const galleryImages = [property.coverImage, ...property.images].filter(Boolean);

  const hasSpecs = data.area != null || data.bathrooms != null || data.garageSpots != null || data.floor != null;

  const structureTags = [
    ...(data.hasElevator ? ["Elevador"] : []),
    ...(data.hasSecurity ? ["Segurança 24h"] : []),
  ];

  return (
    <div className={sharedStyles.page}>
      <PropertyTopNav />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <ImageCarousel images={[property.coverImage]} alt={property.title} priority sizes="100vw" objectPosition={property.coverImagePosition} showArrows={false} />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroInner}>
            <span className={styles.heroLabel}>
              {data.businessType || CATEGORY_LABELS[property.category]} em {property.city}
              {property.featured ? " · ★ Destaque" : ""}
            </span>
            <h1 className={styles.heroTitle}>{property.title}</h1>

            <div className={styles.heroInfoRow}>
              <span className={styles.heroInfoItem}>
                <MapPin size={14} style={{ color: "#d4af37" }} /> {property.neighborhood ? `${property.neighborhood}, ` : ""}
                {property.city}
              </span>
              {data.area != null && (
                <span className={styles.heroInfoItem}>
                  <Maximize2 size={14} style={{ color: "#d4af37" }} />
                  {formatNumber(data.area)} m²
                </span>
              )}
            </div>

            <div className={styles.heroCtaWrap}>
              <PrimaryCtaButton href={whatsappLink} label={CTA_LABEL} inline pulse />
            </div>
          </div>
        </div>
      </div>

      {/* ── OFERTA ───────────────────────────────────────────────────── */}
      {data.price != null && (
        <div className={styles.offerSection}>
          <div className={styles.offerInner}>
            <div className={styles.offerMain}>
              <p className={styles.offerEyebrow}>{data.priceFrom ? "A partir de" : "Valor"}</p>
              <p className={styles.offerPrice}>{formatBRL(data.price)}</p>

              {data.condominiumFee != null && (
                <div className={styles.offerBreakdown}>
                  <span>
                    Condomínio: <strong>{formatBRL(data.condominiumFee)}/mês</strong>
                  </span>
                </div>
              )}

              {data.conditions && <p className={styles.offerConditions}>{data.conditions}</p>}
            </div>

            <PrimaryCtaButton href={whatsappLink} label={CTA_LABEL} inline />
          </div>
        </div>
      )}

      <div className={sharedStyles.section}>
        {/* ── CARACTERÍSTICAS ────────────────────────────────────────── */}
        {hasSpecs && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="Especificações" title="Características" />
            <div className={sharedStyles.specChips}>
              {data.area != null && (
                <div className={sharedStyles.specChip}>
                  <Maximize2 size={15} style={{ color: "#d4af37" }} />
                  <div>
                    <p className={sharedStyles.specChipLabel}>Área</p>
                    <p className={sharedStyles.specChipValue}>{formatNumber(data.area)} m²</p>
                  </div>
                </div>
              )}
              {data.bathrooms != null && (
                <div className={sharedStyles.specChip}>
                  <Bath size={15} style={{ color: "#d4af37" }} />
                  <div>
                    <p className={sharedStyles.specChipLabel}>Banheiros</p>
                    <p className={sharedStyles.specChipValue}>{data.bathrooms}</p>
                  </div>
                </div>
              )}
              {data.garageSpots != null && (
                <div className={sharedStyles.specChip}>
                  <Car size={15} style={{ color: "#d4af37" }} />
                  <div>
                    <p className={sharedStyles.specChipLabel}>Vagas</p>
                    <p className={sharedStyles.specChipValue}>{data.garageSpots}</p>
                  </div>
                </div>
              )}
              {data.floor != null && (
                <div className={sharedStyles.specChip}>
                  <Layers size={15} style={{ color: "#d4af37" }} />
                  <div>
                    <p className={sharedStyles.specChipLabel}>Andar</p>
                    <p className={sharedStyles.specChipValue}>{data.floor}º</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ESTRUTURA ──────────────────────────────────────────────── */}
        {structureTags.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="Infraestrutura" title="Estrutura" />
            <TagList items={structureTags} />
          </div>
        )}

        {/* ── DIFERENCIAIS ───────────────────────────────────────────── */}
        {data.differentials.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="Por que escolher" title="Diferenciais" />
            <TagList items={data.differentials} />
          </div>
        )}

        {/* ── LOCALIZAÇÃO ────────────────────────────────────────────── */}
        <div style={{ marginBottom: "3rem" }}>
          <SectionHeading eyebrow="Onde fica" title="Localização" />
          <PropertyLocationSection property={property} />
        </div>

        {/* ── GALERIA ────────────────────────────────────────────────── */}
        {galleryImages.length > 0 && (
          <div style={{ marginBottom: "3.5rem" }}>
            <SectionHeading eyebrow="Conheça em imagens" title="Galeria" />
            <PremiumGallery images={galleryImages} title={property.title} />
          </div>
        )}

        {/* ── SOBRE O CORRETOR ───────────────────────────────────────── */}
        <div style={{ marginBottom: "3.5rem" }}>
          <SectionHeading eyebrow="Atendimento" title="Fale diretamente com quem cuida deste negócio" />
          <div className={styles.agentSection}>
            <div className={styles.agentPhotoWrap}>
              <Image src={agent.photo || "/images/agents/jonathan.jpg"} alt={agent.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 720px) 100vw, 340px" />
            </div>
            <div>
              <p className={styles.agentName}>{agent.name}</p>
              <p className={styles.agentRole}>Consultor(a) J&B — CRECI: {agent.creci}</p>
              <p className={styles.agentText}>
                Atendimento direto, sem intermediários: você fala com {agent.name.split(" ")[0]} desde a primeira dúvida até a assinatura,
                com segurança jurídica e transparência em cada etapa.
              </p>
              <div className={styles.agentPhone}>
                <Phone size={14} style={{ color: "#d4af37" }} />
                <span>{agent.phone}</span>
              </div>
              <PrimaryCtaButton href={whatsappLink} label={`Falar com ${agent.name.split(" ")[0]}`} inline />
            </div>
          </div>
        </div>

        {/* ── DESCRIÇÃO ─────────────────────────────────────────────── */}
        <SectionHeading eyebrow="Sobre o imóvel" title="Descrição" />
        <p className={sharedStyles.description}>{sanitizeForDisplay(property.description)}</p>
      </div>

      <FinalCTABand whatsappLink={whatsappLink} ctaLabel={CTA_LABEL} />
      <MobileStickyWhatsApp whatsappLink={whatsappLink} agentFirstName={agent.name.split(" ")[0]} />
    </div>
  );
}
