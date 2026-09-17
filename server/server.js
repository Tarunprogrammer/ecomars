import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ecomars_secret_jwt_key_2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecomars';

app.use(cors());
app.use(express.json());

// --- Database Connection Status ---
let isMongoConnected = false;

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2000
}).then(() => {
  isMongoConnected = true;
  console.log('✅ Connected successfully to MongoDB instance!');
}).catch((err) => {
  isMongoConnected = false;
  console.log('ℹ️ Local MongoDB daemon not running; operating seamlessly in zero-setup file DB mode.');
});

// --- Persistent File Storage Helper (Fallback Database) ---
const DB_FILE = path.join(__dirname, 'data.json');

const defaultSeedData = {
  users: [
    {
      id: 'usr_admin',
      name: 'Admin User',
      email: 'admin@ecomars.com',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr_customer',
      name: 'John Doe',
      email: 'user@ecomars.com',
      passwordHash: hashPassword('user123'),
      role: 'user',
      createdAt: new Date().toISOString()
    }
  ],
  products: [
    {
      id: 'prod_1',
      title: 'Aura Wireless Noise-Canceling Headphones',
      price: 199.99,
      category: 'Electronics',
      description: 'Premium spatial audio, active noise cancellation, 40-hour battery life with ultra-comfort memory foam earcups.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      stock: 25,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_2',
      title: 'Minimalist Chronograph Minimalist Watch',
      price: 149.50,
      category: 'Fashion',
      description: 'Italian leather strap, sapphire crystal glass, 50m water resistance. Timeless elegance for everyday wear.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      rating: 4.6,
      stock: 18,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_3',
      title: 'Ergonomic Desk Mechanical Keyboard',
      price: 119.00,
      category: 'Electronics',
      description: 'Custom hot-swappable switches, RGB backlight, wireless Bluetooth 5.2 and Type-C wired connectivity.',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      stock: 40,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_4',
      title: 'Ceramic Artisan Pour-Over Coffee Set',
      price: 54.99,
      category: 'Home & Kitchen',
      description: 'Handcrafted stoneware dripper, thermal glass carafe, and stainless steel filter for the perfect brew experience.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      rating: 4.7,
      stock: 12,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_5',
      title: 'Urban Explorer Lightweight Backpack',
      price: 89.99,
      category: 'Fashion',
      description: 'Water-resistant recycled fabric, dedicated 16" laptop sleeve, secret security pocket, and ergonomic shoulder padding.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      rating: 4.5,
      stock: 30,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_6',
      title: 'Smart Fitness Tracker & Heart Monitor',
      price: 79.95,
      category: 'Electronics',
      description: 'AMOLED touch display, continuous heart rate tracking, SpO2 sensor, sleep analysis, and 14-day battery.',
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80',
      rating: 4.4,
      stock: 50,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_7',
      title: 'Scandinavian Ceramic Desk Lamp',
      price: 68.00,
      category: 'Home & Kitchen',
      description: 'Dimmable warm LED light, matte ceramic base with solid oak accents. Ideal for study desks and bedside tables.',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      stock: 15,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_8',
      title: 'Organic Cotton Oversized Hoodie',
      price: 64.99,
      category: 'Fashion',
      description: 'Super soft 450GSM heavy organic cotton, vintage garment-dyed finish, relaxed streetwear silhouette.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      rating: 4.7,
      stock: 22,
      createdAt: new Date().toISOString()
    }
  ],
  orders: [
    {
      id: 'ord_1001',
      userId: 'usr_customer',
      customerName: 'John Doe',
      customerEmail: 'user@ecomars.com',
      shippingAddress: '123 Tech Street, Silicon Valley, CA 94025',
      items: [
        {
          id: 'prod_1',
          title: 'Aura Wireless Noise-Canceling Headphones',
          price: 199.99,
          quantity: 1
        }
      ],
      totalAmount: 199.99,
      status: 'Delivered',
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'salt_ecomars_2026').digest('hex');
}

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(defaultSeedData);
      return defaultSeedData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data.json:', err);
    return defaultSeedData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing data.json:', err);
  }
}

readDB();

// --- Auth Helpers & Middleware ---
function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
  next();
}

app.use(authenticateToken);

// --- API ROUTES ---

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Ecomars MERN API is active',
    mongoConnected: isMongoConnected,
    timestamp: new Date()
  });
});

app.get('/api/db-status', async (req, res) => {
  const db = readDB();
  let mongoUsersCount = 0;
  let mongoProductsCount = 0;
  let mongoOrdersCount = 0;

  if (isMongoConnected) {
    try {
      mongoUsersCount = await User.countDocuments();
      mongoProductsCount = await Product.countDocuments();
      mongoOrdersCount = await Order.countDocuments();
    } catch {}
  }

  res.json({
    databaseType: isMongoConnected ? 'MongoDB (Mongoose ODM)' : 'JSON Persistence Storage Engine',
    isMongoConnected,
    mongoUri: MONGODB_URI,
    stats: {
      usersCount: isMongoConnected ? mongoUsersCount : db.users.length,
      productsCount: isMongoConnected ? mongoProductsCount : db.products.length,
      ordersCount: isMongoConnected ? mongoOrdersCount : db.orders.length
    }
  });
});

