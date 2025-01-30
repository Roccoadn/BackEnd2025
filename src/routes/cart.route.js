import { Router } from "express";  
import { cartManager } from "../managers/cart.manager"; 

const route = Router(); 

router.post('/', async (req, res) => {
    try {
        res.json(await cartManager.createCart());
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get ('/:cartId', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found, try again.' });
        } else {
            res.json(cart);
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cartId/products/:productId', async (req, res) => {
    try {
        res.json(await cartManager.saveProdToCart(req.params.cartId, req.params.productId));
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default route;