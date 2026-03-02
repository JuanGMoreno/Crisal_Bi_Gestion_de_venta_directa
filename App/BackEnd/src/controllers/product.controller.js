import ProductService from "../services/product.service.js";


export const getProducts = async (req, res) => {
    const result = await ProductService.getProducts(req.body);    
    res.json(result);
}