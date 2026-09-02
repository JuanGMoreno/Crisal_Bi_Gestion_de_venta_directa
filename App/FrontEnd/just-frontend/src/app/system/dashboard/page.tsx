"use client";

import type React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  Boxes,
  CalendarClock,
  CircleDollarSign,
  PackageCheck,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDashboardQuery } from "@/features/dashboard/hooks/useDashboardQuery";

const salesTrendConfig = {
  revenue: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
  profit: {
    label: "Ganancia",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const topProductsConfig = {
  quantity: {
    label: "Unidades",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-CO").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getVariationMeta(value: number) {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return {
    Icon,
    className: isPositive
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-200"
      : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/35 dark:text-rose-200",
    label: `${isPositive ? "+" : ""}${value}%`,
  };
}

function MetricCard({
  title,
  value,
  helper,
  variation,
  icon: Icon,
}: {
  title: string;
  value: string;
  helper: string;
  variation?: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const variationMeta = variation === undefined ? null : getVariationMeta(variation);

  return (
    <div className="min-w-0 rounded-lg border bg-card p-3 shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 break-words text-xl font-semibold tracking-tight sm:text-2xl">
            {value}
          </h3>
        </div>
        <div className="shrink-0 rounded-lg border bg-background p-2 text-link">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-sm text-muted-foreground">{helper}</p>
        {variationMeta ? (
          <Badge
            variant="outline"
            className={`shrink-0 gap-1 ${variationMeta.className}`}
          >
            <variationMeta.Icon className="h-3.5 w-3.5" />
            {variationMeta.label}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-w-0 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-lg" />
        ))}
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">
        <Skeleton className="h-96 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: dashboard, isLoading, isError, error } = useDashboardQuery();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !dashboard) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
        {error?.message || "No se pudo cargar el panel de control."}
      </div>
    );
  }

  const trendData = dashboard.salesTrend.map((item) => ({
    ...item,
    label: formatDate(item.date),
  }));

  const topProductsData = dashboard.topProducts.map((product) => ({
    ...product,
    shortName:
      product.nombre.length > 14
        ? `${product.nombre.slice(0, 14)}...`
        : product.nombre,
  }));

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Panel de Control</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Corte actualizado el {formatFullDate(dashboard.generatedAt)}
          </p>
        </div>
        <div className="grid w-full grid-cols-3 gap-2 text-center text-sm sm:w-auto">
          <div className="rounded-lg border bg-card px-3 py-2">
            <p className="font-semibold">{dashboard.salesStatus.Abierta}</p>
            <p className="text-xs text-muted-foreground">Abiertas</p>
          </div>
          <div className="rounded-lg border bg-card px-3 py-2">
            <p className="font-semibold">{dashboard.salesStatus.Cerrada}</p>
            <p className="text-xs text-muted-foreground">Cerradas</p>
          </div>
          <div className="rounded-lg border bg-card px-3 py-2">
            <p className="font-semibold">{dashboard.salesStatus.Anulada}</p>
            <p className="text-xs text-muted-foreground">Anuladas</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Ingresos del mes"
          value={formatCurrency(dashboard.currentMonth.revenue)}
          helper="Comparado con el mes anterior"
          variation={dashboard.comparisons.revenueChange}
          icon={CircleDollarSign}
        />
        <MetricCard
          title="Ganancia del mes"
          value={formatCurrency(dashboard.currentMonth.profit)}
          helper="Ingresos menos costo de lotes"
          variation={dashboard.comparisons.profitChange}
          icon={TrendingUp}
        />
        <MetricCard
          title="Ventas cerradas"
          value={formatNumber(dashboard.currentMonth.orders)}
          helper={`${formatNumber(dashboard.currentMonth.units)} unidades vendidas`}
          variation={dashboard.comparisons.ordersChange}
          icon={ReceiptText}
        />
        <MetricCard
          title="Inventario valorizado"
          value={formatCurrency(dashboard.inventory.estimatedValue)}
          helper={`${formatNumber(dashboard.inventory.totalUnits)} unidades disponibles`}
          icon={Boxes}
        />
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]">
        <div className="min-w-0 overflow-hidden rounded-lg border bg-card p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Ingresos y ganancias</h2>
            <p className="text-sm text-muted-foreground">Ultimos 30 dias</p>
          </div>
          <ChartContainer config={salesTrendConfig} className="h-64 min-w-0 w-full sm:h-80">
            <AreaChart data={trendData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={52}
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.28}
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
              <Area
                dataKey="profit"
                type="natural"
                fill="var(--color-profit)"
                fillOpacity={0.18}
                stroke="var(--color-profit)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border bg-card p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Productos mas vendidos</h2>
              <p className="text-sm text-muted-foreground">Mes actual</p>
            </div>
            <PackageCheck className="h-5 w-5 text-link" />
          </div>
          {topProductsData.length > 0 ? (
            <ChartContainer config={topProductsConfig} className="h-64 min-w-0 w-full sm:h-80">
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="shortName"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={92}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="quantity"
                  fill="var(--color-quantity)"
                  radius={6}
                  barSize={22}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground sm:h-80">
              Sin ventas cerradas este mes.
            </div>
          )}
        </div>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <div className="min-w-0 rounded-lg border bg-card p-3 shadow-sm sm:p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Detalle comercial</h2>
              <p className="text-sm text-muted-foreground">
                Ticket promedio: {formatCurrency(dashboard.currentMonth.averageTicket)}
              </p>
            </div>
            <BadgeDollarSign className="h-5 w-5 text-link" />
          </div>
          <div className="space-y-3">
            {dashboard.topProducts.length > 0 ? (
              dashboard.topProducts.map((product) => (
                <div
                  key={product.id_producto}
                  className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{product.nombre}</p>
                      <Badge variant="secondary">{product.codigo}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatNumber(product.quantity)} unidades · {product.categoria || "Sin categoría"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(product.profit)} ganancia
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Sin productos vendidos este mes.
              </p>
            )}
          </div>
        </div>

        <div className="min-w-0 rounded-lg border bg-card p-3 shadow-sm sm:p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Alertas de inventario</h2>
              <p className="text-sm text-muted-foreground">
                {formatNumber(
                  dashboard.inventory.lowStock.length + dashboard.inventory.expiringOrExpired.length
                )} alertas activas
              </p>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-300" />
          </div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Boxes className="h-4 w-4 text-rose-600 dark:text-rose-300" />
            Stock bajo
          </div>
          <div className="space-y-3">
            {dashboard.inventory.lowStock.length > 0 ? (
              dashboard.inventory.lowStock.map((item) => (
                <div
                  key={item.id_producto}
                  className="flex flex-col items-stretch gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{item.nombre}</p>
                      <Badge variant="outline">{item.codigo}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.lotes_activos} lotes activos
                    </p>
                  </div>
                  <Badge className="w-fit max-w-full shrink-0 whitespace-normal bg-amber-600 text-left text-white hover:bg-amber-600">
                    {formatNumber(item.stock_total)} uds
                  </Badge>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No hay productos en stock bajo.
              </p>
            )}
          </div>
          <div className="mb-3 mt-5 flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            Vencimientos
          </div>
          <div className="space-y-3">
            {dashboard.inventory.expiringOrExpired.length > 0 ? (
              dashboard.inventory.expiringOrExpired.map((item) => {
                const isExpired = item.alertas.vencimiento.estado === "vencido";
                const days = item.alertas.vencimiento.dias_para_vencer;
                const label = isExpired
                  ? `Vencido hace ${Math.abs(days ?? 0)} dias`
                  : days === 0
                    ? "Vence hoy"
                    : `Vence en ${days} dias`;

                return (
                  <div
                    key={item.id_producto}
                    className="flex flex-col items-stretch gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{item.nombre}</p>
                        <Badge variant="outline">{item.codigo}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.alertas.vencimiento.lotes_en_alerta} lotes en alerta
                      </p>
                    </div>
                    <Badge
                      className={`w-fit max-w-full shrink-0 whitespace-normal text-left text-white ${
                        isExpired
                          ? "bg-rose-600 hover:bg-rose-600"
                          : "bg-amber-600 hover:bg-amber-600"
                      }`}
                    >
                      {label}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No hay productos vencidos ni proximos a vencer.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="min-w-0 rounded-lg border bg-card p-3 shadow-sm sm:p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Ventas recientes</h2>
          <p className="text-sm text-muted-foreground">
            Hoy: {formatCurrency(dashboard.today.revenue)} en ingresos
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {dashboard.recentSales.length > 0 ? (
            dashboard.recentSales.map((sale) => (
              <div key={sale.id_venta} className="min-w-0 rounded-lg border p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge
                    variant={sale.estado === "Cerrada" ? "default" : "secondary"}
                  >
                    {sale.estado}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(sale.fecha_venta)}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {sale.cliente?.nombre || "Cliente no asignado"}
                </p>
                <p className="mt-1 text-lg font-semibold">{formatCurrency(sale.total)}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Todavia no hay ventas registradas.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
