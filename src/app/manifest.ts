import type { MetadataRoute } from "next";
import companyData from "../../content/company.json";
import seoData from "../../content/seo.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoData.title,
    short_name: companyData.name,
    description: seoData.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#D4AF37",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
