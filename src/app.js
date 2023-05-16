import express from "express";
import { productRouter } from "./routers/productRouter.js";
import { cartRouter } from "./routers/cartRouter.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routers/viewsRouter.js"
import { Server } from "socket.io";

const app = express();

app.use(express.static('public/'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');

app.use('/', viewsRouter);

app.use('/api/products', productRouter);

app.use('/api/carts', cartRouter);

const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Listening Port: ${port}`)});

const socketServer = new Server(httpServer); //servidor para trabajar con sockets.

socketServer.on ('connection', (socket) => {
    console.log("Nuevo cliente conectado");
});