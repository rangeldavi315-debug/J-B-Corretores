import { notFound } from "next/navigation";
import type { Metadata } from "next";
import companyData from "../../../../content/company.json";
import seoData from "../../../../content/seo.json";
import { getPropertyBySlug, getVisibleProperties } from "@/lib/properties";
import { getSeoTitle, getSeoDescription, getSchemaPrice, buildWhatsAppLink } from "@/lib/propertyPresentation";
import { toJsonLd } from "@/lib/jsonLd";
import type { Agent } from "@/types/property";
import LotTemplate from "@/components/property-templates/LotTemplate";
import HouseTemplate from "@/components/property-templates/HouseTemplate";
import FarmTemplate from "@/components/property-templates/FarmTemplate";
import ApartmentTemplate from "@/components/property-templates/ApartmentTemplate";

const agents = companyData.agents as Agent[];

export async function generateStaticParams() {
  const properties = await getVisibleProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property || property.status === "draft" || property.isDemo) {
    return { robots: { index: false, follow: false } };
  }

  const title = getSeoTitle(property, companyData.name);
  const description = getSeoDescription(property);
  const url = `/imovel/${property.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      // Sem width/height: a capa é o que foi enviado no cadastro, tamanho
      // varia por imóvel — declarar 1200x630 fixo mentiria pra maioria deles.
      images: [{ url: property.coverImage, alt: property.title }],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property || property.status === "draft" || property.isDemo) {
    notFound();
  }

  const agent = agents.find((a) => a.whatsapp === property.whatsappAgentId) ?? agents[0];
  const whatsappLink = buildWhatsAppLink(agent, property);

  const price = getSchemaPrice(property);
  const AVAILABILITY: Record<typeof property.status, string> = {
    published: "https://schema.org/InStock",
    reserved: "https://schema.org/LimitedAvailability",
    sold: "https://schema.org/SoldOut",
  };

  // Só descreve o que existe de verdade no cadastro — sem preço, sem endereço
  // exato, sem inventar avaliações ou dados que o imóvel não tem.
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: getSeoDescription(property),
    url: new URL(`/imovel/${property.slug}`, seoData.siteUrl).toString(),
    image: new URL(property.coverImage, seoData.siteUrl).toString(),
    datePosted: property.createdAt,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.state || "GO",
      addressCountry: "BR",
      ...(property.neighborhood ? { addressLocality: `${property.neighborhood}, ${property.city}` } : {}),
    },
    ...(price != null
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "BRL",
            availability: AVAILABILITY[property.status],
          },
        }
      : {}),
  };

  const Template = () => {
    switch (property.category) {
      case "loteamento":
        return <LotTemplate property={property} agent={agent} whatsappLink={whatsappLink} />;
      case "casa":
        return <HouseTemplate property={property} agent={agent} whatsappLink={whatsappLink} />;
      case "chacara":
        return <FarmTemplate property={property} agent={agent} whatsappLink={whatsappLink} />;
      case "apartamento":
        return <ApartmentTemplate property={property} agent={agent} whatsappLink={whatsappLink} />;
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }}
      />
      <Template />
    </>
  );
}
