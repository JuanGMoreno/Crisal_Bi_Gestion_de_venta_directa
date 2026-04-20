export const productsDocs = {
  tags: [{ name: 'Products', description: 'Catalogo de productos del distribuidor autenticado' }],
  paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Listar productos activos del distribuidor',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Listado de productos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Crear producto',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['nombre', 'codigo', 'precio_base_venta', 'categoria'],
                properties: {
                  nombre: { type: 'string' },
                  descripcion: { type: 'string' },
                  codigo: { type: 'string' },
                  precio_base_venta: { type: 'number' },
                  categoria: { type: 'string' },
                  estado: { type: 'string' },
                  foto_avatar: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Producto creado' }
        }
      }
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Obtener producto por id',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Producto encontrado' },
          404: { description: 'Producto no encontrado' }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Actualizar producto',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Producto actualizado' }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Eliminar producto de forma logica',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Producto eliminado' }
        }
      }
    }
  }
};
