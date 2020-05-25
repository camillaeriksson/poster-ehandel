const Product = require("../models/productModel");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new peoduct
exports.createNewProduct = async (req, res) => {
  const product = new Product({
    price: req.body.price,
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    inventory: req.body.inventory,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    // res.status.apply(400).json({ message: err.message })
    res.status(400).json({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    await Product.findOneAndUpdate(
      { _id: req.params.productId },
      {
        price: req.body.price,
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        inventory: req.body.inventory,
      }
    );
    res.json("Post updated");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get products from category
exports.getProductsFromCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.productCategory,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.find({ _id: req.params.productId });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
