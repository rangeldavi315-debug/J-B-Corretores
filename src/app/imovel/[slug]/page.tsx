import { notFound } from "next/navigation";
import type { Metadata } from "next";
import companyData from "../../../../content/company.json";
import { getPropertyBySlug, getVisibleProperties } from "@/lib/properties";
import { getSeoTitle, getSeoDescription, buildWhatsAppLink } from "@/lib/propertyPresentation";
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
  if (!property || property.status === "draft" || property.isDemo) return {};

  const title = getSeoTitle(property, companyData.name);
  const description = getSeoDescription(property);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: property.coverImage, width: 1200, height: 630, alt: property.title }],
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
}
