import express from 'express';   
import ProductManager from '../managers/products.manager.js';
const router = express.Router();

const products = new ProductManager;

app.get('/', async (req, res) => { 
    let allProducts = await products.getAllProducts();
    res.render('home',{ 
      products: allProducts
    });
  });


export default router;