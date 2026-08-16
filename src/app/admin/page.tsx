"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Plus, Trash2, Edit2, LogOut, Github, Loader2, Star, Home,
  ChevronRight, GripVertical,
} from "lucide-react";
import companyData from "../../../content/company.json";
import type { Agent, Property, PropertyCategory } from "@/types/property";
import { CATEGORY_LABELS, STATUS_LABELS, createEmptyProperty } from "@/types/property";
import { getCardHeadlinePrice, getCardSpecs } from "@/lib/propertyPresentation";
import { Toast, ToastType, LoginScreen } from "./_components/shared";
import { CategoryPicker } from "./_components/CategoryPicker";
import { PropertyEditor } from "./_components/PropertyEditor";
import { TestimonialForm, type Testimonial } from "./_components/TestimonialForm";

const agents = companyData.agents as Agent[];

type Tab = "properties" | "testimonials";
type View = "list" | "pick-category" | "form";

const CATEGORY_COLORS: Record<PropertyCategory, string> = {
  loteamento: "#60a5fa",
  casa: "#34d399",
  chacara: "#fb923c",
  apartamento: "#a78bfa",
};

const STATUS_COLORS: Record<Property["status"], { bg: string; text: string }> = {
  draft: { bg: "rgba(255,255,255,0.06)", text: "#888" },
  published: { bg: "rgba(34,197,94,0.12)", text: "#4ade80" },
  reserved: { bg: "rgba(96,165,250,0.12)", text: "#60a5fa" },
  sold: { bg: "rgba(239,68,68,0.12)", text: "#f87171" },
};

function newDraft(category: PropertyCategory, count: number): Property {
  const now = new Date().toISOString();
  return createEmptyProperty(category, {
    id: "",
    slug: "",
    title: "",
    status: "draft",
    city: "",
    description: "",
    coverImage: "",
    images: [],
    featured: false,
    order: count + 1,
    whatsappAgentId: agents[0].whatsapp,
    createdAt: now,
    updatedAt: now,
  });
}

