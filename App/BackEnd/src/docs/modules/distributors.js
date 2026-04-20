export const distributorsDocs = {
  tags: [{ name: 'Distributors', description: 'Gestion de distribuidores' }],
  paths: {
    '/distributors': {
      get: {
        tags: ['Distributors'],
        summary: 'Listar distribuidores activos',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Listado de distribuidores',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Distributor' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Distributors'],
        summary: 'Crear distribuidor',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDistributorRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Distribuidor creado' }
        }
      }
    },
    '/distributors/{id}': {
      get: {
        tags: ['Distributors'],
        summary: 'Obtener distribuidor por id',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Distribuidor encontrado' },
          404: { description: 'Distribuidor no encontrado' }
        }
      },
      put: {
        tags: ['Distributors'],
        summary: 'Actualizar distribuidor',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDistributorRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Distribuidor actualizado' }
        }
      },
      delete: {
        tags: ['Distributors'],
        summary: 'Eliminar distribuidor de forma logica',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Distribuidor eliminado' }
        }
      }
    }
  }
};
