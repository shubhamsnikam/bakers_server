const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update product stock (increment or decrement)
exports.updateStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.quantity += Number(req.body.quantity);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Stock in (Increase product stock)
exports.stockIn = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.quantity += req.body.amount; // Add amount to quantity
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Stock out (Decrease product stock)
exports.stockOut = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.quantity -= req.body.amount; // Subtract amount from quantity
    if (product.quantity < 0) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update product details (Edit)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.quantity = req.body.quantity || product.quantity;
      product.price = req.body.price || product.price;
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};


