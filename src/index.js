import express from 'express';  
import path from 'path';  
import __dirname from './utils.js';
import productsRoutes from './routes/products.route.js';
import cartsRoutes from './routes/carts.route.js';
import viewsRouter from './routes/views.route.js';
import handlebars from 'express-handlebars';
import mongoConnection  from './connections/mongo.js';

const app = express();

app.use (express.static(__dirname + '/public')); 
app.use (express.json());
app.use (express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname + '/views'));
app.use ('/', viewsRouter);
app.use ('/api/products/', productsRoutes);
app.use ('/api/carts/', cartsRoutes);

mongoConnection()

app.listen(8080, () => {console.log('El servidor esta ONLINE en el puerto 8080');}); 
