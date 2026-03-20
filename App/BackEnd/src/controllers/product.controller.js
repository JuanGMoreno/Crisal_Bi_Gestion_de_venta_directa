import { ProductService } from '../services/product.service.js';

/**
 * Obtener todos los productos activos
 */
export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getActiveProducts();
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
    const product = await ProductService.getProductById(id);
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
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ 
      message: error.message 
    });
  }
};

/**
 * Actualizar un producto existente
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.updateProduct(id, req.body);
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
    const result = await ProductService.deleteProduct(id);
    res.json(result);
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
    res.status(statusCode).json({ 
      message: error.message 
    });
  }
};
