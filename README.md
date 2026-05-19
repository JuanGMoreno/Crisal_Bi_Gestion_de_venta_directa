# Sistema de Gestión de Información Just

Sistema web full stack desarrollado para gestionar productos, clientes, inventario y ventas de una distribuidora. La aplicación centraliza procesos operativos clave, permite trabajar con usuarios autenticados y mantiene sincronización entre ventas e inventario.

El proyecto fue construido como una solución real para cliente, con frontend moderno, API REST, base de datos relacional, autenticación JWT, carga de imágenes y documentación de endpoints.

---

## Funcionalidades principales

- Autenticación de usuarios con JWT.
- Protección de rutas privadas en backend.
- Gestión de productos por distribuidor autenticado.
- Carga de imágenes de productos con Cloudinary.
- Gestión de clientes.
- Registro y consulta de entradas de inventario.
- Visualización de stock disponible por producto.
- Registro de ventas con múltiples productos.
- Validación de stock antes de cerrar una venta.
- Descuento automático de inventario al cerrar ventas.
- Restablecimiento de stock al anular ventas.
- Tablas dinámicas, formularios validados y estados de carga/error.
- Documentación de API con OpenAPI/Swagger.

---

## Stack tecnológico

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
- Selenium WebDriver

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
    └── just-frontend/
        └── src/
            ├── app/
            ├── features/
            └── shared/
```

El backend está separado por capas: rutas, controladores, servicios, repositorios y modelos.  
El frontend está organizado por módulos funcionales usando una estructura basada en `features`.

---

## Módulos del sistema

### Productos

Permite crear, listar, actualizar y eliminar productos asociados al distribuidor autenticado. Incluye carga de imágenes mediante Cloudinary.

### Inventario

Permite registrar entradas de inventario, consultar historial y visualizar stock disponible por producto.

### Ventas

Permite registrar ventas con múltiples productos, calcular totales, validar stock y actualizar automáticamente el inventario según el estado de la venta.

### Clientes

Permite gestionar clientes y asociarlos opcionalmente a ventas.

### Autenticación

Incluye registro, inicio de sesión, cierre de sesión y consulta del usuario autenticado.

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanGMoreno/Sistema-de-gestion-de-Informacion-Just.git
cd Sistema-de-gestion-de-Informacion-Just
```

---

### 2. Configurar backend

```bash
cd App/BackEnd
npm install
```

Crear un archivo `.env` a partir de la plantilla versionada:

```bash
cp .env.example .env
```

Luego ajustar los valores locales de PostgreSQL, JWT y Cloudinary en `.env`.

Ejecutar backend:

```bash
npm run dev
```

API disponible en:

```bash
http://localhost:4001/api
```

---

### 3. Configurar frontend

```bash
cd App/FrontEnd/just-frontend
npm install
cp .env.example .env.local
npm run dev
```

La variable principal del frontend es:

```env
NEXT_PUBLIC_API_URL=http://localhost:4001/api
```

Aplicación disponible en:

```bash
http://localhost:3000
```

---

## Scripts principales

### Backend

```bash
npm run dev
npm start
```

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

## Documentación de API

Con el backend en ejecución, la documentación está disponible en:

```bash
http://localhost:4001/api/docs
```

Documento OpenAPI en JSON:

```bash
http://localhost:4001/api/docs/openapi.json
```

---

## Aprendizajes y valor técnico

Este proyecto permitió trabajar habilidades clave de desarrollo full stack:

- Diseño de API REST con Express.
- Modelado relacional con PostgreSQL y Sequelize.
- Autenticación con JWT y cookies.
- Manejo de datos aislados por usuario/distribuidor.
- Integración con Cloudinary para imágenes.
- Formularios complejos con React Hook Form y Zod.
- Estado asíncrono con TanStack React Query.
- Tablas reutilizables con TanStack Table.
- Sincronización entre lógica comercial e inventario.
- Manejo de estados de carga, error y vacío en UI.
- Documentación de endpoints con OpenAPI/Swagger.

---

## Mejoras futuras

- Agregar Docker Compose para backend, frontend y PostgreSQL.
- Implementar CI/CD con GitHub Actions.
- Aumentar cobertura de pruebas.
- Agregar roles y permisos.
- Mejorar dashboard con métricas comerciales.
- Incorporar reportes exportables.
- Mover configuración del frontend a variables de entorno.

---

## Autor

**Juan Guillermo Moreno Gálvez**  
Desarrollador Full Stack

- GitHub: [JuanGMoreno](https://github.com/JuanGMoreno)
- Repositorio: [Sistema de Gestión de Información Just](https://github.com/JuanGMoreno/Sistema-de-gestion-de-Informacion-Just)

---

## Estado del proyecto

Proyecto en desarrollo activo para una cliente real, enfocado en la gestión de productos, clientes, inventario y ventas.
