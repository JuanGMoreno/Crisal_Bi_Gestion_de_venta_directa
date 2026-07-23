import { authDocs } from './modules/auth.js';
import { clientsDocs } from './modules/clients.js';
import { distributorsDocs } from './modules/distributors.js';
import { healthDocs } from './modules/health.js';
import { inventoryDocs } from './modules/inventory.js';
import { productsDocs } from './modules/products.js';
import { salesDocs } from './modules/sales.js';
import { schemas } from './shared/schemas.js';

const apiBaseUrl =
  process.env.PUBLIC_API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

const docModules = [
  healthDocs,
  authDocs,
  productsDocs,
  inventoryDocs,
  clientsDocs,
  salesDocs,
  distributorsDocs
];

function mergeTags(modules) {
  return modules.flatMap((module) => module.tags || []);
}

function mergePaths(modules) {
  return Object.assign({}, ...modules.map((module) => module.paths || {}));
}

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Crisal Backend API',
    version: '1.0.0',
    description:
      'API para gestion de autenticacion, distribuidores, productos, inventario, clientes y ventas del sistema Crisal.'
  },
  servers: [
    {
      url: `${apiBaseUrl}/api`,
      description: 'Servidor principal'
    }
  ],
  tags: mergeTags(docModules),
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token'
      }
    },
    schemas
  },
  paths: mergePaths(docModules)
};

export function getSwaggerUiHtml(specUrl) {
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crisal API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #f5f7fb; }
      #swagger-ui { max-width: 1200px; margin: 0 auto; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.SwaggerUIBundle({
          url: '${specUrl}',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [window.SwaggerUIBundle.presets.apis],
          layout: 'BaseLayout'
        });
      };
    </script>
  </body>
</html>`;
}
