import { Router } from "express";  
import { productManager } from "../managers/product.manager";

const route = Router(); 

router.delete('/:productId', async (req, res) => {
    try {
        const product = await productManager.deleteProduct(req.params.productId);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/', async (req, res) => {   
    try {
        await productManager.deleteAllProducts();
        res.status(200).json({ message: 'All products have been deleted' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put ('/:productId', async (req, res) => {
try {
    const product = await productManager.updateProduct(req.params.productId, req.body);
    res.status(200).json(product);
} catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.productId);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



export default route;