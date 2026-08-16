"use client";

import { ArrowLeft } from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_LABELS, type PropertyCategory } from "@/types/property";

const CATEGORIES: PropertyCategory[] = ["loteamento", "casa", "chacara", "apartamento"];

export function CategoryPicker({ onSelect, onCancel }: { onSelect: (category: PropertyCategory) => void; onCancel: () => void }) {
  return (
    <div>
      <button
        onClick={onCancel}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", color: "#777", cursor: "pointer", marginBottom: "1.5rem", fontSize: "0.88rem" }}
      >
        <ArrowLeft size={15} /> Voltar à lista
      </button>

      <h2 style={{ fontFamily: "Georgia,serif", color: "#D4AF37", fontSize: "1.15rem", marginBottom: "0.5rem", letterSpacing: "0.04em" }}>
        Novo Cadastro
      </h2>
      <p style={{ color: "#888", fontSize: "0.88rem", marginBottom: "2rem" }}>Qual tipo de imóvel você deseja cadastrar?</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "2.25rem 1rem",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: "2.2rem" }}>{CATEGORY_ICONS[category]}</span>
            <span style={{ color: "#eee", fontWeight: 600, fontSize: "0.9rem", textAlign: "center" }}>{CATEGORY_LABELS[category]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
