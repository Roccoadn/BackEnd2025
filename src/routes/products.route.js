import { Router } from "express";  
import { upload } from "../utils.js";
import __dirname from "../utils.js";
import productsSchema from "../models/products.model.js";
import path from 'path';

const router = Router(); 

router.post('/', upload.single('thumbnail'), async (req, res) => {
    if (!req.file) res.status(400).json({error: 'No se subio ningun archivo'});
    
    const product = req.body;
    const result = await productsSchema.create({
        ...product, 
        thumbnail: path.resolve(__dirname + '/public/img', req.file.filename)
    });

    res.status(201).json({ payload: result});
});

router.get('/', async (req, res) => {
  try {
    const { limit = 6, page = 1, sort = '', ...query } = req.query;
    const sortOptions = {
      asc: { price: 1 },
      desc: { price: -1 }
    };
    const products = await productsSchema.paginate(
    { ...query },
      {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOptions[sort] || {},
        customLabels: { docs: 'payload' }
      }
    );
    res.status(200).json({ ...products });
  } 
  catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const productFindedById = await productsSchema.findById(id);
    
    if (!productFindedById) return res.status(404).json({ message: "Product not found" });

    res.status(201).json({ payload: productFindedById });
  });
  
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
    const { body, params } = req;
    const { id } = params;
    const product = body;
    const productUpdated = await productsSchema.findByIdAndUpdate(id, {
      ...product,
      ...(req?.file?.path && { thumbnail: req.file.path }),
    }, { new: true });
  
    res.status(201).json({ message: "Producto actualizado con exito", payload: productUpdated });
  });
  
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const productDeleted = await productsSchema.findByIdAndDelete(id);

    if (!productDeleted) return res.status(404).json({ message: "Producto no encontrado" });
  
    res.status(201).json({ payload: productDeleted });
  });

router.get('/productsDetail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Error: No se proporcionó un ID de producto.");
    }
    const product = await productsSchema.findById(id).lean();
    if (!product) {
      return res.status(404).send("Producto no encontrado.");
    }
    res.render('productsDetail', { product });
  
  } catch (error) {
    res.status(500).send("Error al obtener el producto aca");
  }
});

export default router;