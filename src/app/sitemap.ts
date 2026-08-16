import type { MetadataRoute } from "next";
import { getVisibleProperties } from "@/lib/properties";

const baseUrl = "https://jbcorretores.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getVisibleProperties();

  const propertyUrls: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/imovel/${property.slug}`,
    lastModified: new Date(property.updatedAt || property.createdAt),
    changeFrequency: "weekly",
    priority: property.featured ? 0.9 : 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...propertyUrls,
  ];
}
