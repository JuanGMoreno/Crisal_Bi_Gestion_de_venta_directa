import { ProductService } from '../services/product.service.js';

/**
 * Obtener todos los productos activos
 */
export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getActiveProducts(req.user.id);
    if (products.length === 0) {
      res.status(404).json({ message: 'No se encontraron productos activos' });
    } else {
    res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener productos', 
      error: error.message 
    });
  }
};

/**
 * Obtener un producto por ID
 */
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getProductById(id, req.user.id);
    res.status(200).json(product);
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
    res.status(statusCode).json({ 
      message: error.message 
    });
  }
};

/**
 * Crear un nuevo producto
 */
export const createProduct = async (req, res) => {
  // Manejo de la imagen cargada y asignación de la URL al campo foto_avatar
  let urlImage = req.file ? (req.file.path || req.file.secure_url || req.file.url || null) : null;
  console.log('Archivo recibido en createProduct:', req.file);
  console.log('URL de la imagen cargada:', urlImage);
  if (Array.isArray(req.body?.foto_avatar)) {
    req.body.foto_avatar = req.body.foto_avatar[0] ?? null;
  } else if (req.body?.foto_avatar && typeof req.body.foto_avatar === 'object') {
    req.body.foto_avatar = req.body.foto_avatar.path || req.body.foto_avatar.secure_url || req.body.foto_avatar.url || null;
  }
  if (urlImage) {
    req.body.foto_avatar = urlImage;
  }
  try {
    const product = await ProductService.createProduct(req.body, req.user.id);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(400).json({ 
      message: error.message 
    });
  }
};

/**
 * Actualizar un producto existente
 */
export const updateProduct = async (req, res) => {
  let urlImage = req.file ? (req.file.path || req.file.secure_url || req.file.url || null) : null;
  console.log('Archivo recibido en updateProduct:', req.file);
  console.log('URL de la imagen cargada:', urlImage);
  if (Array.isArray(req.body?.foto_avatar)) {
    req.body.foto_avatar = req.body.foto_avatar[0] ?? null;
  } else if (req.body?.foto_avatar && typeof req.body.foto_avatar === 'object') {
    req.body.foto_avatar = req.body.foto_avatar.path || req.body.foto_avatar.secure_url || req.body.foto_avatar.url || null;
  }
  if (urlImage) {
    req.body.foto_avatar = urlImage;
  }
  try {
    const { id } = req.params;
    const product = await ProductService.updateProduct(id, req.body, req.user.id);
    res.status(200).json(product);
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 400;
    res.status(statusCode).json({ 
      message: error.message 
    });
  }
};

/**
 * Eliminar un producto (soft delete)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductService.deleteProduct(id, req.user.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
    res.status(statusCode).json({ 
      message: error.message 
    });
  }
};