export default function AdminPanel() {
  const [passcode, setPasscode] = useState(() => (typeof window !== "undefined" ? sessionStorage.getItem("jb-admin-pass") || "" : ""));
  const [isAuth, setIsAuth] = useState(() => (typeof window !== "undefined" ? !!sessionStorage.getItem("jb-admin-pass") : false));
  const [properties, setProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [tab, setTab] = useState<Tab>("properties");
  const [view, setView] = useState<View>("list");
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [editingTest, setEditingTest] = useState<Partial<Testimonial> | null>(null);
  const [toast, setToast] = useState<ToastType>(null);
  const [gitStatus, setGitStatus] = useState<"idle" | "publishing" | "success" | "error">("idle");
  const [gitMsg, setGitMsg] = useState("");
  const dragPropId = useRef<string | null>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [rp, rt] = await Promise.all([fetch("/api/admin/properties"), fetch("/api/admin/testimonials")]);
      if (rp.ok) setProperties(await rp.json());
      if (rt.ok) setTestimonials(await rt.json());
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carrega dados do servidor ao montar se já havia sessão salva
    if (isAuth) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (pass: string) => {
    setPasscode(pass);
    setIsAuth(true);
    sessionStorage.setItem("jb-admin-pass", pass);
    loadData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jb-admin-pass");
    setIsAuth(false);
    setPasscode("");
    setProperties([]);
    setTestimonials([]);
  };

  const backToList = () => {
    setView("list");
    setEditingProp(null);
    setEditingTest(null);
  };

  const persistProperties = async (updated: Property[]) => {
    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setProperties(updated);
        showToast("success", "Salvo com sucesso!");
        backToList();
      } else {
        const d = await res.json();
        showToast("error", d.error || "Erro ao salvar.");
      }
    } catch {
      showToast("error", "Erro de conexão.");
    }
  };

  const persistTestimonials = async (updated: Testimonial[]) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setTestimonials(updated);
        showToast("success", "Salvo com sucesso!");
        backToList();
      } else {
        const d = await res.json();
        showToast("error", d.error || "Erro ao salvar.");
      }
    } catch {
      showToast("error", "Erro de conexão.");
    }
  };

  const handleSaveProp = (prop: Property) => {
    const exists = properties.some((p) => p.id === prop.id);
    const updated = exists ? properties.map((p) => (p.id === prop.id ? prop : p)) : [...properties, prop];
    updated.sort((a, b) => a.order - b.order);
    persistProperties(updated);
  };

  const handleDeleteProp = (id: string) => {
    if (!confirm("Excluir este cadastro?")) return;
    persistProperties(properties.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    const updated = properties.map((p) =>
      p.id === id ? { ...p, status: p.status === "published" ? ("draft" as const) : ("published" as const) } : p
    );
    persistProperties(updated);
  };

  const handleDragStart = (id: string) => {
    dragPropId.current = id;
  };
  const handleDrop = (targetId: string) => {
    if (!dragPropId.current || dragPropId.current === targetId) return;
    const arr = [...properties];
    const fi = arr.findIndex((p) => p.id === dragPropId.current);
    const ti = arr.findIndex((p) => p.id === targetId);
    const [m] = arr.splice(fi, 1);
    arr.splice(ti, 0, m);
    dragPropId.current = null;
    persistProperties(arr.map((p, i) => ({ ...p, order: i + 1 })));
  };

  const handleSaveTest = (t: Testimonial) => {
    const exists = testimonials.some((x) => x.id === t.id);
    const updated = exists ? testimonials.map((x) => (x.id === t.id ? t : x)) : [...testimonials, t];
    persistTestimonials(updated);
  };

  const handleDeleteTest = (id: string) => {
    if (!confirm("Excluir este depoimento?")) return;
    persistTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const handlePublish = async () => {
    setGitStatus("publishing");
    setGitMsg("Preparando publicação...");
    try {
      const res = await fetch("/api/admin/git-publish", { method: "POST", headers: { "x-admin-passcode": passcode } });
      const d = await res.json();
      if (res.ok) {
        setGitStatus("success");
        setGitMsg("✅ Publicado! Deploy iniciado na Vercel.");
      } else {
        setGitStatus("error");
        setGitMsg(d.error || "Erro ao publicar.");
      }
    } catch {
      setGitStatus("error");
      setGitMsg("Erro de conexão.");
    }
    setTimeout(() => {
      setGitStatus("idle");
      setGitMsg("");
    }, 8000);
  };

  if (!isAuth) return <LoginScreen onLogin={handleLogin} />;

  return (
    <>
      <style>{`
        @keyframes spin{100%{transform:rotate(360deg)}}
        .arow:hover{background:rgba(255,255,255,0.025)!important}
        input:focus,select:focus,textarea:focus{border-color:rgba(212, 175, 55,0.5)!important}
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#090909", color: "#fff", fontFamily: "system-ui,sans-serif" }}>
        {/* Sidebar */}
        <aside style={{ width: "230px", background: "#0d0d0d", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(212, 175, 55,0.4)", flexShrink: 0 }}>
                <Image src="/logo.png" alt="JB" width={44} height={44} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
              <div>
                <p style={{ fontSize: "0.72rem", color: "#D4AF37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Admin CMS</p>
                <p style={{ fontSize: "0.65rem", color: "#555" }}>JB Consultores</p>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "0.75rem 0" }}>
            {([["properties", "Empreendimentos", properties.length], ["testimonials", "Depoimentos", testimonials.length]] as const).map(([id, label, cnt]) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  backToList();
                }}
                style={{ border: "none", borderLeft: `3px solid ${tab === id ? "#D4AF37" : "transparent"}`, padding: "0.8rem 1.25rem", textAlign: "left", cursor: "pointer", color: tab === id ? "#D4AF37" : "#777", fontSize: "0.88rem", fontFamily: "inherit", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: tab === id ? "rgba(212, 175, 55,0.04)" : "transparent" }}
              >
                <span>{label}</span>
                <span style={{ fontSize: "0.72rem", background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "0.1rem 0.45rem" }}>{cnt}</span>
              </button>
            ))}
          </nav>

          <div style={{ padding: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <a href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#555", fontSize: "0.8rem", textDecoration: "none" }}>
              <Home size={13} /> Ver o Site
            </a>
            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem", padding: 0 }}>
              <LogOut size={13} /> Sair
            </button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Topbar */}
          <div style={{ padding: "1rem 1.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
              <span style={{ color: "#D4AF37" }}>{tab === "properties" ? "Empreendimentos" : "Depoimentos"}</span>
              {view !== "list" && (
                <>
                  <ChevronRight size={13} style={{ color: "#555" }} />
                  <span style={{ color: "#888" }}>{view === "pick-category" ? "Novo Cadastro" : editingProp?.id || editingTest?.id ? "Editar" : "Novo"}</span>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <button
                  onClick={handlePublish}
                  disabled={gitStatus === "publishing"}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.1rem", background: gitStatus === "success" ? "rgba(34,197,94,0.1)" : gitStatus === "error" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${gitStatus === "success" ? "#22c55e" : gitStatus === "error" ? "#ef4444" : "rgba(255,255,255,0.12)"}`, borderRadius: "6px", color: gitStatus === "success" ? "#4ade80" : gitStatus === "error" ? "#f87171" : "#ccc", cursor: gitStatus === "publishing" ? "not-allowed" : "pointer", fontSize: "0.82rem", fontFamily: "inherit", opacity: gitStatus === "publishing" ? 0.7 : 1 }}
                >
                  {gitStatus === "publishing" ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Github size={14} />}
                  <span>{gitStatus === "publishing" ? "Publicando..." : "Publicar no GitHub"}</span>
                </button>
                {gitMsg && (
                  <div style={{ position: "absolute", top: "110%", right: 0, width: "260px", background: "#111", border: "1px solid rgba(212, 175, 55,0.2)", borderRadius: "6px", padding: "0.75rem", fontSize: "0.78rem", lineHeight: 1.5, zIndex: 50, boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
                    {gitMsg}
                  </div>
                )}
              </div>
              {view === "list" && (
                <button
                  onClick={() => {
                    if (tab === "properties") {
                      setView("pick-category");
                    } else {
                      setEditingTest({ status: "active", rating: 5 });
                      setView("form");
                    }
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", background: "#D4AF37", border: "none", borderRadius: "6px", color: "#000", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}
                >
                  <Plus size={14} /> {tab === "properties" ? "Novo Cadastro" : "Adicionar Depoimento"}
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.75rem" }}>
            {loadingData ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", color: "#D4AF37" }}>
                <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : view === "pick-category" ? (
              <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
                <CategoryPicker
                  onSelect={(category) => {
                    setEditingProp(newDraft(category, properties.length));
                    setView("form");
                  }}
                  onCancel={backToList}
                />
              </div>
            ) : view === "form" ? (
              <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
                <button onClick={backToList} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", color: "#777", cursor: "pointer", marginBottom: "1.5rem", fontSize: "0.88rem" }}>
                  ← Voltar à lista
                </button>
                {tab === "properties" && editingProp !== null && (
                  <>
                    <h2 style={{ fontFamily: "Georgia,serif", color: "#D4AF37", fontSize: "1.15rem", marginBottom: "2rem", letterSpacing: "0.04em" }}>
                      {editingProp.id ? "Editar" : "Novo"} {CATEGORY_LABELS[editingProp.category]}
                    </h2>
                    <PropertyEditor initial={editingProp} count={properties.length} passcode={passcode} onSave={handleSaveProp} onCancel={backToList} />
                  </>
                )}
                {tab === "testimonials" && editingTest !== null && (
                  <>
                    <h2 style={{ fontFamily: "Georgia,serif", color: "#D4AF37", fontSize: "1.15rem", marginBottom: "2rem", letterSpacing: "0.04em" }}>
                      {editingTest.id ? "Editar Depoimento" : "Novo Depoimento"}
                    </h2>
                    <TestimonialForm initial={editingTest} onSave={handleSaveTest} onCancel={backToList} />
                  </>
                )}
              </div>
            ) : tab === "properties" ? (
              <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0a0a0a" }}>
                      {["", "Imóvel", "Categoria", "Valor", "Corretor", "Status", "Ações"].map((h) => (
                        <th key={h} style={{ padding: "0.9rem 1.25rem", textAlign: h === "Ações" ? "right" : "left", fontSize: "0.72rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#444" }}>
                          Nenhum cadastro ainda. Clique em &quot;Novo Cadastro&quot;.
                        </td>
                      </tr>
                    ) : (
                      properties.map((prop) => {
                        const agent = agents.find((a) => a.whatsapp === prop.whatsappAgentId) ?? agents[0];
                        const specs = getCardSpecs(prop);
                        const headlinePrice = getCardHeadlinePrice(prop);
                        const statusColor = STATUS_COLORS[prop.status];
                        return (
                          <tr
                            key={prop.id}
                            className="arow"
                            draggable
                            onDragStart={() => handleDragStart(prop.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(prop.id)}
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "grab" }}
                          >
                            <td style={{ padding: "0.9rem 0.5rem 0.9rem 1.25rem" }}>
                              <GripVertical size={15} style={{ color: "#333" }} />
                            </td>
                            <td style={{ padding: "0.9rem 1.25rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                                <div style={{ position: "relative", width: "60px", height: "40px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "#1a1a1a" }}>
                                  {prop.coverImage && <Image src={prop.coverImage} alt={prop.title} fill style={{ objectFit: "cover" }} />}
                                </div>
                                <div>
                                  <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#eee", marginBottom: "0.15rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    {prop.title || <em style={{ color: "#555" }}>Sem título</em>}
                                    {prop.isDemo && (
                                      <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "4px", background: "rgba(168,85,247,0.15)", color: "#c084fc", letterSpacing: "0.04em" }}>
                                        DEMO
                                      </span>
                                    )}
                                  </p>
                                  <p style={{ fontSize: "0.72rem", color: "#555" }}>
                                    {prop.city}
                                    {prop.featured && <span style={{ color: "#D4AF37", marginLeft: "0.4rem" }}>★</span>}
                                    {prop.images.length > 0 && <span style={{ marginLeft: "0.4rem", color: "#666" }}>🖼 {prop.images.length}</span>}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "0.9rem 1.25rem" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "4px", background: `${CATEGORY_COLORS[prop.category]}15`, color: CATEGORY_COLORS[prop.category], display: "inline-block", width: "fit-content" }}>
                                  {CATEGORY_LABELS[prop.category]}
                                </span>
                                {specs.length > 0 && <span style={{ fontSize: "0.7rem", color: "#555" }}>{specs.join(" · ")}</span>}
                              </div>
                            </td>
                            <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.82rem", color: "#D4AF37", fontWeight: 500 }}>
                              {headlinePrice || <span style={{ color: "#444", fontStyle: "italic" }}>Sob consulta</span>}
                            </td>
                            <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.78rem", color: "#666" }}>{agent.name}</td>
                            <td style={{ padding: "0.9rem 1.25rem" }}>
                              <button
                                onClick={() => handleToggleStatus(prop.id)}
                                title="Clique para alternar entre Rascunho e Publicado"
                                style={{ fontSize: "0.72rem", padding: "0.2rem 0.6rem", borderRadius: "20px", border: "none", cursor: "pointer", background: statusColor.bg, color: statusColor.text }}
                              >
                                ● {STATUS_LABELS[prop.status]}
                              </button>
                            </td>
                            <td style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                                <a href={`/imovel/${prop.slug}`} target="_blank" rel="noopener noreferrer" title="Ver página" style={{ padding: "0.35rem 0.55rem", background: "rgba(212, 175, 55,0.08)", border: "1px solid rgba(212, 175, 55,0.2)", borderRadius: "5px", color: "#D4AF37", display: "flex", alignItems: "center", textDecoration: "none" }}>
                                  <Home size={13} />
                                </a>
                                <button onClick={() => { setEditingProp(prop); setView("form"); }} title="Editar" style={{ padding: "0.35rem 0.55rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", color: "#ccc", cursor: "pointer" }}>
                                  <Edit2 size={13} />
                                </button>
                                <button onClick={() => handleDeleteProp(prop.id)} title="Excluir" style={{ padding: "0.35rem 0.55rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "5px", color: "#ef4444", cursor: "pointer" }}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0a0a0a" }}>
                      {["Cliente", "Avaliação", "Status", "Ações"].map((h) => (
                        <th key={h} style={{ padding: "0.9rem 1.25rem", textAlign: h === "Ações" ? "right" : "left", fontSize: "0.72rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#444" }}>
                          Nenhum depoimento cadastrado.
                        </td>
                      </tr>
                    ) : (
                      testimonials.map((t) => (
                        <tr key={t.id} className="arow" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "0.9rem 1.25rem" }}>
                            <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#eee" }}>{t.author}</p>
                            <p style={{ fontSize: "0.72rem", color: "#555", marginBottom: "0.2rem" }}>{t.role}</p>
                            <p style={{ fontSize: "0.75rem", color: "#444", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>&quot;{t.text}&quot;</p>
                          </td>
                          <td style={{ padding: "0.9rem 1.25rem" }}>
                            <div style={{ display: "flex", gap: "2px" }}>
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} size={13} fill={i <= t.rating ? "#D4AF37" : "transparent"} style={{ color: i <= t.rating ? "#D4AF37" : "#333" }} />
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: "0.9rem 1.25rem" }}>
                            <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.6rem", borderRadius: "20px", background: t.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)", color: t.status === "active" ? "#4ade80" : "#666" }}>
                              {t.status === "active" ? "● Ativo" : "○ Rascunho"}
                            </span>
                          </td>
                          <td style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                              <button onClick={() => { setEditingTest(t); setView("form"); }} style={{ padding: "0.35rem 0.55rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", color: "#ccc", cursor: "pointer" }}>
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => handleDeleteTest(t.id)} style={{ padding: "0.35rem 0.55rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "5px", color: "#ef4444", cursor: "pointer" }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
