const fs = require('fs/promises');
const path = require('path');

async function run() {
  const contentDir = path.join(__dirname, 'content');

  const company = {
    name: "JB Consultores Imobiliários",
    about: "Excelência em consultoria imobiliária, conectando pessoas aos melhores negócios com confiança, transparência e profissionalismo.",
    address: "Goiânia, GO",
    email: "jbconsultoriaimoveis@gmail.com",
    agents: [
      { name: "Jonathan", creci: "29.147", phone: "(62) 9 9636-7042", whatsapp: "62996367042" },
      { name: "Bárbara Rios", creci: "29.148", phone: "(62) 9 9607-1448", whatsapp: "62996071448" }
    ],
    values: [
      { title: "Transparência", description: "Atuação clara e honesta em todas as etapas." },
      { title: "Ética", description: "Compromisso com a verdade e integridade profissional." },
      { title: "Excelência", description: "Entrega do mais alto padrão de atendimento e imóveis." },
      { title: "Relacionamento", description: "Foco na parceria de longo prazo com o cliente." },
      { title: "Segurança", description: "Garantia jurídica e tranquilidade em todas as transações." }
    ],
    diferenciais: [
      { title: "Atendimento Personalizado", description: "Consultoria exclusiva, desenhada para entender profundamente suas necessidades e superar suas expectativas.", icon: "UserCheck" },
      { title: "Segurança Jurídica", description: "Assessoria completa em documentação e contratos, garantindo tranquilidade total em seu investimento.", icon: "Shield" },
      { title: "Transparência", description: "Negociações claras, com todas as informações expostas de maneira íntegra e objetiva.", icon: "Eye" },
      { title: "Consultoria Especializada", description: "Profundo conhecimento de mercado para identificar as melhores oportunidades de valorização.", icon: "Bookmark" },
      { title: "Acompanhamento Completo", description: "Do primeiro contato à entrega das chaves, nossa equipe está ao seu lado em cada etapa.", icon: "Activity" }
    ]
  };

  const properties = [
    {
      id: "1", slug: "noroeste-park", category: "loteamentos", featured: true, order: 1, status: "active",
      whatsappAgentId: "62996367042", image: "/images/properties/noroeste-park.jpg", title: "Noroeste Park Condomínio Fechado",
      description: "Lotes exclusivos de alto padrão integrados a uma ampla área verde preservada, lazer completo e segurança de última geração.", city: "Goiânia"
    },
    {
      id: "2", slug: "alta-vista-residence", category: "apartamentos", featured: true, order: 2, status: "active",
      whatsappAgentId: "62996071448", image: "/images/properties/alta-vista.jpg", title: "Alta Vista Residence",
      description: "Apartamentos suspensos de luxo com vista panorâmica definitiva de 360º, acabamentos em mármore e piscina privativa na varanda.", city: "Goiânia"
    },
    {
      id: "3", slug: "parque-imperial", category: "casas", featured: true, order: 3, status: "active",
      whatsappAgentId: "62996367042", image: "/images/properties/parque-imperial.jpg", title: "Mansão Parque Imperial",
      description: "Casa com arquitetura moderna assinada, 5 suítes plenas, área de lazer integrada com espaço gourmet, sauna e piscina aquecida.", city: "Goiânia"
    },
    {
      id: "4", slug: "golden-residence", category: "chácaras", featured: true, order: 4, status: "active",
      whatsappAgentId: "62996071448", image: "/images/properties/golden-residence.jpg", title: "Chácaras Golden Residence",
      description: "Chácaras de lazer premium a poucos minutos da cidade, com lagos para pesca, hípica privativa e heliponto para maior comodidade.", city: "Senador Canedo"
    }
  ];

  const seo = {
    title: "JB Consultores Imobiliários | Imóveis de Alto Padrão",
    description: "Consultoria imobiliária premium especializada em imóveis de luxo, loteamentos e condomínios fechados em Goiânia. Atendimento exclusivo e segurança jurídica.",
    keywords: ["imóveis de luxo", "Goiânia", "loteamentos fechados", "casas de alto padrão", "consultor imobiliário", "condomínio fechado"],
    ogImage: "/logo.png",
    siteUrl: "https://jbcorretores.com.br"
  };

  const social = {
    instagram: "https://instagram.com/jbconsultoresimobiliarios",
    whatsapp: "https://wa.me/5562996367042",
    facebook: "https://facebook.com/jbconsultoresimobiliarios",
    linkedin: "https://linkedin.com/"
  };

  const testimonials = [
    {
      id: "1",
      text: "O atendimento foi excepcional do início ao fim. Encontramos o imóvel perfeito com total transparência e segurança jurídica.",
      author: "Ricardo & Patrícia M.",
      role: "Adquiriram lote no Noroeste Park",
      rating: 5,
      status: "active"
    },
    {
      id: "2",
      text: "A consultoria imobiliária foi essencial para nossa decisão. Demonstraram conhecimento profundo do mercado de luxo.",
      author: "Dr. André L. Fonseca",
      role: "Investidor",
      rating: 5,
      status: "active"
    },
    {
      id: "3",
      text: "Discrição e profissionalismo ímpares. Recomendo para quem busca imóveis de altíssimo padrão sem perder tempo.",
      author: "Fernando S. Castro",
      role: "Empresário",
      rating: 5,
      status: "active"
    }
  ];

  await fs.writeFile(path.join(contentDir, 'company.json'), JSON.stringify(company, null, 2), 'utf8');
  await fs.writeFile(path.join(contentDir, 'properties.json'), JSON.stringify(properties, null, 2), 'utf8');
  await fs.writeFile(path.join(contentDir, 'seo.json'), JSON.stringify(seo, null, 2), 'utf8');
  await fs.writeFile(path.join(contentDir, 'social.json'), JSON.stringify(social, null, 2), 'utf8');
  await fs.writeFile(path.join(contentDir, 'testimonials.json'), JSON.stringify(testimonials, null, 2), 'utf8');

  // .env.local
  await fs.writeFile(path.join(__dirname, '.env.local'), 'ADMIN_PASSCODE=jb2026admin\n', 'utf8');

  // robots.ts
  const robotsTs = `import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'],
    },
    sitemap: 'https://jbcorretores.com.br/sitemap.xml',
  }
}
`;
  await fs.writeFile(path.join(__dirname, 'src', 'app', 'robots.ts'), robotsTs, 'utf8');

  // sitemap.ts
  const sitemapTs = `import type { MetadataRoute } from 'next'
import propertiesData from '../../content/properties.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jbcorretores.com.br'

  const propertiesUrls = propertiesData
    .filter(p => p.status === 'active')
    .map((property) => ({
      url: \`\${baseUrl}/#properties\`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...propertiesUrls
  ]
}
`;
  await fs.writeFile(path.join(__dirname, 'src', 'app', 'sitemap.ts'), sitemapTs, 'utf8');

  // next.config.ts
  const nextConfigTs = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 768, 1024, 1280, 1440, 1920],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

export default nextConfig;
`;
  await fs.writeFile(path.join(__dirname, 'next.config.ts'), nextConfigTs, 'utf8');

  // Delete page.module.css
  try { await fs.unlink(path.join(__dirname, 'src', 'app', 'page.module.css')); } catch (e) {}

}

run().catch(console.error);
