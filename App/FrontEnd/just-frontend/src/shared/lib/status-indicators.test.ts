import {
  getExpiryLabel,
  getStateIndicatorClass,
  getStockTone,
  indicatorStyles,
} from "./status-indicators";

function dateFromToday(days: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

describe("status indicators", () => {
  test("maps stock levels to severity tones", () => {
    expect(getStockTone(5)).toBe("bad");
    expect(getStockTone(15)).toBe("warning");
    expect(getStockTone(16)).toBe("good");
  });

  test("returns neutral style for unknown states", () => {
    expect(getStateIndicatorClass("Desconocido")).toBe(indicatorStyles.neutral);
  });

  test("formats expiration labels relative to today", () => {
    expect(getExpiryLabel(null)).toBe("Sin vencimiento");
    expect(getExpiryLabel(dateFromToday(0))).toBe("Vence hoy");
    expect(getExpiryLabel(dateFromToday(1))).toBe("Vence manana");
    expect(getExpiryLabel(dateFromToday(-2))).toBe("Vencido hace 2 dias");
  });
});
