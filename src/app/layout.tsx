import type { Metadata, Viewport } from "next";
import { Sora, Poppins, Cinzel } from "next/font/google";
import "./globals.css";
import seoData from "../../content/seo.json";
import companyData from "../../content/company.json";
import socialData from "../../content/social.json";
import ScrollToTop from "@/components/ScrollToTop";
import { toJsonLd } from "@/lib/jsonLd";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seoData.siteUrl),
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  authors: [{ name: "J&B Corretores" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: seoData.title,
    description: seoData.description,
    url: seoData.siteUrl,
    siteName: "J&B Corretores",
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
  themeColor: "#000000",
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
    "name": seoData.title,
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
    <html lang="pt-BR" className={`${sora.variable} ${poppins.variable} ${cinzel.variable}`}>
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
