import type { Metadata } from "next";
import { Sora, Poppins } from "next/font/google";
import "./globals.css";
import seoData from "../../content/seo.json";
import ScrollToTop from "@/components/ScrollToTop";

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

export const metadata: Metadata = {
  metadataBase: new URL(seoData.siteUrl),
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  authors: [{ name: "JB Consultores Imobiliários" }],
  openGraph: {
    title: seoData.title,
    description: seoData.description,
    url: seoData.siteUrl,
    siteName: "JB Consultores Imobiliários",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RealEstateAgent"],
    "name": seoData.title,
    "image": seoData.ogImage,
    "description": seoData.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Goiânia",
      "addressRegion": "GO",
      "addressCountry": "BR"
    },
    "url": seoData.siteUrl
  };

  return (
    <html lang="pt-BR" className={`${sora.variable} ${poppins.variable}`}>
      <head>
        <link rel="canonical" href={seoData.siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
