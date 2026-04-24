export type IndicatorTone =
  | "good"
  | "warning"
  | "bad"
  | "neutral"
  | "info"
  | "accent";

export const indicatorStyles: Record<IndicatorTone, string> = {
  good:
    "border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:border-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-200 dark:hover:bg-emerald-900/50",
  warning:
    "border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900/35 dark:text-yellow-200 dark:hover:bg-yellow-900/50",
  bad:
    "border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200 dark:border-rose-700 dark:bg-rose-900/35 dark:text-rose-200 dark:hover:bg-rose-900/50",
  neutral:
    "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900/35 dark:text-slate-200 dark:hover:bg-slate-900/50",
  info:
    "border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/35 dark:text-blue-200 dark:hover:bg-blue-900/50",
  accent:
    "border-purple-300 bg-purple-100 text-purple-800 hover:bg-purple-200 dark:border-purple-700 dark:bg-purple-900/35 dark:text-purple-200 dark:hover:bg-purple-900/50",
};

export const destructiveMenuItemClass =
  "text-red-500 hover:bg-red-200 focus:bg-red-100 data-[state=open]:bg-red-100 hover:text-red-700 focus:text-red-700";

const stateToToneMap: Record<string, IndicatorTone> = {
  Activo: "good",
  Inactivo: "bad",
  Abierta: "warning",
  Cerrada: "good",
  Anulada: "bad",
};

export function getIndicatorClass(tone: IndicatorTone) {
  return indicatorStyles[tone];
}

export function getStateIndicatorClass(state?: string | null) {
  return indicatorStyles[stateToToneMap[state || ""] || "neutral"];
}

export function getStockTone(stock: number) {
  if (stock <= 5) return "bad";
  if (stock <= 15) return "warning";
  return "good";
}

export function getExpiryTone(date?: string | null): IndicatorTone {
  if (!date) return "neutral";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(date);
  expiry.setHours(0, 0, 0, 0);

  const diffInDays = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);

  if (diffInDays < 0) return "bad";
  if (diffInDays <= 7) return "bad";
  if (diffInDays <= 30) return "warning";
  return "good";
}

export function getExpiryLabel(date?: string | null) {
  if (!date) {
    return "Sin vencimiento";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(date);
  expiry.setHours(0, 0, 0, 0);

  const diffInDays = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);

  if (diffInDays < 0) {
    return `Vencido hace ${Math.abs(diffInDays)} dia${Math.abs(diffInDays) === 1 ? "" : "s"}`;
  }

  if (diffInDays === 0) {
    return "Vence hoy";
  }

  if (diffInDays === 1) {
    return "Vence manana";
  }

  return `Vence en ${diffInDays} dias`;
}
