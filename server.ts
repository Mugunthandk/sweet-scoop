import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { handleScoopBotChat, getAIRecommendations } from './src/server/gemini';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Log API Requests
  app.use('/api', (req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Sweet Scoop API', timestamp: new Date() });
  });

  // --- Auth Routes ---
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    let user = db.getUserByEmail(email);
    if (!user) {
      // Auto-create customer if logging in with new email for instant demo access
      user = db.createUser({
        name: email.split('@')[0],
        email,
        mobile: '+91 99999 88888',
        role: 'CUSTOMER',
        sweetPoints: 100,
        tier: 'Scoop Starter',
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString()
      });
    }
    res.json({ success: true, user, token: `demo-jwt-token-${user.id}` });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, mobile } = req.body;
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }
    const user = db.createUser({
      name,
      email,
      mobile: mobile || '+91 98765 00000',
      role: 'CUSTOMER',
      sweetPoints: 100, // Welcome Bonus!
      tier: 'Scoop Starter',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString()
    });
    res.json({ success: true, user, token: `demo-jwt-token-${user.id}` });
  });

  app.post('/api/auth/send-otp', (req, res) => {
    const { mobile } = req.body;
    res.json({ success: true, message: `OTP sent successfully to ${mobile}. Demo OTP: 1234` });
  });

  app.post('/api/auth/verify-otp', (req, res) => {
    const { mobile, otp } = req.body;
    if (otp === '1234' || otp.length === 4) {
      const user = db.getUsers().find(u => u.mobile === mobile) || db.getUserById('usr-customer')!;
      res.json({ success: true, user, token: `demo-jwt-token-${user.id}` });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  });

  // --- Products APIs ---
  app.get('/api/products', (req, res) => {
    try {
      const { category, search, q, vegan, isVegan, sugarFree, isSugarFree, bestseller, sort } = req.query;
      const products = db.getProducts({
        category: category as string,
        search: (search || q) as string,
        vegan: vegan === 'true' || isVegan === 'true',
        sugarFree: sugarFree === 'true' || isSugarFree === 'true',
        bestseller: bestseller === 'true',
        sort: sort as string
      });
      res.json(products);
    } catch (err) {
      console.error('Error in GET /api/products:', err);
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  });

  app.put('/api/products/:id', (req, res) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  });

  app.delete('/api/products/:id', (req, res) => {
    const success = db.deleteProduct(req.params.id);
    res.json({ success });
  });

  // --- Orders & Checkout APIs ---
  app.get('/api/orders', (req, res) => {
    const { userId } = req.query;
    const orders = db.getOrders(userId as string);
    res.json(orders);
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    try {
      const order = db.createOrder(req.body);
      res.status(201).json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const order = db.updateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, order });
  });

  // --- Coupons API ---
  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body;
    const result = db.validateCoupon(code, subtotal);
    res.json(result);
  });

  app.get('/api/coupons', (req, res) => {
    res.json(db.getCoupons());
  });

  // --- AI APIs ---
  app.post('/api/ai/scoopbot', async (req, res) => {
    const { messages } = req.body;
    const reply = await handleScoopBotChat(messages || []);
    res.json({ reply });
  });

  app.post('/api/ai/recommendations', async (req, res) => {
    const { craving, dietary, mood } = req.body;
    const recommendations = await getAIRecommendations(craving, dietary, mood);
    res.json(recommendations);
  });

  // --- Stores, Reviews, Inventory, Analytics ---
  app.get('/api/stores', (req, res) => res.json(db.getStores()));
  app.get('/api/reviews', (req, res) => {
    const { productId } = req.query;
    res.json(db.getReviews(productId as string));
  });
  app.post('/api/reviews', (req, res) => res.json(db.addReview(req.body)));

  app.get('/api/inventory', (req, res) => res.json(db.getInventory()));
  app.put('/api/inventory/:id', (req, res) => {
    const { quantity } = req.body;
    const item = db.updateInventory(req.params.id, quantity);
    res.json(item);
  });

  app.get('/api/admin/analytics', (req, res) => res.json(db.getAnalytics()));
  app.get('/api/notifications', (req, res) => {
    const { userId } = req.query;
    res.json(db.getNotifications((userId as string) || 'usr-customer'));
  });

  app.get('/api/subscriptions', (req, res) => {
    const { userId } = req.query;
    res.json(db.getSubscriptions((userId as string) || 'usr-customer'));
  });

  app.get('/api/staff', (req, res) => res.json(db.getStaff()));
  app.post('/api/staff', (req, res) => res.json(db.addStaff(req.body)));

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍦 Sweet Scoop Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
