import express from 'express';  
import path from 'path';  
import __dirname from './utils.js';
import productsRoutes from './routes/products.route.js';
import viewsRouter from './routes/views.route.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

const app = express();
const http = app.listen(8080, () => {console.log('El servidor esta ONLINE en el puerto 8080');}); 
const webSocketServer = new Server(http);

app.use (express.static(__dirname + '/public')); 
app.use (express.json());
app.use (express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname + '/views'));
app.use('/',viewsRouter);

app.use ('/', viewsRouter);
app.use ('/api/products/', productsRoutes);

webSocketServer.on('connection', (socket) => {
  console.log('Nuevo dispositivo conectado!, se conecto ->', socket.id)
  socket.on('mensaje', (data)=>{
      console.log('El cliente, con id ->', socket.id, 'Envia dicha data = ',data)
      socket.emit('mensaje',{mensaje: 'Buenas cliente te devuelvo el saludo'})
  })

  socket.on('mensaje-a-los-demas',(data) => {
      socket.broadcast.emit('saludos-a-todos', data)
  })

  webSocketServer.emit('bienvenida','Bienvenidos a todos los clientes!')
})
