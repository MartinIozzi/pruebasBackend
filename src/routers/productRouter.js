import { Router } from "express";
import ProductManager from '../controllers/productManager.js'

let productManager = new ProductManager();

const productRouter = Router();

productRouter.get("/", async (req, res) => {
    try{
        let products = await productManager.getProducts()
        let type = req.query.type;
        let limit = req.query.limit;
        if(limit){
            res.send(await products.slice(0, limit));
            return;
        }
        /* if(!type || (type !== "pc" && type !== "phone" && type !== "celular" && type !== "computadora")) */
        if(!type || (type !== "pc" && type !== "phone" && type !== "celular" && type !== "computadora" /*ver esto que solo toma los tipos codeados y no los que se pasan por el req.body*/)) { 
            res.send(products)
        } else {
            let productsFilter = products.filter(element => element.type === type);
            res.send (productsFilter);
        }
    } catch(e){
		res.status(400).send({e});
    }
})

productRouter.get("/:pid" , async (req, res)=> {
    try {
        let products = await productManager.getProducts()
        let productID = products.find((element) => {
            return element.id == req.params.pid
        });
        res.send(productID);
    } catch (e){
		res.status(400).send({e});
    }
});

productRouter.post("/", async (req, res) => {
    try {
        let addedProduct = req.body;
        await productManager.pushProducts(addedProduct)
		res.status(201).send(await productManager.getProducts());
    } catch (e) {
		res.status(400).send({e});
    }
});

productRouter.put('/:pid', async (req, res) => {
    try {
        let id = parseInt(req.params.pid);
        let addedProduct = req.body;
        res.status(200).send(await productManager.updateProduct(id, addedProduct))
    } catch (e) {
		res.status(400).send({e});
    }
})

productRouter.delete('/:pid' , async (req, res) => {
    try { 
        let id = (req.params.pid);
        res.status(200).send(await productManager.deleteProduct(id))
    } catch (e) {
		res.status(400).send({e});
    }
})

export {productRouter};