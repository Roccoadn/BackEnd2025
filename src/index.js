import express from 'express';  
import productsRoutes from './routes/products.route.js';
import cartRoutes from './routes/cart.route.js';  

const app = express();

app.use (express.json());
app.use (express.urlencoded({extended: true}));
app.use (express.static('/public')); 
app.use ('/products/', productsRoutes);
app.use ('/cart/', cartRoutes);

app.listen(8080, () => {
  console.log('El servidor esta ONLINE en el puerto 8080');
}); 