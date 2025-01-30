import fs from 'fs';
import path from 'path';
import { productManager } from './product.manager.js';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getAllCarts() {
        try {
            if (!fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getCartById(cartId) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === cartId) || null;
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const newCart = {
            id: (carts.length + 1).toString(),
            products: []
        };
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async saveProdToCart(cartId, productId) {
        const carts = await this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) throw new Error('Cart not found');

        const product = await productManager.getProductById(productId);
        if (!product) throw new Error('Product not found');

        const existingProduct = carts[cartIndex].products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            carts[cartIndex].products.push({ product: productId, quantity: 1 });
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return carts[cartIndex];
    }

    async deleteCart(cartId) {
        let carts = await this.getAllCarts();
        carts = carts.filter(cart => cart.id !== cartId);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) throw new Error('Cart not found');

        carts[cartIndex].products = carts[cartIndex].products.filter(p => p.product !== productId);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    }
}

export const cartManager = new cartManager(path.join(process.cwd(), '../data/carrito.json'));
