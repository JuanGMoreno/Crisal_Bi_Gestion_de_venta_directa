# Reglas de negocio de Crisal

Crisal es un sistema genérico para personas y pequeños negocios de venta directa. No depende del catálogo, la jerarquía ni el plan comercial de una empresa específica.

## Cuentas

- Las cuentas se crean públicamente desde el formulario de registro.
- Cada usuario tiene un único perfil de negocio asociado.
- La creación del usuario y su perfil ocurre en una misma transacción: si una operación falla, no se persiste ninguna.
- Los datos de productos, clientes, inventario y ventas están aislados por negocio.
- La primera versión no incluye roles comerciales, líderes, descendencia ni códigos de referido.

## Productos

- Cada código de producto es único dentro de un negocio, pero puede repetirse en negocios diferentes.
- La categoría es opcional y admite cualquier texto de hasta 80 caracteres.
- No existen categorías predeterminadas ni vinculadas a una marca.
- Los productos se eliminan de forma lógica para preservar el historial comercial.

## Inventario y ventas

- El inventario se controla por entradas y lotes.
- Las ventas cerradas consumen existencias con estrategia FEFO: primero vence, primero sale.
- Una venta no puede cerrarse si no hay existencias suficientes.
- Al anular una venta cerrada, las unidades vuelven a los lotes originales.
- Las entradas con movimientos posteriores no pueden editarse ni eliminarse.
