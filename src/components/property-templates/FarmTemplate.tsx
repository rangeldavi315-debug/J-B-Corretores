"use client";

import Image from "next/image";
import { MapPin, Ruler, Bed, Bath, Car, Home, Zap, Droplet, Phone } from "lucide-react";
import type { Agent, FarmProperty } from "@/types/property";
import { CATEGORY_LABELS } from "@/types/property";
import { formatArea, formatBRL, formatNumber } from "@/lib/propertyPresentation";
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
import styles from "./FarmTemplate.module.css";

interface Props {
  property: FarmProperty;
  agent: Agent;
  whatsappLink: string;
}

const CTA_LABEL = "Quero saber as condições";

export default function FarmTemplate({ property, agent, whatsappLink }: Props) {
  const { data } = property;
  const galleryImages = [property.coverImage, ...property.images].filter(Boolean);

  const hasHouseSpecs =
    data.hasHouse &&
    (data.builtArea != null || data.bedrooms != null || data.suites != null || data.bathrooms != null || data.garageSpots != null);

  const leisureTags = [
    ...(data.hasPool ? ["Piscina"] : []),
    ...(data.hasBbqArea ? ["Churrasqueira"] : []),
    ...(data.hasGourmetArea ? ["Área gourmet"] : []),
    ...data.propertyFeatures,
  ];

  const hasStructureInfo = !!data.energyType || !!data.waterSource || !!data.access;

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
              {data.totalArea != null && (
                <span className={styles.heroInfoItem}>
                  <Ruler size={14} style={{ color: "#d4af37" }} />
                  {formatArea(data.totalArea, data.areaUnit)}
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
              {data.conditions && <p className={styles.offerConditions}>{data.conditions}</p>}
            </div>

            <PrimaryCtaButton href={whatsappLink} label={CTA_LABEL} inline />
          </div>
        </div>
      )}

      <div className={sharedStyles.section}>
        {/* ── ÁREA ───────────────────────────────────────────────────── */}
        {data.totalArea != null && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="Dimensões" title="Área" />
            <div className={sharedStyles.specChips}>
              <div className={sharedStyles.specChip}>
                <Ruler size={15} style={{ color: "#d4af37" }} />
                <div>
                  <p className={sharedStyles.specChipLabel}>Área total</p>
                  <p className={sharedStyles.specChipValue}>{formatArea(data.totalArea, data.areaUnit)}</p>
                </div>
              </div>
              {hasHouseSpecs && data.builtArea != null && (
                <div className={sharedStyles.specChip}>
                  <Home size={15} style={{ color: "#d4af37" }} />
                  <div>
                    <p className={sharedStyles.specChipLabel}>Área construída</p>
                    <p className={sharedStyles.specChipValue}>{formatNumber(data.builtArea)} m²</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ESTRUTURA ──────────────────────────────────────────────── */}
        {(hasHouseSpecs || hasStructureInfo) && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow={data.hasHouse ? "Casa sede" : undefined} title="Estrutura" />
            {hasHouseSpecs && (
              <div className={sharedStyles.specChips} style={{ marginBottom: hasStructureInfo ? "1rem" : 0 }}>
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
                      <p className={sharedStyles.specChipLabel}>Garagem</p>
                      <p className={sharedStyles.specChipValue}>
                        {data.garageSpots} {data.garageSpots === 1 ? "vaga" : "vagas"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {hasStructureInfo && (
              <div className={sharedStyles.specChips}>
                {data.energyType && (
                  <div className={sharedStyles.specChip}>
                    <Zap size={15} style={{ color: "#d4af37" }} />
                    <div>
                      <p className={sharedStyles.specChipLabel}>Energia</p>
                      <p className={sharedStyles.specChipValue}>{data.energyType}</p>
                    </div>
                  </div>
                )}
                {data.waterSource && (
                  <div className={sharedStyles.specChip}>
                    <Droplet size={15} style={{ color: "#d4af37" }} />
                    <div>
                      <p className={sharedStyles.specChipLabel}>Água</p>
                      <p className={sharedStyles.specChipValue}>{data.waterSource}</p>
                    </div>
                  </div>
                )}
                {data.access && (
                  <div className={sharedStyles.specChip}>
                    <MapPin size={15} style={{ color: "#d4af37" }} />
                    <div>
                      <p className={sharedStyles.specChipLabel}>Acesso</p>
                      <p className={sharedStyles.specChipValue}>{data.access}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── LAZER ──────────────────────────────────────────────────── */}
        {leisureTags.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="Viva bem" title="Lazer" />
            <TagList items={leisureTags} />
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
        <SectionHeading eyebrow="Sobre a propriedade" title="Descrição" />
        <p className={sharedStyles.description}>{property.description}</p>
      </div>

      <FinalCTABand whatsappLink={whatsappLink} ctaLabel={CTA_LABEL} />
      <MobileStickyWhatsApp whatsappLink={whatsappLink} agentFirstName={agent.name.split(" ")[0]} />
    </div>
  );
}
