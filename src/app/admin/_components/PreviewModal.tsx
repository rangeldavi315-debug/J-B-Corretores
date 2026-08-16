"use client";

import { X } from "lucide-react";
import companyData from "../../../../content/company.json";
import type { Agent, Property } from "@/types/property";
import { buildWhatsAppLink } from "@/lib/propertyPresentation";
import LotTemplate from "@/components/property-templates/LotTemplate";
import HouseTemplate from "@/components/property-templates/HouseTemplate";
import FarmTemplate from "@/components/property-templates/FarmTemplate";
import ApartmentTemplate from "@/components/property-templates/ApartmentTemplate";

const agents = companyData.agents as Agent[];

export function PreviewModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const agent = agents.find((a) => a.whatsapp === property.whatsappAgentId) ?? agents[0];
  const whatsappLink = buildWhatsAppLink(agent, property);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#000", overflowY: "auto" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#D4AF37",
          color: "#000",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          fontWeight: 700,
        }}
      >
        <span>Pré-visualização — assim ficará a página publicada</span>
        <button
          onClick={onClose}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(0,0,0,0.15)", border: "none", borderRadius: "6px", padding: "0.4rem 0.8rem", cursor: "pointer", color: "#000", fontWeight: 700 }}
        >
          <X size={15} /> Fechar
        </button>
      </div>

      {property.isDemo && (
        <div style={{ position: "sticky", top: "40px", zIndex: 9, background: "#3b0764", color: "#e9d5ff", padding: "0.6rem 1.25rem", fontSize: "0.78rem", textAlign: "center", fontWeight: 600 }}>
          ⚠ CADASTRO DE DEMONSTRAÇÃO — dados fictícios/placeholder, nunca visível publicamente (status: rascunho). Substitua pelos dados reais antes de publicar.
        </div>
      )}

      {property.category === "loteamento" && <LotTemplate property={property} agent={agent} whatsappLink={whatsappLink} />}
      {property.category === "casa" && <HouseTemplate property={property} agent={agent} whatsappLink={whatsappLink} />}
      {property.category === "chacara" && <FarmTemplate property={property} agent={agent} whatsappLink={whatsappLink} />}
      {property.category === "apartamento" && <ApartmentTemplate property={property} agent={agent} whatsappLink={whatsappLink} />}
    </div>
  );
}
