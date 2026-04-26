import { SaleService } from '../services/sale.service.js';

export const getSales = async (req, res) => {
  try {
    const sales = await SaleService.getSales(req.user.id);

    if (sales.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ventas' });
    }

    return res.status(200).json(sales);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener ventas',
      error: error.message
    });
  }
};

export const getSale = async (req, res) => {
  try {
    const sale = await SaleService.getSaleById(req.params.id, req.user.id);
    return res.status(200).json(sale);
  } catch (error) {
    const statusCode = error.message === 'Venta no encontrada' ? 404 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};

export const createSale = async (req, res) => {
  try {
    const sale = await SaleService.createSale(req.body, req.user.id);
    return res.status(201).json(sale);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateSale = async (req, res) => {
  try {
    const sale = await SaleService.updateSale(req.params.id, req.body, req.user.id);
    return res.status(200).json(sale);
  } catch (error) {
    const statusCode = error.message === 'Venta no encontrada' ? 404 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};

export const updateSaleStatus = async (req, res) => {
  try {
    const sale = await SaleService.updateSaleStatus(req.params.id, req.body.estado, req.user.id);
    return res.status(200).json(sale);
  } catch (error) {
    const statusCode = error.message === 'Venta no encontrada' ? 404 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const result = await SaleService.cancelSale(req.params.id, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === 'Venta no encontrada' ? 404 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};
