import express from 'express';  
import path from 'path';  
import __dirname from './utils.js';
import productsRoutes from './routes/products.route.js';
import cartRoutes from './routes/cart.route.js';  
import viewsRouter from './routes/views.route.js';
 
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

const app = express();
const http = app.listen(8080, () => {console.log('El servidor esta ONLINE en el puerto 8080');}); 
const webSocketServer = new Server(http);


app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname + '/views'));
app.use('/',viewsRouter);
app.use (express.json());
app.use (express.urlencoded({extended: true}));
app.use (express.static(__dirname + '/public')); 

webSocketServer.on('connection', (socket) => {  
  console.log('Un cliente se ha conectado');
});  

app.use ('/api/products/', productsRoutes);
app.use ('/api/cart/', cartRoutes);
