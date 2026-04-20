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

## Pruebas E2E (Jest + Selenium)

Este proyecto incluye pruebas E2E en:

- `tests/loginE2E.test.ts`
- `tests/productsE2E.test.ts`

Las variables E2E se leen automaticamente desde `.env.e2e`.

Tambien existe la plantilla versionable `.env.e2e.example` para estandarizar configuracion en equipo y CI.

- `npm run test:e2e`: ejecuta los tests E2E de login y productos con variables de `.env.e2e`.
- `npm run test:e2e:auto`: levanta frontend y luego ejecuta el E2E automaticamente.

### Variables opcionales para login real

Si quieres probar autenticacion completa (no solo render del formulario), define:

- `E2E_EMAIL`
- `E2E_PASSWORD`
- `E2E_BASE_URL` (opcional, por defecto `http://localhost:3000`)

Por defecto ya existe `.env.e2e` con:

- `E2E_EMAIL=test@gmail.com`
- `E2E_PASSWORD=test1234`

Valores de referencia para el equipo:

- `E2E_BASE_URL=http://localhost:3000`
- `E2E_EMAIL=test@gmail.com`
- `E2E_PASSWORD=test1234`
- `E2E_STRICT_PRODUCTS=false`

`E2E_STRICT_PRODUCTS=true` activa una prueba estricta que intenta crear un producto y falla si el sistema redirige a login o no permite abrir el modulo de productos.

Ejemplo en PowerShell:

```powershell
$env:E2E_EMAIL="usuario@correo.com"
$env:E2E_PASSWORD="tu-clave"
npm run test:e2e:auto
```

Si no defines credenciales, el test de login real se omite y solo se valida que la pantalla de inicio de sesion renderiza correctamente.
