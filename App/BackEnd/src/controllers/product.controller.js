import { ProductService } from '../services/product.service.js';
import { withStatus } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

function assignUploadedImageToBody(req) {
  const uploadedImageUrl = req.file
    ? (req.file.path || req.file.secure_url || req.file.url || null)
    : null;

  if (Array.isArray(req.body?.foto_avatar)) {
    req.body.foto_avatar = req.body.foto_avatar[0] ?? null;
  } else if (req.body?.foto_avatar && typeof req.body.foto_avatar === 'object') {
    req.body.foto_avatar =
      req.body.foto_avatar.path ||
      req.body.foto_avatar.secure_url ||
      req.body.foto_avatar.url ||
      null;
  }

  if (uploadedImageUrl) {
    req.body.foto_avatar = uploadedImageUrl;
  }
}

export const getProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getActiveProducts(req.user.id);
  return res.status(200).json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id, req.user.id);
    return res.status(200).json(product);
  } catch (error) {
    throw withStatus(error, error.message === 'Producto no encontrado' ? 404 : 500);
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const product = await ProductService.createProduct(req.body, req.user.id);
    return res.status(201).json(product);
  } catch (error) {
    throw withStatus(error, 400);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const product = await ProductService.updateProduct(req.params.id, req.body, req.user.id);
    return res.status(200).json(product);
  } catch (error) {
    throw withStatus(error, error.message === 'Producto no encontrado' ? 404 : 400);
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    throw withStatus(error, error.message === 'Producto no encontrado' ? 404 : 500);
  }
});
