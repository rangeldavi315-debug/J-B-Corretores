"use client";

import Image from "next/image";
import { MapPin, Ruler, Layers, Phone } from "lucide-react";
import type { Agent, LotProperty } from "@/types/property";
import { CATEGORY_LABELS } from "@/types/property";
import {
  formatBRL,
  formatNumber,
  getLotQuickFacts,
  DEFAULT_LOT_CTA_LABEL,
} from "@/lib/propertyPresentation";
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
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";
import sharedStyles from "./shared.module.css";
import styles from "./LotTemplate.module.css";

interface Props {
  property: LotProperty;
  agent: Agent;
  whatsappLink: string;
}

export default function LotTemplate({ property, agent, whatsappLink }: Props) {
  const { data } = property;
  const galleryImages = [property.coverImage, ...property.images].filter(Boolean);
  const isMobile = useIsMobileViewport();
  const heroImages = [isMobile && property.heroImageMobile ? property.heroImageMobile : property.coverImage];
  const { commercial } = data;
  const ctaLabel = data.ctaLabel || DEFAULT_LOT_CTA_LABEL;

  const hasSizeRange = data.minLotSize != null || data.maxLotSize != null;
  const hasLotDetails = hasSizeRange || data.availableUnits != null || data.lotTypes.length > 0;
  const hasCommercial =
    commercial.priceFrom != null || commercial.downPayment != null || commercial.installment != null || !!commercial.conditions;
  const quickFacts = getLotQuickFacts(property);
  const hasWhyKnow = !!data.whyKnowTitle || !!data.whyKnowText;

  return (
    <div className={sharedStyles.page}>
      <PropertyTopNav />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <ImageCarousel images={heroImages} alt={property.title} priority sizes="100vw" objectPosition={property.coverImagePosition} showArrows={false} />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroInner}>
            <span className={styles.heroLabel}>
              {CATEGORY_LABELS[property.category]} em {property.city}
              {property.featured ? " · ★ Destaque" : ""}
            </span>
            <h1 className={styles.heroTitle}>{property.title}</h1>
            {data.heroHeadline && <p className={styles.heroHeadline}>{data.heroHeadline}</p>}
            {data.heroSubheadline && <p className={styles.heroSubheadline}>{data.heroSubheadline}</p>}

            <div className={styles.heroInfoRow}>
              <span className={styles.heroInfoItem}>
                <MapPin size={14} style={{ color: "#d4af37" }} /> {property.neighborhood ? `${property.neighborhood}, ` : ""}
                {property.city}
              </span>
              {hasSizeRange && (
                <span className={styles.heroInfoItem}>
                  <Ruler size={14} style={{ color: "#d4af37" }} />
                  {data.minLotSize != null ? `Lotes a partir de ${formatNumber(data.minLotSize)} m²` : `Até ${formatNumber(data.maxLotSize!)} m²`}
                </span>
              )}
            </div>

            <div className={styles.heroCtaWrap}>
              <PrimaryCtaButton href={whatsappLink} label={ctaLabel} inline pulse />
            </div>
          </div>
        </div>
      </div>

      {/* ── OFERTA ───────────────────────────────────────────────────── */}
      {hasCommercial && (
        <div className={styles.offerSection}>
          <div className={styles.offerInner}>
            <div className={styles.offerMain}>
              {commercial.installment != null ? (
                <>
                  <p className={styles.offerEyebrow}>A partir de</p>
                  <p className={styles.offerPrice}>{formatBRL(commercial.installment)}/mês</p>
                </>
              ) : commercial.priceFrom != null ? (
                <>
                  <p className={styles.offerEyebrow}>A partir de</p>
                  <p className={styles.offerPrice}>{formatBRL(commercial.priceFrom)}</p>
                </>
              ) : (
                <p className={styles.offerEyebrow}>Condições especiais disponíveis</p>
              )}

              <div className={styles.offerBreakdown}>
                {commercial.priceFrom != null && commercial.installment != null && (
                  <span>
                    Valor total: <strong>{formatBRL(commercial.priceFrom)}</strong>
                  </span>
                )}
                {commercial.downPayment != null && (
                  <span>
                    Entrada: <strong>{formatBRL(commercial.downPayment)}</strong>
                  </span>
                )}
                {commercial.installmentCount != null && (
                  <span>
                    Parcelas: <strong>{commercial.installmentCount}x</strong>
                  </span>
                )}
              </div>

              {commercial.conditions && <p className={styles.offerConditions}>{commercial.conditions}</p>}
            </div>

            <PrimaryCtaButton href={whatsappLink} label={ctaLabel} inline />
          </div>
        </div>
      )}

      <div className={sharedStyles.section}>
        {/* ── POR QUE CONHECER ──────────────────────────────────────── */}
        {hasWhyKnow && (
          <div className={styles.whyKnow} style={{ marginBottom: "3rem" }}>
            {data.whyKnowTitle && <p className={styles.whyKnowTitle}>{data.whyKnowTitle}</p>}
            {data.whyKnowText && <p className={styles.whyKnowText}>{data.whyKnowText}</p>}
          </div>
        )}

        {/* ── RESUMO / DIFERENCIAIS EM DESTAQUE ─────────────────────── */}
        {quickFacts.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="Resumo rápido" title="Por que este loteamento" />
            <div className={styles.quickFactsGrid}>
              {quickFacts.map((fact) => (
                <div key={fact.label} className={styles.quickFactCard}>
                  <span className={styles.quickFactIcon}>{fact.icon}</span>
                  <p className={styles.quickFactLabel}>{fact.label}</p>
                  <p className={styles.quickFactValue}>{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DIFERENCIAIS (lista dinâmica) ─────────────────────────── */}
        {data.differentials.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="Por que escolher" title="Diferenciais" />
            <TagList items={data.differentials} />
          </div>
        )}

        {/* ── LOTES ──────────────────────────────────────────────────── */}
        {hasLotDetails && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="Especificações" title="Detalhes dos Lotes" />
            <div className={sharedStyles.specChips}>
              {hasSizeRange && (
                <div className={sharedStyles.specChip}>
                  <Ruler size={15} style={{ color: "#d4af37" }} />
                  <div>
                    <p className={sharedStyles.specChipLabel}>Metragem</p>
                    <p className={sharedStyles.specChipValue}>
                      {data.minLotSize != null && data.maxLotSize != null
                        ? `${formatNumber(data.minLotSize)} a ${formatNumber(data.maxLotSize)} m²`
                        : `${formatNumber((data.minLotSize ?? data.maxLotSize)!)} m²`}
                    </p>
                  </div>
                </div>
              )}
              {data.availableUnits != null && (
                <div className={sharedStyles.specChip}>
                  <Layers size={15} style={{ color: "#d4af37" }} />
                  <div>
                    <p className={sharedStyles.specChipLabel}>Disponíveis</p>
                    <p className={sharedStyles.specChipValue}>{data.availableUnits} lotes</p>
                  </div>
                </div>
              )}
            </div>
            {data.lotTypes.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <TagList items={data.lotTypes} />
              </div>
            )}
          </div>
        )}

        {/* ── INFRAESTRUTURA ─────────────────────────────────────────── */}
        {data.infrastructure.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHeading eyebrow="O que já está pronto" title="Infraestrutura" />
            <TagList items={data.infrastructure} />
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
        <SectionHeading eyebrow="Sobre o empreendimento" title="Descrição" />
        <p className={sharedStyles.description}>{property.description}</p>
      </div>

      <FinalCTABand whatsappLink={whatsappLink} ctaLabel={ctaLabel} />
      <MobileStickyWhatsApp whatsappLink={whatsappLink} agentFirstName={agent.name.split(" ")[0]} />
    </div>
  );
}
