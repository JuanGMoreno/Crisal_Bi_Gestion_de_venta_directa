# 🧱 Checklist de Desarrollo Backend (Arquitectura por Capas)

Este checklist guía el desarrollo progresivo del backend aplicando buenas prácticas sin generar bloqueo ni sobrecarga técnica.

---

## 🥇 FASE 1: Estructura base del proyecto

- [✅] Crear estructura de carpetas:
  - [✅] controllers/
  - [✅] services/
  - [✅] repositories/
  - [✅] models/
  - [✅] routes/
  - [✅] middlewares/
  - [✅] utils/
  - [✅] config/

- [✅] Configurar servidor Express (app.js / index.js)
- [✅] Configurar conexión a base de datos
- [✅] Probar servidor con endpoint simple (GET /health)

---

## 🥈 FASE 2: CRUD básico por entidad (sin seguridad)

Por cada entidad (ej: Product, Batch, User):

### Repository
- [ ] Crear archivo `<entity>.repository.js`
- [ ] Implementar:
  - [ ] create()
  - [ ] findAll()
  - [ ] findById()
  - [ ] update()
  - [ ] delete()

### Service
- [ ] Crear archivo `<entity>.service.js`
- [ ] Implementar:
  - [ ] lógica de negocio básica
  - [ ] validaciones de negocio simples
  - [ ] lanzar errores con `throw Error`

### Controller
- [ ] Crear archivo `<entity>.controller.js`
- [ ] Implementar:
  - [ ] create
  - [ ] getAll
  - [ ] getById
  - [ ] update
  - [ ] delete

### Routes
- [ ] Crear archivo `<entity>.routes.js`
- [ ] Conectar controller con Express Router

### Pruebas
- [ ] Probar endpoints con Insomnia/Postman
- [ ] Verificar CRUD completo funcionando

---

## 🥉 FASE 3: Middleware de validación

- [ ] Crear `validation.middleware.js`
- [ ] Validar:
  - [ ] campos obligatorios
  - [ ] tipos de datos
  - [ ] formato correcto

- [ ] Aplicar middleware en rutas POST y PUT

---

## 🏅 FASE 4: Autenticación (JWT)

- [ ] Crear modelo User
- [ ] Crear user.repository.js
- [ ] Crear user.service.js
- [ ] Crear user.controller.js

- [ ] Implementar:
  - [ ] registro (register)
  - [ ] login
  - [ ] hash de contraseña (bcrypt)
  - [ ] generación de JWT

- [ ] Crear `auth.middleware.js`
- [ ] Proteger rutas privadas con authMiddleware

---

## 🏆 FASE 5: Autorización (roles/permisos) (si aplica)

- [ ] Definir roles (admin, user, etc.)
- [ ] Crear `role.middleware.js`
- [ ] Proteger rutas según rol

---

## ⚠️ FASE 6: Manejo global de errores

- [ ] Crear clase `AppError` en utils/
- [ ] Crear `asyncHandler.js`
- [ ] Crear `error.middleware.js`

- [ ] Implementar:
  - [ ] throw AppError en services
  - [ ] asyncHandler en controllers
  - [ ] error middleware global en app.js

---

## 🧹 FASE 7: Refactor y limpieza

- [ ] Quitar try/catch innecesarios
- [ ] Verificar que:
  - [ ] Controllers no tengan lógica de negocio
  - [ ] Services no usen req/res
  - [ ] Repositories solo accedan a BD

- [ ] Revisar nombres de archivos
- [ ] Revisar separación de responsabilidades

---

## 📚 FASE 8: Documentación

- [ ] Documentar arquitectura por capas
- [ ] Explicar:
  - [ ] Controllers
  - [ ] Services
  - [ ] Repositories
  - [ ] Middlewares
  - [ ] Manejo de errores

- [ ] Diagramar flujo de la aplicación
- [ ] Preparar sección para tesis

---

## 🎯 REGLAS DE ORO

- [ ] Nunca acceder a Models desde Controllers
- [ ] Nunca usar req/res en Services
- [ ] Nunca poner lógica de negocio en Repositories
- [ ] Siempre usar middlewares para validación y seguridad
- [ ] Implementar funcionalidades primero, seguridad después

---

## 🧠 FILOSOFÍA DE DESARROLLO

> "Primero hacer que funcione, luego hacerlo correcto y finalmente hacerlo seguro."

---

## 🏁 Estado del proyecto

- Fecha inicio: 28/02/26
- Fecha fin estimada: 28/03/26
- Estado actual: ____________
