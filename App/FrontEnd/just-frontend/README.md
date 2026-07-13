This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Pruebas E2E (Playwright)

Este proyecto usa Playwright para automatizar Chromium con contextos aislados por prueba,
esperas automaticas y artefactos de diagnostico cuando ocurre un fallo.

Las pruebas se encuentran en:

- `e2e/auth.spec.ts`
- `e2e/products.spec.ts`
- `e2e/inventory.spec.ts`

Instalar Chromium administrado por Playwright una vez:

```bash
npx playwright install chromium
```

Crear `.env.e2e` desde `.env.e2e.example` y ajustar credenciales de una usuaria
existente en el backend local.

Ejecutar todas las pruebas:

```bash
npm run test:e2e
```

Ejecutar solamente casos publicos que no necesitan backend:

```bash
npm run test:e2e:public
```

Estos casos simulan una respuesta `401` de `/auth/me` para representar una visita sin
sesion activa. Los flujos autenticados no usan esa simulacion.

Abrir la interfaz visual de Playwright:

```bash
npm run test:e2e:ui
```

Playwright inicia el frontend automaticamente. Los flujos autenticados requieren que
backend y PostgreSQL esten levantados previamente:

```bash
cd ../../BackEnd
npm run dev
```

Cobertura actual:

- Render del formulario de login.
- Redireccion de rutas protegidas sin sesion.
- Login real y carga del sistema protegido.
- Acceso autenticado al modulo de productos.
- Creacion de producto desde el modal.
- Registro de un ingreso de inventario para un producto nuevo.

Si faltan `E2E_EMAIL` o `E2E_PASSWORD`, Playwright omite los flujos autenticados y
mantiene activos los casos publicos. Si las variables existen pero backend no esta
disponible o las credenciales son incorrectas, la suite falla de forma visible.
