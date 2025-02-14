import { Router } from 'express';
import { productManager } from '../managers/products.manager.js';

const router = Router();

router.get('/', async (req, res) => {
  const products = await productManager.getAllProducts();
  res.render('products',{ products })
})

export default router;