import { ProductService } from '../services/product.service.js';

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

export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getActiveProducts(req.user.id);

    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos activos' });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id, req.user.id);
    return res.status(200).json(product);
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
    return res.status(statusCode).json({
      message: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const product = await ProductService.createProduct(req.body, req.user.id);
    return res.status(201).json(product);
  } catch (error) {
    console.error('Error en createProduct:', error);
    return res.status(400).json({
      message: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const product = await ProductService.updateProduct(req.params.id, req.body, req.user.id);
    return res.status(200).json(product);
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 400;
    return res.status(statusCode).json({
      message: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
    return res.status(statusCode).json({
      message: error.message
    });
  }
};
