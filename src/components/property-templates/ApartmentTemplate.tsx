"use client";

import Image from "next/image";
import { MapPin, Maximize2, Bed, Bath, Car, Layers, Phone } from "lucide-react";
import type { Agent, ApartmentProperty } from "@/types/property";
import { CATEGORY_LABELS } from "@/types/property";
import { formatBRL, formatNumber } from "@/lib/propertyPresentation";
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
  property: ApartmentProperty;
  agent: Agent;
  whatsappLink: string;
}

const CTA_LABEL = "Quero saber mais";

export default function ApartmentTemplate({ property, agent, whatsappLink }: Props) {
  const { data } = property;
  const galleryImages = [property.coverImage, ...property.images].filter(Boolean);

  const hasSpecs = data.area != null || data.bedrooms != null || data.garageSpots != null || data.floor != null;

  const structureTags = [
    ...(data.hasElevator ? ["Elevador"] : []),
    ...(data.hasPool ? ["Piscina"] : []),
    ...(data.hasGym ? ["Academia"] : []),
    ...(data.hasPartyRoom ? ["Salão de festas"] : []),
    ...(data.hasPortaria ? ["Portaria"] : []),
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
              {CATEGORY_LABELS[property.category]} em {property.city}
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
              {data.bedrooms != null && (
                <span className={styles.heroInfoItem}>
                  <Bed size={14} style={{ color: "#d4af37" }} />
                  {data.bedrooms} quarto{data.bedrooms === 1 ? "" : "s"}
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
                    <p className={sharedStyles.specChipLabel}>Área privativa</p>
                    <p className={sharedStyles.specChipValue}>{formatNumber(data.area)} m²</p>
                  </div>
                </div>
              )}
              {data.bedrooms != null && (
                <div className={sharedStyles.specChip}>
                  <Bed size={15} style={{ color: "#d4af37" }} />
                  <div>
                    <p className={sharedStyles.specChipLabel}>Quartos{data.suites != null ? ` (${data.suites} suítes)` : ""}</p>
                    <p className={sharedStyles.specChipValue}>{data.bedrooms}</p>
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

        {/* ── ESTRUTURA DO CONDOMÍNIO ────────────────────────────────── */}
        {structureTags.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="No condomínio" title="Estrutura" />
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
              <Image src="/images/agents.jpg" alt={agent.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 720px) 100vw, 340px" />
            </div>
            <div>
              <p className={styles.agentName}>{agent.name}</p>
              <p className={styles.agentRole}>Consultor(a) JB Consultores Imobiliários — CRECI F-{agent.creci}</p>
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
        <p className={sharedStyles.description}>{property.description}</p>
      </div>

      <FinalCTABand whatsappLink={whatsappLink} ctaLabel={CTA_LABEL} />
      <MobileStickyWhatsApp whatsappLink={whatsappLink} agentFirstName={agent.name.split(" ")[0]} />
    </div>
  );
}
