import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/config/database.js';
import { migrator } from '../../src/db/migrator.js';
import '../../src/models/index.js';

const FRONTEND_ORIGIN = process.env.FRONTEND_URL;

async function truncateApplicationTables() {
  const queryGenerator = sequelize.getQueryInterface().queryGenerator;
  const tableNames = Object.values(sequelize.models)
    .map((model) => model.getTableName())
    .filter((tableName) => tableName !== 'SequelizeMeta');
  const quotedTables = [...new Set(tableNames)]
    .map((tableName) => queryGenerator.quoteTable(tableName))
    .join(', ');

  await sequelize.query(`TRUNCATE TABLE ${quotedTables} RESTART IDENTITY CASCADE`);
}

describe('flujo comercial completo con PostgreSQL', () => {
  const agent = request.agent(app);

  beforeAll(async () => {
    await sequelize.authenticate();
    await migrator.up();
  });

  beforeEach(async () => {
    await truncateApplicationTables();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('crea inventario, cierra una venta y restaura el stock al anularla', async () => {
    const uniqueSuffix = Date.now().toString(36);
    const email = `mvp-${uniqueSuffix}@crisal.test`;
    const password = 'MvpSeguro123';

    const signupResponse = await agent
      .post('/api/auth/signup')
      .set('Origin', FRONTEND_ORIGIN)
      .send({
        nombre: 'Negocio de prueba MVP',
        correo: email,
        contraseña: password
      });

    expect(signupResponse.status).toBe(201);

    const signinResponse = await agent
      .post('/api/auth/signin')
      .set('Origin', FRONTEND_ORIGIN)
      .send({ correo: email, contraseña: password });

    expect(signinResponse.status).toBe(200);
    expect(signinResponse.headers['set-cookie']).toBeDefined();

    const productResponse = await agent
      .post('/api/products')
      .set('Origin', FRONTEND_ORIGIN)
      .field('nombre', 'Producto integración')
      .field('codigo', 'T001')
      .field('precio_base_venta', '25.50');

    expect(productResponse.status).toBe(201);
    const productId = productResponse.body.id_producto;

    const clientResponse = await agent
      .post('/api/clients')
      .set('Origin', FRONTEND_ORIGIN)
      .field('nombre', 'Cliente integración')
      .field('cedula', `CI-${uniqueSuffix}`);

    expect(clientResponse.status).toBe(201);
    const clientId = clientResponse.body.id_cliente;

    const inventoryResponse = await agent
      .post('/api/inventory/entries')
      .set('Origin', FRONTEND_ORIGIN)
      .send({
        observacion: 'Ingreso de prueba integral',
        detalles: [{
          id_producto: productId,
          cantidad_inicial: 5,
          costo_unitario_compra: 10,
          numero_lote_fabricacion: `LOT-${uniqueSuffix}`
        }]
      });

    expect(inventoryResponse.status).toBe(201);

    const saleResponse = await agent
      .post('/api/sales')
      .set('Origin', FRONTEND_ORIGIN)
      .send({
        id_cliente: clientId,
        estado: 'Cerrada',
        detalles: [{
          id_producto: productId,
          cantidad: 2,
          precio_unitario: 25.5,
          descuento_unitario: 0
        }]
      });

    expect(saleResponse.status).toBe(201);
    const saleId = saleResponse.body.id_venta;

    const stockAfterSale = await agent.get('/api/inventory');
    expect(stockAfterSale.status).toBe(200);
    expect(stockAfterSale.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id_producto: productId, stock_total: 3 })
      ])
    );

    const cancelResponse = await agent
      .delete(`/api/sales/${saleId}`)
      .set('Origin', FRONTEND_ORIGIN);

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.sale.estado).toBe('Anulada');

    const stockAfterCancellation = await agent.get('/api/inventory');
    expect(stockAfterCancellation.status).toBe(200);
    expect(stockAfterCancellation.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id_producto: productId, stock_total: 5 })
      ])
    );
  });
});
