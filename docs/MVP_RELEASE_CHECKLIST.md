# Checklist de salida del MVP de Crisal

## 1. Entorno y secretos

- Usar PostgreSQL administrado con copias de seguridad automáticas.
- Generar un `JWT_SECRET` aleatorio y exclusivo para producción.
- Configurar `NODE_ENV=production`.
- Configurar `FRONTEND_URL` o `FRONTEND_URLS` con orígenes HTTPS exactos.
- Configurar credenciales de Cloudinary y SMTP fuera del repositorio.
- Mantener frontend y API bajo el mismo sitio cuando sea posible.

## 2. Base de datos

- Crear una copia de seguridad antes de cada despliegue con migraciones.
- Ejecutar `npm run db:migrate` antes de iniciar la nueva versión del backend.
- Confirmar `npm run db:migrate:status` sin migraciones pendientes.
- Probar periódicamente que una copia de seguridad puede restaurarse.
- Usar únicamente los comandos `db:migrate`, `db:migrate:status` y `db:migrate:undo`.

El backend se niega a iniciar en producción si detecta migraciones pendientes.

## 3. Validación automática

```bash
cd App/BackEnd
npm ci
npm test
npm run test:integration

cd ../FrontEnd/just-frontend
npm ci
npm run lint
npm test -- --runInBand
npm run build
npm run test:e2e:public
```

Las pruebas de integración requieren un `DB_NAME` que contenga `test`. Las pruebas E2E
autenticadas también deben apuntar a una cuenta y una base desechables.

## 4. Comprobación manual previa

- Registrar una cuenta nueva e iniciar y cerrar sesión.
- Crear y editar un producto con y sin categoría.
- Comprobar el mensaje de código de producto duplicado.
- Crear un cliente.
- Registrar un ingreso de inventario.
- Cerrar una venta y confirmar la reducción de stock.
- Anular la venta y confirmar la restauración del stock.
- Actualizar el perfil del negocio.
- Comprobar `/api/health` y `/api/docs` por HTTPS.

## 5. Operación

- Configurar alertas por respuesta `5xx`, caída del proceso y fallo de `/api/health`.
- Conservar logs sin cookies, tokens, contraseñas ni cuerpos sensibles.
- Revisar periódicamente `npm audit` y actualizar dependencias.
- Mantener vigilado el aviso de Multer mientras no exista una versión correctiva; los límites
  de archivo, partes, campos, MIME y solicitudes reducen su superficie de denegación de servicio.
- Documentar quién puede restaurar la base y cómo contactar soporte.
- Desplegar primero a un entorno de prueba y después a producción.

## 6. Retroceso

- Conservar la imagen o versión anterior del frontend y backend.
- Ante un fallo de datos, detener escrituras y restaurar la copia previa al despliegue.
- Las migraciones que eliminan el dominio jerárquico no recrean datos históricos al revertirse;
  por eso la copia de seguridad previa es obligatoria.
