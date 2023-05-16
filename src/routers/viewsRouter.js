import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

let productManager = new ProductManager();

const viewsRouter = Router()

viewsRouter.get ('/', async (req, res) => {
    const productList = await productManager.getProducts();
    res.render('index', {productos: productList});
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const productList = await productManager.getProducts();
	res.render('realTimeProducts', {products: productList});
});

export default viewsRouter;