export const healthDocs = {
  tags: [{ name: 'Health', description: 'Verificacion basica del servicio' }],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Estado basico del backend',
        responses: {
          200: {
            description: 'Servicio disponible',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MessageResponse' }
              }
            }
          }
        }
      }
    }
  }
};
