"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { compareToRecommendation, type ImageSlotRecommendation, type RatioMatch } from "./imageRatio";
import { labelStyle } from "./fields";
import { ImagePreviewThumb, ImageUploadBtn } from "./shared";

const FOCAL_POINTS: { value: string; label: string }[] = [
  { value: "0% 0%", label: "↖" },
  { value: "50% 0%", label: "↑" },
  { value: "100% 0%", label: "↗" },
  { value: "0% 50%", label: "←" },
  { value: "50% 50%", label: "•" },
  { value: "100% 50%", label: "→" },
  { value: "0% 100%", label: "↙" },
  { value: "50% 100%", label: "↓" },
  { value: "100% 100%", label: "↘" },
];

export function ImageSlotField({
  passcode,
  value,
  onChange,
  recommendation,
  optional,
  helperNote,
  positionValue,
  onPositionChange,
}: {
  passcode: string;
  value: string;
  onChange: (path: string) => void;
  recommendation: ImageSlotRecommendation;
  optional?: boolean;
  helperNote?: string;
  positionValue?: string;
  onPositionChange?: (position: string) => void;
}) {
  const [ratioMatch, setRatioMatch] = useState<RatioMatch | null>(null);

  const handleFileSelected = async (file: File) => {
    try {
      const { detectImageDimensions } = await import("./imageRatio");
      const dims = await detectImageDimensions(file);
      setRatioMatch(compareToRecommendation(dims, recommendation));
    } catch {
      setRatioMatch(null);
    }
  };

  return (
    <div>
      <label style={labelStyle}>
        {recommendation.label}
        {optional ? " (opcional)" : " *"} — Recomendado: {recommendation.width}×{recommendation.height}px ({recommendation.ratioLabel})
      </label>
      {helperNote && <p style={{ fontSize: "0.72rem", color: "#666", marginTop: "-0.2rem", marginBottom: "0.5rem" }}>{helperNote}</p>}

      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap", padding: "1rem", background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "8px" }}>
        {value && <ImagePreviewThumb src={value} />}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "200px" }}>
          <ImageUploadBtn passcode={passcode} onFileSelected={handleFileSelected} onUploaded={onChange} label={value ? "Trocar imagem" : "Fazer upload"} />

          {ratioMatch && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.75rem",
                color: ratioMatch.ok ? "#4ade80" : "#facc15",
                lineHeight: 1.5,
              }}
            >
              {ratioMatch.ok ? <CheckCircle2 size={13} style={{ flexShrink: 0 }} /> : <AlertTriangle size={13} style={{ flexShrink: 0 }} />}
              {ratioMatch.message}
            </p>
          )}

          {positionValue !== undefined && onPositionChange && value && (
            <div>
              <p style={{ fontSize: "0.72rem", color: "#999", marginBottom: "0.4rem" }}>Ponto focal (enquadramento)</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 28px)", gap: "4px" }}>
                {FOCAL_POINTS.map((point) => (
                  <button
                    key={point.value}
                    type="button"
                    onClick={() => onPositionChange(point.value)}
                    title={point.value}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      border: `1px solid ${positionValue === point.value ? "#D4AF37" : "rgba(255,255,255,0.15)"}`,
                      background: positionValue === point.value ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                      color: positionValue === point.value ? "#D4AF37" : "#888",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    {point.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
