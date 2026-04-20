export const clientsDocs = {
  tags: [{ name: 'Clients', description: 'Clientes compartidos para ventas' }],
  paths: {
    '/clients': {
      get: {
        tags: ['Clients'],
        summary: 'Listar clientes activos',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Listado de clientes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Client' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Clients'],
        summary: 'Crear cliente',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateClientRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Cliente creado' }
        }
      }
    },
    '/clients/{id}': {
      get: {
        tags: ['Clients'],
        summary: 'Obtener cliente por id',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Cliente encontrado' }
        }
      },
      put: {
        tags: ['Clients'],
        summary: 'Actualizar cliente',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Cliente actualizado' }
        }
      },
      delete: {
        tags: ['Clients'],
        summary: 'Eliminar cliente de forma logica',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Cliente eliminado' },
          400: { description: 'Cliente con ventas asociadas' }
        }
      }
    }
  }
};
