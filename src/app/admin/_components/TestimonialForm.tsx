"use client";

import { useState } from "react";

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  rating: number;
  status: string;
}

export function TestimonialForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<Testimonial>;
  onSave: (t: Testimonial) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Testimonial>>(initial);
  const set = <K extends keyof Testimonial>(f: K, v: Testimonial[K]) => setForm((p) => ({ ...p, [f]: v }));
  const isNew = !initial.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text?.trim()) return alert("Informe o texto.");
    if (!form.author?.trim()) return alert("Informe o autor.");
    onSave({ id: form.id || String(Date.now()), text: form.text || "", author: form.author || "", role: form.role || "", rating: form.rating || 5, status: form.status || "active" });
  };

  const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "0.95rem", fontFamily: "inherit", outline: "none" };
  const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.78rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={lbl}>Nome do Cliente *</label>
          <input style={inp} value={form.author || ""} onChange={(e) => set("author", e.target.value)} required placeholder="Ex: João da Silva" />
        </div>
        <div>
          <label style={lbl}>Contexto / Ocupação</label>
          <input style={inp} value={form.role || ""} onChange={(e) => set("role", e.target.value)} placeholder="Ex: Investidor, Comprador..." />
        </div>
        <div>
          <label style={lbl}>Avaliação</label>
          <select style={inp} value={form.rating || 5} onChange={(e) => set("rating", Number(e.target.value))}>
            <option value={5}>⭐⭐⭐⭐⭐ 5 estrelas</option>
            <option value={4}>⭐⭐⭐⭐ 4 estrelas</option>
            <option value={3}>⭐⭐⭐ 3 estrelas</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Status</label>
          <select style={inp} value={form.status || "active"} onChange={(e) => set("status", e.target.value)}>
            <option value="active">Publicado</option>
            <option value="draft">Rascunho</option>
          </select>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label style={lbl}>Texto do Depoimento *</label>
          <textarea style={{ ...inp, resize: "vertical", minHeight: "120px", lineHeight: 1.6 }} value={form.text || ""} onChange={(e) => set("text", e.target.value)} required placeholder="Depoimento do cliente..." />
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={{ padding: "0.8rem 1.8rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "#ccc", cursor: "pointer" }}>Cancelar</button>
        <button type="submit" style={{ padding: "0.8rem 2rem", background: "#D4AF37", border: "none", borderRadius: "6px", color: "#000", cursor: "pointer", fontWeight: 700 }}>
          {isNew ? "Criar Depoimento" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
