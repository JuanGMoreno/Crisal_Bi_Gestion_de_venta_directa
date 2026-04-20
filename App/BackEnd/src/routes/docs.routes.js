import { Router } from 'express';
import { getSwaggerUiHtml, openApiDocument } from '../docs/openapi.js';

const router = Router();

router.get('/docs/openapi.json', (_req, res) => {
  res.json(openApiDocument);
});

router.get('/docs', (req, res) => {
  const specUrl = `${req.protocol}://${req.get('host')}/api/docs/openapi.json`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(getSwaggerUiHtml(specUrl));
});

export default router;
