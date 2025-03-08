import { Router } from "express";  
import cartsSchema from "../models/carts.models.js";
import { CartManager } from "../models/dao/carts.dao.js";

const cartsManager = new CartManager('./src/data/databasecarts.json');
const router = Router(); 

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartFindedById = await cartsSchema.findById(cid).populate('products.product');

        if (!cartFindedById) return res.status(404).json({ message: 'Carrito no encontrado' });

        return res.status(200).json({ productList: cartFindedById.products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    const newCart = await cartsSchema.create({products: []});
    
    if(!newCart) res.status(404).json({ message: 'Error al guardar el carrito' });
    res.status(201).json({ message: 'Carrito guardado con exito', cart: newCart })
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartFindedById = await cartsSchema.findById(cid);
        
        if (!cartFindedById) return res.status(404).json({ message: 'Carrito no encontrado' });

        const productI = cartFindedById.products.findIndex(prod => prod.product.toString() === pid);

        if (productI === -1) {
            cartFindedById.products.push({ product: pid, quantity: 1 });
        } else {
            cartFindedById.products[productI].quantity += 1;
        }

        const cartUpdated = await cartsSchema.findByIdAndUpdate(
            cid,
            { products: cartFindedById.products },
            { new: true }
        ).populate('products.product');

        return res.status(201).json({ message: 'Producto agregado con éxito', cart: cartUpdated });
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body
    const cartFindedById = await cartsSchema.findById(cid).lean();

    if(!cartFindedById) res.status(404).json({ message: 'Carrito no encontrado' });

    const newCart = {
        ...cartFindedById,
        products
    }
    const cartUpdated = await cartsSchema.findByIdAndUpdate(cid,newCart, {
        new: true,
    }).populate('products.product')

    res.status(201).json({ message: 'Carrito actualizado', cart: cartUpdated})

});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity, action } = req.body;

        const cart = await cartsSchema.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const productIndex = cart.products.findIndex(prod => prod.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
        if (action === "decrease") {
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity -= 1;
            } else {
                cart.products.splice(productIndex, 1);
            }
        } else if (quantity !== undefined) {
            cart.products[productIndex].quantity = quantity;
        }

        const cartUpdated = await cartsSchema.findByIdAndUpdate(
            cid,
            { products: cart.products },
            { new: true }
        ).populate('products.product');

        res.status(200).json({ message: 'Cantidad de productos actualizada', cart: cartUpdated });
    }   
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor al actualizar el producto' });
    }
});
    

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    // Buscar el carrito por su ID
    const cartFindedById = await cartsSchema.findById(cid).lean();
    if (!cartFindedById) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Filtrar el producto a eliminar
    const cartFilter = {
        ...cartFindedById,
        products: cartFindedById.products.filter(product => product.product.toString() !== pid)
    };

    // Actualizar el carrito con el producto eliminado
    const cartUpdated = await cartsSchema.findByIdAndUpdate(cid, { products: cartFilter.products }, {
        new: true,
    }).populate('products.product');

    res.status(201).json({ message: 'Producto eliminado con éxito', cart: cartUpdated });
});


router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    
    const cartFindedById = await cartsSchema.findById(cid).lean();
    if(!cartFindedById) res.status(404).json({ message: 'error' });
    
    const newCart = {
        ...cartFindedById,
        products: []
    }
    const cartUpdated = await cartsSchema.findByIdAndUpdate(cid,newCart, {
        new: true,
    })

    res.status(201).json({ message: 'Carrito vaciado', cart: cartUpdated})

});

export default router;