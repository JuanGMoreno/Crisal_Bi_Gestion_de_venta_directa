import { Boxes, CalendarClock, PackageCheck, WalletCards } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  getExpiryLabel,
  getExpiryTone,
  getIndicatorClass,
} from "@/shared/lib/status-indicators";
import { cn } from "@/shared/lib/utils";
import { InventorySummaryItem } from "../../types/Inventory";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateLabel(value?: string) {
  if (!value) return "Sin vencimiento";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(value));
}

interface InventorySummaryCardsProps {
  items: InventorySummaryItem[];
}

export function InventorySummaryCards({ items }: InventorySummaryCardsProps) {
  const totalStock = items.reduce((sum, item) => sum + item.stock_total, 0);
  const totalInventoryValue = items.reduce(
    (sum, item) => sum + item.stock_total * Number(item.costo_promedio_compra),
    0
  );
  const productsWithStock = items.filter((item) => item.stock_total > 0).length;

  const nextExpiry = items
    .flatMap((item) => item.proximas_fechas_vencimiento)
    .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())[0];
  const nextExpiryTone = getExpiryTone(nextExpiry);
  const nextExpiryLabel = getExpiryLabel(nextExpiry);

  const cards = [
    {
      title: "Stock Total",
      value: totalStock.toLocaleString("es-CO"),
      description: "Unidades disponibles en todos los productos",
      icon: Boxes,
    },
    {
      title: "Productos con Stock",
      value: productsWithStock.toLocaleString("es-CO"),
      description: "Productos que aun tienen unidades disponibles",
      icon: PackageCheck,
    },
    {
      title: "Valor del Inventario",
      value: formatCurrency(totalInventoryValue),
      description: "Estimacion del capital invertido segun el stock actual",
      icon: WalletCards,
    },
    {
      title: "Proximo Vencimiento",
      value: formatDateLabel(nextExpiry),
      description: "Fecha mas cercana registrada en el inventario",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="m-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:bg-accent/30"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{card.value}</h3>
                {card.title === "Proximo Vencimiento" ? (
                  <div className="mt-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "border font-medium",
                        getIndicatorClass(nextExpiryTone),
                        nextExpiry && nextExpiryTone === "bad"
                          ? "shadow-[0_0_0_3px_rgba(244,63,94,0.10)]"
                          : ""
                      )}
                    >
                      {nextExpiryLabel}
                    </Badge>
                  </div>
                ) : null}
              </div>
              <div className="rounded-xl border bg-background p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}
