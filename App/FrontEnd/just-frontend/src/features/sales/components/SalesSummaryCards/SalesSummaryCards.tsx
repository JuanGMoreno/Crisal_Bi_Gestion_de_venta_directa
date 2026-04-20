import { CircleDollarSign, FileClock, ReceiptText, Users } from "lucide-react";
import { Sale } from "../../types/Sale";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  }).format(value);
}

interface SalesSummaryCardsProps {
  sales: Sale[];
}

export function SalesSummaryCards({ sales }: SalesSummaryCardsProps) {
  const closedSales = sales.filter((sale) => sale.estado === "Cerrada");
  const openSales = sales.filter((sale) => sale.estado === "Abierta");
  const billedTotal = closedSales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const uniqueClients = new Set(
    sales.map((sale) => sale.cliente?.id_cliente).filter(Boolean)
  ).size;

  const cards = [
    {
      title: "Ventas registradas",
      value: sales.length.toLocaleString("es-CO"),
      description: "Total de ventas creadas en el sistema",
      icon: ReceiptText,
    },
    {
      title: "Ventas abiertas",
      value: openSales.length.toLocaleString("es-CO"),
      description: "Ventas pendientes por cerrar o anular",
      icon: FileClock,
    },
    {
      title: "Total facturado",
      value: formatCurrency(billedTotal),
      description: "Suma de las ventas cerradas",
      icon: CircleDollarSign,
    },
    {
      title: "Clientes atendidos",
      value: uniqueClients.toLocaleString("es-CO"),
      description: "Clientes distintos asociados a ventas",
      icon: Users,
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

