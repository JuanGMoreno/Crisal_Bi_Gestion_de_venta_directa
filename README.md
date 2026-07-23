# Crisal | Sistema de Gestion Comercial

Crisal es una aplicacion web full stack para gestionar productos, clientes, inventario y ventas desde una operacion comercial autenticada. Centraliza procesos clave, mantiene sincronizacion entre ventas e inventario y ofrece trazabilidad para trabajar con datos claros.

El proyecto fue construido como una solucion real para cliente, con frontend moderno, API REST, base de datos relacional, autenticacion JWT, carga de imagenes y documentacion de endpoints.

---

## Funcionalidades principales

- Autenticacion de usuarios con JWT.
- Proteccion de rutas privadas en backend.
- Gestion de productos por distribuidor autenticado.
- Carga de imagenes de productos con Cloudinary.
- Gestion de clientes.
- Registro y consulta de entradas de inventario.
- Visualizacion de stock disponible por producto.
- Registro de ventas con multiples productos.
- Validacion de stock antes de cerrar una venta.
- Descuento automatico de inventario al cerrar ventas.
- Restablecimiento de stock al anular ventas.
- Tablas dinamicas, formularios validados y estados de carga/error.
- Documentacion de API con OpenAPI/Swagger.

---

## Stack tecnologico

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack React Query
- TanStack Table
- React Hook Form
- Zod
- Zustand
- Axios
- Radix UI
- Sonner
- Jest
- Playwright

### Backend

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- Cookie Parser
- CORS
- Multer
- Cloudinary
- Morgan
- Dotenv

---

## Arquitectura general

```bash
App/
├── BackEnd/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── docs/
│       ├── middleware/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── utils/
│
└── FrontEnd/
    └── <frontend-app>/
        └── src/
            ├── app/
            ├── features/
            └── shared/
```

El backend esta separado por capas: rutas, controladores, servicios, repositorios y modelos.
El frontend esta organizado por modulos funcionales usando una estructura basada en `features`.

---

## Modulos del sistema

### Productos

Permite crear, listar, actualizar y eliminar productos asociados al distribuidor autenticado. Incluye carga de imagenes mediante Cloudinary.

### Inventario

Permite registrar entradas de inventario, consultar historial y visualizar stock disponible por producto.

### Ventas

Permite registrar ventas con multiples productos, calcular totales, validar stock y actualizar automaticamente el inventario segun el estado de la venta.

### Clientes

Permite gestionar clientes y asociarlos opcionalmente a ventas.

### Autenticacion

Incluye registro, inicio de sesion, cierre de sesion y consulta del usuario autenticado.

---

## Instalacion y ejecucion local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd <carpeta-del-repositorio>
```

### 2. Configurar backend

```bash
cd App/BackEnd
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Luego ajustar los valores locales de PostgreSQL, JWT y Cloudinary en `.env`.

API disponible en:

```bash
http://localhost:4001/api
```

### 3. Configurar frontend

```bash
cd App/FrontEnd/<frontend-app>
npm install
cp .env.example .env.local
npm run dev
```

Variables principales del frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Aplicacion disponible en:

```bash
http://localhost:3000
```

---

## Scripts principales

### Backend

```bash
npm test
npm run db:migrate
npm run db:migrate:status
npm run db:migrate:undo
npm run dev
npm start
```

La estrategia de pruebas unitarias del backend, su cobertura actual y ejemplos para agregar nuevos casos estan documentados en [`App/BackEnd/TESTING.md`](App/BackEnd/TESTING.md).

### Frontend

```bash
npm run dev
npm run build
npm start
npm run lint
npm test
npm run test:e2e
```

---

## Documentacion de API

Con el backend en ejecucion, la documentacion esta disponible en:

```bash
http://localhost:4001/api/docs
```

Documento OpenAPI en JSON:

```bash
http://localhost:4001/api/docs/openapi.json
```

---

## SEO e identidad

- Marca publica: Crisal.
- Logo principal: mariposa morfo en `public/CrisalBi_logo_vertical_color.svg`.
- Hero publico del sistema: `public/crisal-hero.png`.
- Metadata global, Open Graph, Twitter Cards, manifest, robots y sitemap se gestionan desde `src/app`.
- Las rutas privadas bajo `/system/` quedan excluidas de indexacion.

---

## Aprendizajes y valor tecnico

Este proyecto permitio trabajar habilidades clave de desarrollo full stack:

- Diseno de API REST con Express.
- Modelado relacional con PostgreSQL y Sequelize.
- Autenticacion con JWT y cookies.
- Manejo de datos aislados por usuario/distribuidor.
- Integracion con Cloudinary para imagenes.
- Formularios complejos con React Hook Form y Zod.
- Estado asincrono con TanStack React Query.
- Tablas reutilizables con TanStack Table.
- Sincronizacion entre logica comercial e inventario.
- Manejo de estados de carga, error y vacio en UI.
- Documentacion de endpoints con OpenAPI/Swagger.

---

## Mejoras futuras

- Agregar Docker Compose para backend, frontend y PostgreSQL.
- Implementar CI/CD con GitHub Actions.
- Aumentar cobertura de pruebas.
- Ampliar roles y permisos.
- Mejorar dashboard con metricas comerciales.
- Incorporar reportes exportables.
- Mover configuracion del frontend a variables de entorno.

---

## Autor

**Juan Guillermo Moreno Galvez**  
Desarrollador Full Stack

---

## Estado del proyecto

Proyecto en desarrollo activo para una cliente real, enfocado en la gestion de productos, clientes, inventario y ventas.