app.get('/api/seed', async (req, res) => {
  writeDB(defaultSeedData);

  if (isMongoConnected) {
    try {
      await User.deleteMany({});
      await Product.deleteMany({});
      await Order.deleteMany({});

      await User.insertMany(defaultSeedData.users);
      await Product.insertMany(defaultSeedData.products);
      await Order.insertMany(defaultSeedData.orders);
    } catch (err) {
      console.error('MongoDB seed error:', err);
    }
  }

  res.json({ message: 'Database successfully seeded with default products and demo accounts!', data: defaultSeedData });
});

// Auth Endpoints
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const db = readDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name,
    email,
    passwordHash: hashPassword(password),
    role: role === 'admin' ? 'admin' : 'user',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  if (isMongoConnected) {
    try {
      await User.create(newUser);
    } catch {}
  }

  const token = generateToken(newUser);
  const userSafe = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };

  res.status(201).json({
    message: 'User registered successfully!',
    token,
    user: userSafe
  });
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(user);
  const userSafe = { id: user.id, name: user.name, email: user.email, role: user.role };

  res.json({
    message: 'Signed in successfully!',
    token,
    user: userSafe
  });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Product Endpoints
app.get('/api/products', (req, res) => {
  const db = readDB();
  let result = [...db.products];

  const { search, category, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(product);
});

app.post('/api/products', requireAdmin, async (req, res) => {
  const { title, price, category, description, image, stock, rating } = req.body;

  if (!title || !price || !category || !image) {
    return res.status(400).json({ error: 'Title, price, category, and image URL are required.' });
  }

  const db = readDB();
  const newProduct = {
    id: 'prod_' + Date.now(),
    title,
    price: parseFloat(price),
    category,
    description: description || '',
    image,
    stock: parseInt(stock) || 10,
    rating: parseFloat(rating) || 4.5,
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  writeDB(db);

  if (isMongoConnected) {
    try {
      await Product.create(newProduct);
    } catch {}
  }

  res.status(201).json({ message: 'Product created successfully!', product: newProduct });
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const existing = db.products[index];
  const { title, price, category, description, image, stock, rating } = req.body;

  const updatedProduct = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    price: price !== undefined ? parseFloat(price) : existing.price,
    category: category !== undefined ? category : existing.category,
    description: description !== undefined ? description : existing.description,
    image: image !== undefined ? image : existing.image,
    stock: stock !== undefined ? parseInt(stock) : existing.stock,
    rating: rating !== undefined ? parseFloat(rating) : existing.rating,
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updatedProduct;
  writeDB(db);

  if (isMongoConnected) {
    try {
      await Product.findOneAndUpdate({ id: req.params.id }, updatedProduct);
    } catch {}
  }

  res.json({ message: 'Product updated successfully!', product: updatedProduct });
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  const db = readDB();
  const initialCount = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);

  if (db.products.length === initialCount) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  writeDB(db);

  if (isMongoConnected) {
    try {
      await Product.deleteOne({ id: req.params.id });
    } catch {}
  }

  res.json({ message: 'Product deleted successfully!' });
});

// Orders Endpoints
app.post('/api/orders', async (req, res) => {
  const { items, customerName, customerEmail, shippingAddress, paymentMethod } = req.body;

  if (!items || !items.length || !customerName || !customerEmail || !shippingAddress) {
    return res.status(400).json({ error: 'Order items and customer delivery info are required.' });
  }

  const db = readDB();
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const newOrder = {
    id: 'ord_' + Math.floor(1000 + Math.random() * 9000),
    userId: req.user ? req.user.id : 'guest',
    customerName,
    customerEmail,
    shippingAddress,
    items,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    status: 'Pending',
    paymentMethod: paymentMethod || 'Cash on Delivery',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  items.forEach(item => {
    const prod = db.products.find(p => p.id === item.id);
    if (prod && prod.stock >= item.quantity) {
      prod.stock -= item.quantity;
    }
  });

  writeDB(db);

  if (isMongoConnected) {
    try {
      await Order.create(newOrder);
    } catch {}
  }

  res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
});

app.get('/api/orders/my-orders', requireAuth, (req, res) => {
  const db = readDB();
  const myOrders = db.orders.filter(o => o.userId === req.user.id || o.customerEmail.toLowerCase() === req.user.email.toLowerCase());
  res.json(myOrders);
});

app.get('/api/orders', requireAdmin, (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status string is required.' });
  }

  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  writeDB(db);

  if (isMongoConnected) {
    try {
      await Order.findOneAndUpdate({ id: req.params.id }, { status });
    } catch {}
  }

  res.json({ message: 'Order status updated successfully!', order });
});

app.listen(PORT, () => {
  console.log(`🚀 Ecomars Express API Server running at http://localhost:${PORT}`);
});
