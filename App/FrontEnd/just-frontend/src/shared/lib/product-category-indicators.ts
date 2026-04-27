import { IndicatorTone, indicatorStyles } from "@/shared/lib/status-indicators";

const categoryToToneMap: Record<string, IndicatorTone> = {
  Aromaterapia: "accent",
  "Bienestar emocional y mental": "info",
  "Bienestar físico": "good",
  "Bienestar dermo-comético": "warning",
};

export function getCategoryIndicatorClass(category?: string | null) {
  return indicatorStyles[categoryToToneMap[category || ""] || "neutral"];
}
