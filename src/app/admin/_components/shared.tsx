"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle, Key, Loader2, Upload, XCircle } from "lucide-react";
import { MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_MB } from "@/lib/uploadLimits";

export type ToastType = { type: "success" | "error"; text: string } | null;

export function Toast({ toast, onClose }: { toast: ToastType; onClose: () => void }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        background: ok ? "#0f2a1a" : "#2a0f0f",
        border: `1px solid ${ok ? "#22c55e" : "#ef4444"}`,
        color: ok ? "#4ade80" : "#f87171",
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        fontSize: "0.9rem",
        fontWeight: 500,
      }}
    >
      {ok ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span>{toast.text}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", marginLeft: "0.5rem" }}>
        ✕
      </button>
    </div>
  );
}

export function LoginScreen({ onLogin }: { onLogin: (p: string) => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pass.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify", { method: "POST", headers: { "x-admin-passcode": pass } });
      if (res.ok) {
        onLogin(pass);
      } else {
        const d = await res.json();
        setError(d.error || "Chave incorreta.");
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "0.9rem 1.2rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(212, 175, 55,0.04) 0%, transparent 70%)",
      }}
    >
      <div style={{ background: "#111", border: "1px solid rgba(212, 175, 55,0.15)", borderRadius: "12px", padding: "3rem", width: "100%", maxWidth: "420px", boxShadow: "0 25px 60px rgba(0,0,0,0.8)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(212, 175, 55,0.1)", border: "1px solid rgba(212, 175, 55,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <Key size={28} style={{ color: "#D4AF37" }} />
          </div>
          <h1 style={{ fontFamily: "Georgia,serif", color: "#D4AF37", fontSize: "1.4rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Painel Admin</h1>
          <p style={{ color: "#888", fontSize: "0.85rem", marginTop: "0.5rem" }}>JB Consultores Imobiliários</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="password" placeholder="Chave de acesso" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus style={inp} onFocus={(e) => (e.target.style.borderColor = "#D4AF37")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
          {error && <p style={{ color: "#f87171", fontSize: "0.85rem", textAlign: "center" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ padding: "0.9rem", background: "#D4AF37", color: "#000", border: "none", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.7 : 1 }}>
            {loading && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Verificando..." : "Acessar Painel"}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function ImageUploadBtn({
  passcode,
  onUploaded,
  onFileSelected,
  label = "Upload",
}: {
  passcode: string;
  onUploaded: (path: string) => void;
  onFileSelected?: (file: File) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setErr(`Máx ${MAX_UPLOAD_SIZE_MB}MB.`);
      return;
    }
    onFileSelected?.(file);
    setLoading(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", headers: { "x-admin-passcode": passcode }, body: fd });
      const data = await res.json();
      if (res.ok) onUploaded(data.path);
      else setErr(data.error || "Erro no upload.");
    } catch {
      setErr("Erro de conexão.");
    } finally {
      setLoading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div>
      <input type="file" ref={ref} accept="image/jpeg,image/png,image/webp" onChange={handle} style={{ display: "none" }} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={loading}
        style={{ padding: "0.5rem 1rem", background: "rgba(212, 175, 55,0.1)", border: "1px solid rgba(212, 175, 55,0.3)", borderRadius: "6px", color: "#D4AF37", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem" }}
      >
        {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
        {loading ? "Enviando..." : label}
      </button>
      {err && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{err}</p>}
    </div>
  );
}

export function ImagePreviewThumb({ src, size = "180px", objectPosition }: { src: string; size?: string; objectPosition?: string }) {
  return (
    <div style={{ position: "relative", width: size, height: "100px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(212, 175, 55,0.3)" }}>
      <Image src={src} alt="capa" fill style={{ objectFit: "cover", objectPosition: objectPosition || "50% 50%" }} />
    </div>
  );
}
