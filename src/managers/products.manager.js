import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getAllProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(productId) {
        try { 
            const products = await this.getAllProducts();
            const id = Number(productId);
            const product = products.find(p => p.id === id);
            if (!product) throw new Error('Product not found');
            return product;
        }  catch (error) {
            throw new Error('Product not found');
        }
    }

    async addProduct({ title, description, code, price, stock, category, thumbnails = [], status = true }) {
        if (!title || !description || !code || !price || stock === undefined || !category) {
            throw new Error('All fields except thumbnails are required.');
        }

        const products = await this.getAllProducts();
        const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(productId, product) {
        try {
            const products = await this.getAllProducts();

            const id = Number(productId);

            const i = products.findIndex(p => p.id === id);
    
            if (i === -1) {
                throw new Error('Product not found');
            }

            products[i] = { ...products[i], ...product };
    
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    
            return products[i];
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }
    

    async deleteProduct(productId) {
        try {
            const prod = await this.getProductById(productId);
            const products = await this.getAllProducts();
            const newArray = products.filter((prod) => prod.id !== productId);
            await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, 2));
            return prod;
        } catch (error) {
            throw new Error('Failed to delete product');
        }
    }

    async deleteAllProducts() {
        try {
            const products = await this.getAllProducts();
            if (products.length === 0) throw new Error('No products found');
            await fs.promises.writeFile.unlink(this.path);
        } catch (error) {
            throw new Error('Failed to delete product');
        }

    }
}
export const productManager = new ProductManager(path.resolve(__dirname, '../data/products.json'));
export default ProductManager;

    
