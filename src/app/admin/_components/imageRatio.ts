export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageSlotRecommendation {
  label: string;
  width: number;
  height: number;
  ratioLabel: string;
}

export const IMAGE_RECOMMENDATIONS = {
  heroDesktop: { label: "Capa / Hero — Desktop", width: 1920, height: 1080, ratioLabel: "16:9" },
  heroMobile: { label: "Hero — Mobile (vertical)", width: 1080, height: 1920, ratioLabel: "9:16" },
  gallery: { label: "Galeria", width: 1920, height: 1080, ratioLabel: "16:9" },
} as const satisfies Record<string, ImageSlotRecommendation>;

export function detectImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler a imagem."));
    };
    img.src = url;
  });
}

function ratioOf({ width, height }: ImageDimensions): number {
  return width / height;
}

function closestRatioLabel(ratio: number): string {
  const known: [string, number][] = [
    ["1:1", 1],
    ["4:3", 4 / 3],
    ["3:2", 3 / 2],
    ["16:9", 16 / 9],
    ["9:16", 9 / 16],
    ["3:4", 3 / 4],
    ["2:3", 2 / 3],
  ];
  let best = known[0];
  let bestDiff = Infinity;
  for (const entry of known) {
    const diff = Math.abs(entry[1] - ratio);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = entry;
    }
  }
  return best[0];
}

export interface RatioMatch {
  detectedLabel: string;
  ok: boolean;
  message: string;
}

/** Compara a proporção detectada com a recomendada — nunca bloqueia, só avisa. */
export function compareToRecommendation(detected: ImageDimensions, recommendation: ImageSlotRecommendation): RatioMatch {
  const detectedRatio = ratioOf(detected);
  const recommendedRatio = recommendation.width / recommendation.height;
  const detectedLabel = closestRatioLabel(detectedRatio);
  const diff = Math.abs(detectedRatio - recommendedRatio) / recommendedRatio;

  if (diff <= 0.08) {
    return { detectedLabel, ok: true, message: `Sua imagem: ${detectedLabel} — Recomendado: ${recommendation.ratioLabel} ✓ Excelente` };
  }

  const cutWarning =
    recommendedRatio > 1 && detectedRatio < 1
      ? "poderá sofrer corte nas laterais"
      : recommendedRatio < 1 && detectedRatio > 1
      ? "poderá sofrer corte em cima/embaixo no celular"
      : "poderá sofrer corte no enquadramento";

  return {
    detectedLabel,
    ok: false,
    message: `Sua imagem: ${detectedLabel} — Recomendado: ${recommendation.ratioLabel} ⚠ Essa imagem ${cutWarning}.`,
  };
}
