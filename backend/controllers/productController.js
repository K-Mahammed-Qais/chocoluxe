const { Product } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category, keyword, featured } = req.query;
  
  let query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (featured) {
    query.isFeatured = featured === 'true';
  }
  
  if (keyword) {
    query.name = { [Op.like]: `%${keyword}%` };
  }
  
  const products = await Product.findAll({ where: query });
  res.json(products.map(p => {
    const json = p.toJSON();
    return { ...json, _id: p.id, price: parseFloat(json.price) };
  }));
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  
  if (product) {
    const json = product.toJSON();
    res.json({ ...json, _id: product.id, price: parseFloat(json.price) });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, description, price, category, stock, imageUrl, isFeatured } = req.body;
  
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    imageUrl,
    isFeatured: isFeatured || false
  });
  
  if (product) {
    const json = product.toJSON();
    res.status(201).json({ ...json, _id: product.id, price: parseFloat(json.price) });
  } else {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  
  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;
    product.imageUrl = req.body.imageUrl || product.imageUrl;
    product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
    
    const updatedProduct = await product.save();
    const json = updatedProduct.toJSON();
    res.json({ ...json, _id: updatedProduct.id, price: parseFloat(json.price) });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  
  if (product) {
    await product.destroy();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };