// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Logger middleware - logs request method, URL, and timestamp
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Authentication middleware - checks for API key in headers
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'mysecretkey') {
    return res.status(401).json({ error: 'Unauthorized - Invalid or missing API key' });
  }
  next();
};

// Validation middleware for product creation and update
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }
  
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: 'Description is required and must be a non-empty string' });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price is required and must be a positive number' });
  }
  
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'Category is required and must be a non-empty string' });
  }
  
  if (typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'inStock is required and must be a boolean' });
  }
  
  next();
};

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation error') {
    super(message, 400);
  }
}

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products, with optional filtering and pagination
app.get('/api/products', authenticateApiKey, (req, res) => {
  let result = [...products];

  // Filtering by category
  if (req.query.category) {
    result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResult = result.slice(startIndex, endIndex);

  res.json({
    total: result.length,
    page,
    limit,
    products: paginatedResult
  });
});

// GET /api/products/search?name=... - Search products by name (case-insensitive, partial match)
app.get('/api/products/search', authenticateApiKey, (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }
  const searchResults = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json({ total: searchResults.length, products: searchResults });
});

// GET /api/products/stats - Get product statistics (count by category)
app.get('/api/products/stats', authenticateApiKey, (req, res) => {
  const stats = {};
  products.forEach(p => {
    const cat = p.category.toLowerCase();
    stats[cat] = (stats[cat] || 0) + 1;
  });
  res.json({ countByCategory: stats });
});

// GET /api/products/:id - Get a specific product by ID
app.get('/api/products/:id', authenticateApiKey, (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found'));
  }
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', authenticateApiKey, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update an existing product
app.put('/api/products/:id', authenticateApiKey, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return next(new NotFoundError('Product not found'));
    }
    const updatedProduct = {
      id: req.params.id,
      name,
      description,
      price,
      category,
      inStock
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authenticateApiKey, (req, res, next) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return next(new NotFoundError('Product not found'));
    }
    const deletedProduct = products.splice(productIndex, 1);
    res.json({ message: 'Product deleted', product: deletedProduct[0] });
  } catch (err) {
    next(err);
  }
});

// Global error handler middleware
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 