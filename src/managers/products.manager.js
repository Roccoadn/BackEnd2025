import fs from 'node:fs';
import path from 'path';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getAllProducts() {
        if (fs.existsSync(this.path)) {
            const products = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(products);
        } 
        else return [];
    }

    async getProductById({productId}) {
        const products = await this.getAllProducts();
        const id = Number(productId);
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error('Product not found');  
        }
        else{
            return product;
        }
    }

    async addProduct({title, description, price, stock, code, thumbnails, status = true}) {
        if (!title || !description || !price) {
            throw new Error('Te falto el titulo, el description o el price');
        }

        const products = await this.getAllProducts();
        const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        const newProduct = { id, title, description, price, status, stock, code, thumbnails };
        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(productId, product) {
        const products = await this.getAllProducts();
        const id = Number(productId);
        const i = products.findIndex(p => p.id === id);
    
        if (i === -1) {
            throw new Error('Product not found');
        }
        else{
            products[i] = { ...products[i], ...product };
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[i];
        }
    }
    

    async deleteProduct(productId) {
        const id = Number(productId);
        const products = await this.getAllProducts();
        const newArray = products.filter((p) => p.id !== id);

        if (newArray.length === products.length) {
            throw new Error('Product not found');
        }
        else{
            await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, 2));
            return {message: 'Product deleted success'};
        }
    }

    async deleteAllProducts() {
        const products = await this.getAllProducts();
        if (products.length === 0) {
            throw new Error('No products found');
        }
        await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
    }
}

export const productManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));


    
