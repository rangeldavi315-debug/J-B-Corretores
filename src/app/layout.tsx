import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import seoData from "../../content/seo.json";
import companyData from "../../content/company.json";
import socialData from "../../content/social.json";
import ScrollToTop from "@/components/ScrollToTop";
import { toJsonLd } from "@/lib/jsonLd";

// Tipografia da identidade J&B Consultores Imobiliários: Playfair Display para
// títulos/monograma (inclui itálico — usado no "J" fluido do monograma) e
// Montserrat para textos/UI.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seoData.siteUrl),
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  authors: [{ name: "J&B Consultores Imobiliários" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: seoData.title,
    description: seoData.description,
    url: seoData.siteUrl,
    siteName: "J&B Consultores Imobiliários",
    images: [
      {
        url: seoData.ogImage,
        width: 1200,
        height: 630,
        alt: seoData.title,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const primaryAgent = companyData.agents[0];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RealEstateAgent"],
    "name": companyData.name,
    "image": new URL(seoData.ogImage, seoData.siteUrl).toString(),
    "description": seoData.description,
    "telephone": primaryAgent.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Goiânia",
      "addressRegion": "GO",
      "addressCountry": "BR"
    },
    "url": seoData.siteUrl,
    // Só links de perfil reais e específicos — o LinkedIn cadastrado é
    // apenas o domínio genérico (sem página da empresa), então fica de fora.
    "sameAs": [socialData.instagram, socialData.facebook]
  };

  return (
    <html lang="pt-BR" className={`${playfair.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(schemaOrg) }}
        />
      </head>
      <body>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
