import type { MetadataRoute } from "next";
import companyData from "../../content/company.json";
import seoData from "../../content/seo.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: companyData.name,
    short_name: "J&B",
    description: seoData.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B0B",
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
