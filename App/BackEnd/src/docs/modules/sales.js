export const salesDocs = {
  tags: [{ name: 'Sales', description: 'Ventas con consumo de stock' }],
  paths: {
    '/sales': {
      get: {
        tags: ['Sales'],
        summary: 'Listar ventas del distribuidor autenticado',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Listado de ventas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Sale' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Sales'],
        summary: 'Crear venta',
        description:
          'Si la venta se crea como Cerrada, el sistema consume stock usando prioridad FEFO (primero vence, primero sale).',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSaleRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Venta creada' },
          400: { description: 'Stock insuficiente o payload invalido' }
        }
      }
    },
    '/sales/{id}': {
      get: {
        tags: ['Sales'],
        summary: 'Obtener venta por id',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Venta encontrada' }
        }
      },
      delete: {
        tags: ['Sales'],
        summary: 'Anular venta',
        description: 'Si la venta estaba Cerrada, restaura el stock a los lotes consumidos.',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Venta anulada' }
        }
      }
    },
    '/sales/{id}/status': {
      patch: {
        tags: ['Sales'],
        summary: 'Cambiar estado de una venta',
        description:
          'Permite cerrar una venta Abierta o anular una venta Abierta/Cerrada. No permite reabrir ventas anuladas.',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateSaleStatusRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Estado actualizado' },
          400: { description: 'Transicion no permitida' }
        }
      }
    }
  }
};
