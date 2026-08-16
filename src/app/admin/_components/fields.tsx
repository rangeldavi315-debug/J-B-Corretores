"use client";

import { KeyboardEvent, ReactNode, useState } from "react";
import { Plus, X } from "lucide-react";

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  outline: "none",
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.4rem",
  fontSize: "0.78rem",
  color: "#999",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export const sectionTitleStyle: React.CSSProperties = {
  fontSize: "0.82rem",
  color: "#D4AF37",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "0.9rem",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid rgba(212,175,55,0.15)",
};

export function FieldGrid({ children, columns = 3 }: { children: ReactNode; columns?: number }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "1rem" }}>{children}</div>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <p style={sectionTitleStyle}>{title}</p>
      {children}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          style={{ ...inputStyle, resize: "vertical", minHeight: "90px", lineHeight: 1.6 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        style={inputStyle}
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  );
}

export function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        cursor: "pointer",
        padding: "0.75rem 1rem",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "6px",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: "#D4AF37", width: "16px", height: "16px" }}
      />
      <span style={{ color: "#ccc", fontSize: "0.88rem" }}>{label}</span>
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Lista dinâmica: "+ Adicionar característica" — usada em diferenciais, infraestrutura, lazer, etc. */
export function TagListInput({
  label,
  items,
  onChange,
  placeholder = "Ex: Área gourmet",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          {items.map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: "20px",
                padding: "0.35rem 0.5rem 0.35rem 0.9rem",
                fontSize: "0.82rem",
                color: "#D4AF37",
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => remove(idx)}
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "none",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#f87171",
                }}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          style={inputStyle}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0 1rem",
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "6px",
            color: "#D4AF37",
            cursor: "pointer",
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>
    </div>
  );
}
