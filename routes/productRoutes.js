const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const Product = require('../models/Product');


// Get all products
router.get('/', controller.getProducts);

// Add a new product
router.post('/', controller.addProduct);

// Update stock (increment or decrement)
router.put('/:id/stock', controller.updateStock);

// Stock In (Increase stock)
router.put('/:id/stockin', controller.stockIn);

// Stock Out (Decrease stock)
router.put('/:id/stockout', controller.stockOut);

// Update product details (Edit)
router.put('/:id', controller.updateProduct);

// Delete product
router.delete('/:id', controller.deleteProduct);



module.exports = router;
