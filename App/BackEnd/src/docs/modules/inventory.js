export const inventoryDocs = {
  tags: [{ name: 'Inventory', description: 'Ingresos y existencias de inventario por lote' }],
  paths: {
    '/inventory': {
      get: {
        tags: ['Inventory'],
        summary: 'Resumen consolidado de existencias',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Resumen de stock',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/InventorySummaryItem' }
                }
              }
            }
          }
        }
      }
    },
    '/inventory/entries': {
      get: {
        tags: ['Inventory'],
        summary: 'Listar ingresos de inventario',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Ingresos de inventario',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/InventoryEntry' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Inventory'],
        summary: 'Registrar ingreso de inventario',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateInventoryEntryRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Ingreso registrado' }
        }
      }
    },
    '/inventory/entries/{id}': {
      get: {
        tags: ['Inventory'],
        summary: 'Obtener ingreso de inventario por id',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Ingreso encontrado' }
        }
      },
      put: {
        tags: ['Inventory'],
        summary: 'Actualizar ingreso de inventario sin movimientos',
        description:
          'Permite editar solo ingresos cuyos lotes no hayan sido consumidos ni alterados por movimientos posteriores.',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateInventoryEntryRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Ingreso actualizado' },
          400: { description: 'Ingreso con movimientos o payload invalido' }
        }
      },
      delete: {
        tags: ['Inventory'],
        summary: 'Eliminar ingreso de inventario sin movimientos',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Ingreso eliminado' },
          400: { description: 'Ingreso con movimientos' }
        }
      }
    }
  }
};
