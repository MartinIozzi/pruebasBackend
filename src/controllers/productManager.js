import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = ('./src/models/products.json');
        this.id = 0;
        this.products = []   //Creé este array y lo pushee a la constante, creada abajo, readID. 
        //hacer un getproducts al inicio para no estar a cada rato creando una variable.
        
        //Creo este código para que si no existe nada en el JSON cree igual lo que vendria siendo el array donde contendría los productos.
        if (!(fs.existsSync(this.path))) {
            fs.writeFileSync(
                this.path,
                JSON.stringify([]))
        }else{
            this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        let index = this.products.length - 1   //detecta el ultimo index y asigna la id del mismo.
        if(index >= 0){
            this.id = this.products[index].id
        }
    }
    //Creo el parse en donde los productos del JSON se quedan para poder utilizarlo en las funciones de mas adelante.
    async getProducts(){
        try {
            const actualProducts = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(actualProducts);
        } catch (e) { 
            console.log(e);
        }
    };

    //Se agregan los productos, los cuales son aclarados abajo, al array de productos creado en el código de this.path.
    async addProduct(product) {
        try {
            let products = await this.getProducts()
            //Esto verifica que el código específico del producto (ejemplo: "abc123"), no se repita mas de una vez, en tal caso, saltaría el error.
            if(products.find(element => element.code == product.code) != undefined){
                return console.log('Error al agregar producto: Ya existe el código "' + product.code + '"')
            }

            //Creo esta variable para poder crear la id, y que, al momento de crearla, se pushee a la lista del array del JSON
            // **ACLARACIÓN: El "this.products" está creado arriba en el constructor, y se pushea mas adelante a la lista del array para poder asi, poder pushear directamente a la lista creada del array en el JSON.
            this.id++;
            product.id = this.id.toString(); 
            products.push(product);

            this.pushProducts(products);

        } catch (err) {
            console.log(err);
        }
    }

    async pushProducts(products, addedProduct){
        try {
            this.addProduct(addedProduct)
            await fs.promises.writeFile(this.path,
                JSON.stringify(products))
        } catch (e) {
            console.log(e);
        }   
    }   

    //Este metodo, seleccionaría una id, escrita al final del código, la cual permita filtrar por ID los productos.
    async getProductByID(id){
        try {
            const actualProducts = await this.getProducts()
            return actualProducts.find(element => element.id == id)
        } catch (e) {
            console.log(e);
        }

    }
    
    //Este metodo permite leer el codigo, del array que contiene la lista de los productos.

    readCodes(){
        try {
            let readCode = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            return readCode;
        } catch (e) {
            console.log(e);  
        }

    }

    //Este metodo, permite, seleccionando la ID del producto, poder sobreescribir los datos de uno seleccionado.
    async updateProduct(id, product) {
        try {
            let products = await this.getProducts()
            const actualProducts = await this.getProducts()
            let index = actualProducts.findIndex(element => element.id == id);
            product.id = id;
            products[index] = product;
            fs.writeFileSync(this.path, JSON.stringify(products));
            if(index == -1){return console.log('Error al actualizar producto: No existe la ID: ' + id)}
        } catch (e) {
            console.log("No existe la ID: " + id, e)
        }
    }

    async deleteProduct(id) {
        try {
            const actualProducts = await this.getProducts()
            let index = actualProducts.findIndex(element => element.id == id);
            if(index == -1){return console.log('Error al borrar producto: No existe la ID: ' + id)}
    
            actualProducts.splice(index, 1);
            fs.writeFileSync(this.path, JSON.stringify(actualProducts));
        } catch (e) {
            console.log(e);
        }

    }
}

export default ProductManager;