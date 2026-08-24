import { APIRequestContext, expect } from '@playwright/test';

const apiBaseUrl = process.env.E2E_API_URL ?? 'http://localhost:4001/api';
const frontendOrigin = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

function apiUrl(path: string) {
  return `${apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function mutationHeaders() {
  return { Origin: frontendOrigin };
}

export async function createClosedSaleFixture(request: APIRequestContext) {
  const suffix = Date.now().toString(36);
  const code = suffix.slice(-4).toUpperCase();
  const clientName = `Cliente venta E2E ${suffix}`;

  const productResponse = await request.post(apiUrl('/products'), {
    headers: mutationHeaders(),
    multipart: {
      nombre: `Producto venta E2E ${suffix}`,
      codigo: code,
      precio_base_venta: '25000'
    }
  });
  expect(productResponse.ok()).toBe(true);
  const product = await productResponse.json();

  const clientResponse = await request.post(apiUrl('/clients'), {
    headers: mutationHeaders(),
    multipart: {
      nombre: clientName,
      cedula: `DOC-${suffix}`
    }
  });
  expect(clientResponse.ok()).toBe(true);
  const client = await clientResponse.json();

  const inventoryResponse = await request.post(apiUrl('/inventory/entries'), {
    headers: mutationHeaders(),
    data: {
      observacion: 'Inventario para E2E de ventas',
      detalles: [{
        id_producto: product.id_producto,
        cantidad_inicial: 4,
        costo_unitario_compra: 10000,
        numero_lote_fabricacion: `LOT-${suffix}`
      }]
    }
  });
  expect(inventoryResponse.ok()).toBe(true);

  const saleResponse = await request.post(apiUrl('/sales'), {
    headers: mutationHeaders(),
    data: {
      id_cliente: client.id_cliente,
      estado: 'Cerrada',
      detalles: [{
        id_producto: product.id_producto,
        cantidad: 1,
        precio_unitario: 25000,
        descuento_unitario: 0
      }]
    }
  });
  expect(saleResponse.ok()).toBe(true);
  const sale = await saleResponse.json();

  return {
    clientName,
    async cancel() {
      const response = await request.delete(apiUrl(`/sales/${sale.id_venta}`), {
        headers: mutationHeaders()
      });
      expect(response.ok()).toBe(true);
    }
  };
}
