# Pruebas automatizadas del backend

## Objetivo

La suite protege reglas de negocio criticas sin depender de una base de datos local.
Usa Jest, la misma herramienta de testing configurada en el frontend.

Ejecutar todas las pruebas:

```bash
npm test
```

## Metodologia usada

Las pruebas actuales son **unitarias de servicios**. Cada caso ejecuta una pieza de
logica real y reemplaza temporalmente sus dependencias externas por mocks.

Ejemplo conceptual:

```js
mocks.replace(ProductRepository, 'findAll', async () => [
  { id_producto: 'product-1' }
]);

const products = await ProductService.getActiveProducts('user-1');

expect(products).toHaveLength(1);
```

Esto permite comprobar reglas con datos pequenos y predecibles:

- No se levanta PostgreSQL.
- No se modifica informacion real.
- Cada prueba restaura sus mocks al terminar.
- Los errores indican con precision que regla dejo de cumplirse.

## Herramientas

- `jest`: runner, organizacion de suites y validaciones mediante matchers.
- `tests/helpers/mock.js`: reemplazo temporal y restauracion de metodos.
- `tests/setup.js`: variables ficticias necesarias para importar Sequelize sin conectarse.

Jest se encuentra instalado como dependencia de desarrollo del backend.

Como el backend usa modulos ESM, el script ejecuta Jest mediante:

```bash
node --experimental-vm-modules ./node_modules/jest/bin/jest.js --runInBand
```

`--runInBand` ejecuta las suites de forma secuencial. Esto facilita comprender la
salida y evita interferencias entre mocks compartidos mientras la suite es pequena.

## Estructura

```text
tests/
  helpers/
    mock.js
  setup.js
  auth.middleware.test.js
  auth.service.test.js
  distributor.service.test.js
  inventory.service.test.js
  product.service.test.js
  sale.service.test.js
```

## Cobertura funcional actual

### Autenticacion

- Registro atomico de usuario y distribuidor.
- Rechazo de correo duplicado.
- Inicio de sesion valido e invalido.
- Sesion protegida con JWT.
- Respuesta de `/auth/me`.

### Productos

- Listado aislado por distribuidor.
- Creacion con categoria por defecto.
- Rechazo de codigo duplicado.
- Actualizacion y soft delete limitados al distribuidor autenticado.

### Inventario

- Listado aislado por distribuidor.
- Creacion transaccional con detalles normalizados.
- Rechazo de productos ajenos.
- Bloqueo de eliminacion cuando ya existen movimientos.

### Ventas

- Descuento de stock FEFO al cerrar venta.
- Registro del consumo exacto por lote.
- Rechazo por stock insuficiente.
- Restauracion de stock al anular venta.

### Jerarquia

- Vinculacion mediante codigo vigente.
- Rechazo de codigo vencido.
- Rechazo de jerarquias invalidas.
- Bloqueo de cambios de rol incompatibles con hijos existentes.

## Como agregar una prueba

Usar la estructura Arrange, Act, Assert:

```js
test('describe el comportamiento esperado', async () => {
  // Arrange: preparar datos y mocks.
  mocks.replace(Repository, 'method', async () => expectedData);

  // Act: ejecutar la funcion real.
  const result = await Service.method();

  // Assert: verificar el resultado.
  expect(result.value).toBe(expectedValue);
});
```

Para errores esperados:

```js
await expect(Service.method()).rejects.toThrow(/Texto esperado del error/);
```

## Siguiente nivel de pruebas

Estas pruebas no reemplazan pruebas de integracion. Como evolucion futura conviene:

1. Preparar una base PostgreSQL exclusiva para testing.
2. Ejecutar migraciones antes de la suite.
3. Probar endpoints HTTP completos con una herramienta como Supertest.
4. Mantener las pruebas unitarias actuales porque son rapidas y localizan fallos con claridad.
