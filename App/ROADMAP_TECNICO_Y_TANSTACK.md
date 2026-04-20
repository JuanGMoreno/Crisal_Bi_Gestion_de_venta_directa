# Roadmap Tecnico del Proyecto + Implementacion de TanStack Query

Fecha: 2026-04-04

## 1) Estado actual resumido

- Frontend: Next.js (App Router) + React 19 + TypeScript + Tailwind + shadcn/ui.
- Backend: Node.js + Express + Sequelize + PostgreSQL + JWT.
- Modulos avanzados: autenticacion y productos (parcialmente integrados).
- Modulos en progreso: clientes, inventario, ventas, dashboard.
- Deuda tecnica relevante: falta de pruebas automatizadas, endpoints no montados en app principal, y desalineacion de puertos entre frontend y backend.

## 2) Roadmap sugerido (4 semanas)

## Semana 1: Estabilizacion base (Backend + Contratos API)

Objetivo: dejar una base confiable para crecer sin retrabajo.

Entregables:
- Corregir servicios con riesgo runtime (imports ESM y referencias a repositorios inexistentes).
- Montar rutas faltantes en backend (`inventory` y `distributor`) y protegerlas con middleware donde aplique.
- Unificar configuracion de puertos y URL base por variables de entorno (`NEXT_PUBLIC_API_URL` en frontend).
- Definir formato estandar de errores de API (`status`, `message`, `details`).

Criterio de salida:
- Todos los endpoints clave responden consistentemente.
- Front y Back consumen la misma URL base sin hardcode.

## Semana 2: Implementacion funcional de modulos

Objetivo: pasar de placeholders a flujos reales.

Entregables:
- Inventario: listado y operaciones base.
- Clientes: CRUD base.
- Ventas: creacion de venta y lectura de historial.
- Conectar UI de cada modulo con servicios backend reales.

Criterio de salida:
- Cada modulo tiene al menos 1 flujo end-to-end funcionando en entorno local.

## Semana 3: Calidad y pruebas

Objetivo: reducir riesgo de regresiones.

Entregables:
- Pruebas backend (auth, products, reglas criticas).
- Pruebas frontend para formularios y flujos de autenticacion.
- Lint y typecheck como precondicion de merge.

Criterio de salida:
- Pipeline local de calidad ejecutable con un solo comando.
- Casos criticos cubiertos por pruebas.

## Semana 4: Seguridad, rendimiento y despliegue

Objetivo: preparar proyecto para entorno real.

Entregables:
- Revisar estrategia de token (migrar a cookie httpOnly en fase siguiente recomendada).
- Logging estructurado y manejo de errores centralizado.
- Preparar variables de entorno por ambiente.
- Checklist de release y despliegue inicial.

Criterio de salida:
- Proyecto con baseline de seguridad y operacion para pruebas con usuarios.

## 3) Implementacion de TanStack Query en Frontend

Nota: ya usas `@tanstack/react-table`, pero para control de datos remotos se recomienda `@tanstack/react-query`.

## 3.1 Paquetes a instalar

```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```

## 3.2 Estructura recomendada en tu proyecto

Ubicacion sugerida dentro de `src/shared`:

- `src/shared/lib/queryClient.ts`
- `src/shared/providers/query-provider.tsx`
- `src/shared/api/query-keys.ts`

Y por feature:

- `src/features/products/hooks/use-products-query.ts`
- `src/features/products/hooks/use-create-product-mutation.ts`

## 3.3 Crear QueryClient global

```ts
// src/shared/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

## 3.4 Crear provider

```tsx
// src/shared/providers/query-provider.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/shared/lib/queryClient";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 3.5 Integrar provider en layout raiz

En `src/app/layout.tsx`, envolver la app con `QueryProvider` (junto al `ThemeProvider`).

Ejemplo de orden recomendado:

```tsx
<QueryProvider>
  <ThemeProvider>
    {children}
  </ThemeProvider>
</QueryProvider>
```

## 3.6 Definir query keys centralizadas

```ts
// src/shared/api/query-keys.ts
export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: () => [...queryKeys.products.all, "list"] as const,
    detail: (id: string) => [...queryKeys.products.all, "detail", id] as const,
  },
  clients: {
    all: ["clients"] as const,
    list: () => [...queryKeys.clients.all, "list"] as const,
  },
  inventory: {
    all: ["inventory"] as const,
    list: () => [...queryKeys.inventory.all, "list"] as const,
  },
  sales: {
    all: ["sales"] as const,
    list: () => [...queryKeys.sales.all, "list"] as const,
  },
};
```

## 3.7 Hook de consulta (ejemplo productos)

```ts
// src/features/products/hooks/use-products-query.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import useProductServices from "@/features/products/services/productServices";

export function useProductsQuery() {
  const { getProducts } = useProductServices();

  return useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: getProducts,
  });
}
```

## 3.8 Hook de mutacion (crear producto)

```ts
// src/features/products/hooks/use-create-product-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import useProductServices from "@/features/products/services/productServices";
import type Product from "@/features/products/types/Product";

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  const { createProduct } = useProductServices();

  return useMutation({
    mutationFn: (payload: Omit<Product, "id_producto">) => createProduct(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.products.list() });
    },
  });
}
```

## 3.9 Uso en pagina de productos

- Reemplazar `useEffect + useState` por `useProductsQuery`.
- Usar estados de React Query: `isPending`, `isError`, `data`.
- Mantener `toast` para UX, pero disparar mensajes en `onSuccess` / `onError` de mutaciones.

## 3.10 Convenciones recomendadas

- Un hook de Query por caso de lectura.
- Un hook de Mutation por accion (create, update, delete).
- No duplicar estado remoto en `useState` salvo necesidades especificas de UI.
- Usar invalidaciones por `queryKey` despues de mutaciones.
- Mantener `services` como capa de transporte (axios) y `hooks` como capa de cache/sincronizacion.

## 4) Orden recomendado de adopcion de TanStack Query

1. Productos (porque ya esta integrado).
2. Inventario.
3. Clientes.
4. Ventas.
5. Dashboard (queries agregadas y paralelas).

## 5) Metricas de avance sugeridas

- Tiempo promedio de carga por modulo.
- Cantidad de llamadas duplicadas evitadas.
- Errores de red manejados sin romper UI.
- Cobertura de modulos conectados con Query/Muation hooks.

## 6) Riesgos y mitigaciones

- Riesgo: mezclar `useState` y React Query para la misma data.
  - Mitigacion: definir estandar de equipo para estado remoto.

- Riesgo: invalidaciones incompletas y UI desactualizada.
  - Mitigacion: centralizar `queryKeys` y documentar reglas por modulo.

- Riesgo: hardcode de URL base.
  - Mitigacion: `.env` por ambiente y wrapper http unico.

## 7) Resultado esperado al finalizar este roadmap

- Proyecto con base estable, modulos clave funcionales y estrategia de datos escalable en frontend.
- Menor acoplamiento, mejor mantenibilidad y menor probabilidad de regresiones.
