import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_FILE = path.resolve(__dirname, 'data', 'store.json');

// Middleware
app.use(express.json());

// Persistent database helpers
function getDB() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error('Database file does not exist');
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading database:', err);
    return {
      products: [],
      orders: [],
      bulkInquiries: [],
      customers: [],
      storeSettings: {}
    };
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing database:', err);
    return false;
  }
}

// Simple Admin Authentication Middleware
function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-admin-token'] || req.query.token;
  const db = getDB();
  const currentPin = db.storeSettings?.adminPin || '6392';
  
  if (token === `MES-TOKEN-${currentPin}`) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
}

// --- API ROUTES ---

// 1. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  const db = getDB();
  const validPin = db.storeSettings?.adminPin || '6392';

  if (!pin || String(pin).trim() !== String(validPin).trim()) {
    return res.status(401).json({ error: 'Invalid PIN. Please enter the correct Store PIN.' });
  }

  const token = `MES-TOKEN-${validPin}`;
  return res.json({
    success: true,
    token,
    message: 'Store Admin authorized'
  });
});

// 2. Products API
app.get('/api/products', (req: Request, res: Response) => {
  const db = getDB();
  const isAdmin = req.headers['x-admin-token'] === `MES-TOKEN-${db.storeSettings?.adminPin || '6392'}`;
  
  if (isAdmin) {
    return res.json(db.products || []);
  }
  
  // For customers, show only active products
  const activeProducts = (db.products || []).filter((p: any) => p.isActive !== false);
  return res.json(activeProducts);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = getDB();
  const product = (db.products || []).find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

app.post('/api/products', verifyAdmin, (req: Request, res: Response) => {
  const { name, tagline, description, category, unit, price, image, stockStatus, stockQuantity, minOrderQuantity, variants } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const db = getDB();
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    tagline: tagline || '',
    description: description || '',
    category: category || 'Eggs',
    unit: unit || 'Unit',
    price: Number(price),
    image: image || '/images/egg_tray_30_fresh_1790534499444.jpg',
    stockStatus: stockStatus || 'in_stock',
    stockQuantity: Number(stockQuantity) || 100,
    minOrderQuantity: Number(minOrderQuantity) || 1,
    isActive: true,
    isPromotional: Boolean(req.body.isPromotional),
    variants: Array.isArray(variants) && variants.length > 0 ? variants : [
      {
        id: `var-${Date.now()}`,
        name: `${name} (Standard)`,
        quantityLabel: unit || '1 Unit',
        price: Number(price),
        isDefault: true
      }
    ]
  };

  db.products = db.products || [];
  db.products.push(newProduct);
  saveDB(db);

  return res.status(201).json(newProduct);
});

app.put('/api/products/:id', verifyAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const index = (db.products || []).findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[index];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    stockQuantity: req.body.stockQuantity !== undefined ? Number(req.body.stockQuantity) : existing.stockQuantity,
  };

  db.products[index] = updated;
  saveDB(db);

  return res.json(updated);
});

app.delete('/api/products/:id', verifyAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const initialLength = (db.products || []).length;
  db.products = (db.products || []).filter((p: any) => p.id !== req.params.id);

  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }

  saveDB(db);
  return res.json({ success: true, message: 'Product removed' });
});

// 3. Orders API
app.get('/api/orders', verifyAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const { status, search } = req.query;
  let orders = db.orders || [];

  if (status && status !== 'all') {
    orders = orders.filter((o: any) => o.status === status);
  }

  if (search) {
    const q = String(search).toLowerCase();
    orders = orders.filter((o: any) =>
      o.id.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.phone?.includes(q) ||
      o.delivery?.locality?.toLowerCase().includes(q)
    );
  }

  // Sort latest first
  orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return res.json(orders);
});

// Public Track Order endpoint (requires Order ID and matching Phone number)
app.get('/api/orders/track', (req: Request, res: Response) => {
  const { orderId, phone } = req.query;
  if (!orderId || !phone) {
    return res.status(400).json({ error: 'Order ID and Phone number are required to track an order' });
  }

  const cleanOrderId = String(orderId).trim().toUpperCase();
  const cleanPhone = String(phone).replace(/\D/g, ''); // Extract digits

  const db = getDB();
  const order = (db.orders || []).find((o: any) => {
    const matchesId = o.id.toUpperCase() === cleanOrderId;
    const orderPhoneDigits = (o.customer?.phone || '').replace(/\D/g, '');
    const matchesPhone = orderPhoneDigits.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhoneDigits);
    return matchesId && matchesPhone;
  });

  if (!order) {
    return res.status(404).json({
      error: 'No order found matching this Order ID and Phone Number. Please verify your details or contact us on WhatsApp.'
    });
  }

  return res.json(order);
});

// Create Order (Public checkout)
app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, delivery, items, paymentMethod, notes } = req.body;

  // Validation
  if (!customer?.name || !customer?.phone) {
    return res.status(400).json({ error: 'Customer name and phone number are required' });
  }
  const phoneDigits = customer.phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' });
  }

  if (!delivery?.address || !delivery?.locality) {
    return res.status(400).json({ error: 'Delivery address and locality in Loni are required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty. Please add products to order.' });
  }

  const db = getDB();

  // Enforce Minimum Order Quantities (MOQ):
  // Rule: Do not sell single quantity. Eggs min 50 trays, Breads min 25 pieces, Buns min 25 pieces.
  for (const item of items) {
    const dbProduct = (db.products || []).find((p: any) => p.id === item.productId);
    const qty = Number(item.quantity) || 1;
    const isEggs = dbProduct?.category === 'Eggs' || item.productId?.includes('egg');
    const isBread = item.productId?.includes('bread');
    const isBuns = item.productId?.includes('bun');
    const variantName = (item.variantName || '').toLowerCase();

    // Check if variant already represents a bundle/pack >= minimum
    const isPackVariant =
      variantName.includes('50 tray') ||
      variantName.includes('75 tray') ||
      variantName.includes('100 tray') ||
      variantName.includes('150 tray') ||
      variantName.includes('25 piece') ||
      variantName.includes('50 piece') ||
      variantName.includes('100 piece') ||
      variantName.includes('25 pack') ||
      variantName.includes('50 pack') ||
      variantName.includes('100 pack');

    if (!isPackVariant) {
      if (isEggs && qty < 50) {
        return res.status(400).json({
          error: 'Minimum order quantity for White Farm Eggs is 50 trays (1,500 white eggs). Single quantity sales are not supported.'
        });
      }
      if (isBread && qty < 25) {
        return res.status(400).json({
          error: 'Minimum order quantity for Britannia White Bread is 25 pieces. Single quantity sales are not supported.'
        });
      }
      if (isBuns && qty < 25) {
        return res.status(400).json({
          error: 'Minimum order quantity for Regular Buns is 25 pieces (50 buns). Single quantity sales are not supported.'
        });
      }
    }
  }

  // Calculate pricing from DB products to prevent client tampering
  let subtotal = 0;
  const processedItems = items.map((item: any) => {
    const dbProduct = (db.products || []).find((p: any) => p.id === item.productId);
    let unitPrice = item.unitPrice;
    let variantName = item.variantName || '';

    if (dbProduct) {
      if (item.variantId) {
        const variant = dbProduct.variants?.find((v: any) => v.id === item.variantId);
        if (variant) {
          unitPrice = variant.price;
          variantName = variant.name;
        }
      } else {
        unitPrice = dbProduct.price;
      }
    }

    const qty = Math.max(1, Number(item.quantity) || 1);
    const itemSubtotal = unitPrice * qty;
    subtotal += itemSubtotal;

    return {
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName || dbProduct?.name || 'Fresh Produce',
      variantName,
      unitPrice,
      quantity: qty,
      subtotal: itemSubtotal,
      image: item.image || dbProduct?.image || '/images/egg_tray_30_fresh_1790534499444.jpg'
    };
  });

  const deliveryFee = Number(db.storeSettings?.deliveryFee) || 0;
  const total = subtotal + deliveryFee;

  // Generate Order ID: MES-YYYYMMDD-XXX
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const datePrefix = `MES-${yyyy}${mm}${dd}`;

  const todayOrders = (db.orders || []).filter((o: any) => o.id.startsWith(datePrefix));
  const sequenceNum = String(todayOrders.length + 1).padStart(3, '0');
  const orderId = `${datePrefix}-${sequenceNum}`;

  const nowISO = new Date().toISOString();

  const newOrder = {
    id: orderId,
    createdAt: nowISO,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      whatsapp: (customer.whatsapp || customer.phone).trim()
    },
    delivery: {
      address: delivery.address.trim(),
      locality: delivery.locality.trim(),
      landmark: delivery.landmark ? delivery.landmark.trim() : '',
      instructions: delivery.instructions ? delivery.instructions.trim() : ''
    },
    items: processedItems,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: paymentMethod === 'upi_on_delivery' ? 'upi_on_delivery' : 'cod',
    status: 'Order Received',
    timeline: [
      {
        status: 'Order Received',
        timestamp: nowISO,
        note: `Order received via ${paymentMethod === 'upi_on_delivery' ? 'UPI on Delivery' : 'Cash on Delivery'}`
      }
    ],
    notes: notes || ''
  };

  db.orders = db.orders || [];
  db.orders.push(newOrder);

  // Update or insert customer
  db.customers = db.customers || [];
  const custIndex = db.customers.findIndex((c: any) =>
    c.phone.replace(/\D/g, '') === phoneDigits
  );

  if (custIndex >= 0) {
    db.customers[custIndex].totalOrders += 1;
    db.customers[custIndex].totalSpend += total;
    db.customers[custIndex].lastOrderAt = nowISO;
    db.customers[custIndex].name = customer.name.trim();
    db.customers[custIndex].address = `${delivery.address}, ${delivery.locality}`;
  } else {
    db.customers.push({
      phone: customer.phone.trim(),
      name: customer.name.trim(),
      whatsapp: (customer.whatsapp || customer.phone).trim(),
      address: `${delivery.address}, ${delivery.locality}`,
      totalOrders: 1,
      totalSpend: total,
      lastOrderAt: nowISO
    });
  }

  saveDB(db);

  return res.status(201).json(newOrder);
});

// Update Order Status (Admin only)
app.patch('/api/orders/:id/status', verifyAdmin, (req: Request, res: Response) => {
  const { status, note } = req.body;
  const validStatuses = ['Order Received', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const db = getDB();
  const orderIndex = (db.orders || []).findIndex((o: any) => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = db.orders[orderIndex];
  order.status = status;
  order.timeline = order.timeline || [];
  order.timeline.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status}`
  });

  db.orders[orderIndex] = order;
  saveDB(db);

  return res.json(order);
});

// 4. Bulk Orders API
app.get('/api/bulk-orders', verifyAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const inquiries = db.bulkInquiries || [];
  inquiries.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(inquiries);
});

app.post('/api/bulk-orders', (req: Request, res: Response) => {
  const { customerName, businessName, businessType, phone, whatsapp, requiredProduct, requiredQuantity, preferredDate, deliveryLocation, frequency, additionalRequirements } = req.body;

  if (!customerName || !phone || !requiredProduct || !requiredQuantity || !deliveryLocation) {
    return res.status(400).json({ error: 'Name, phone, product, quantity, and delivery location are required' });
  }

  const db = getDB();
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const prefix = `BLK-${yyyy}${mm}${dd}`;

  const todayBulks = (db.bulkInquiries || []).filter((b: any) => b.id.startsWith(prefix));
  const seq = String(todayBulks.length + 1).padStart(3, '0');
  const id = `${prefix}-${seq}`;

  const newInquiry = {
    id,
    createdAt: new Date().toISOString(),
    customerName: customerName.trim(),
    businessName: (businessName || 'Food Business').trim(),
    businessType: businessType || 'Restaurant',
    phone: phone.trim(),
    whatsapp: (whatsapp || phone).trim(),
    requiredProduct: requiredProduct.trim(),
    requiredQuantity: requiredQuantity.trim(),
    preferredDate: preferredDate || new Date().toISOString().split('T')[0],
    deliveryLocation: deliveryLocation.trim(),
    frequency: frequency || 'Daily Supply',
    additionalRequirements: additionalRequirements ? additionalRequirements.trim() : '',
    status: 'New'
  };

  db.bulkInquiries = db.bulkInquiries || [];
  db.bulkInquiries.push(newInquiry);
  saveDB(db);

  return res.status(201).json(newInquiry);
});

app.patch('/api/bulk-orders/:id/status', verifyAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const valid = ['New', 'Contacted', 'Quoted', 'Confirmed', 'Completed', 'Cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${valid.join(', ')}` });
  }

  const db = getDB();
  const index = (db.bulkInquiries || []).findIndex((b: any) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Bulk inquiry not found' });
  }

  db.bulkInquiries[index].status = status;
  saveDB(db);

  return res.json(db.bulkInquiries[index]);
});

// 5. Customers API (Admin only)
app.get('/api/customers', verifyAdmin, (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.customers || []);
});

// 6. Settings API
app.get('/api/settings', (req: Request, res: Response) => {
  const db = getDB();
  const settings = db.storeSettings || {};
  // Exclude admin PIN from public response
  const { adminPin, ...publicSettings } = settings;
  return res.json(publicSettings);
});

app.put('/api/settings', verifyAdmin, (req: Request, res: Response) => {
  const db = getDB();
  db.storeSettings = {
    ...db.storeSettings,
    ...req.body
  };
  saveDB(db);
  const { adminPin, ...publicSettings } = db.storeSettings;
  return res.json(publicSettings);
});

// 7. Admin Overview Metrics API
app.get('/api/admin/metrics', verifyAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const orders = db.orders || [];
  const products = db.products || [];
  const bulkInquiries = db.bulkInquiries || [];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o: any) => o.createdAt.startsWith(todayStr));

  const pendingOrders = orders.filter((o: any) => ['Order Received', 'Confirmed', 'Preparing'].includes(o.status));
  const outForDelivery = orders.filter((o: any) => o.status === 'Out for Delivery');
  const completedOrders = orders.filter((o: any) => o.status === 'Delivered');

  const todaySales = todayOrders
    .filter((o: any) => o.status !== 'Cancelled')
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  const lowStockProducts = products.filter((p: any) => p.stockStatus === 'low_stock' || (p.stockQuantity !== undefined && p.stockQuantity < 30));

  return res.json({
    todayOrdersCount: todayOrders.length,
    pendingOrdersCount: pendingOrders.length,
    outForDeliveryCount: outForDelivery.length,
    completedOrdersCount: completedOrders.length,
    todaySales,
    lowStockCount: lowStockProducts.length,
    bulkInquiriesCount: bulkInquiries.filter((b: any) => b.status === 'New').length,
    totalProductsCount: products.length,
    totalOrdersCount: orders.length
  });
});

// 8. 404 handler for unknown API endpoints
app.all('/api/*', (req: Request, res: Response) => {
  return res.status(404).json({ error: 'API endpoint not found' });
});

// --- Static Asset Serving ---
app.use('/images', express.static(path.resolve(__dirname, 'public', 'images')));
app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src', 'assets', 'images')));

// --- Vite Integration & Server Startup ---
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: {
          server: httpServer
        }
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    // Dev SPA fallback
    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const filterScript = '<script>(function(){var orig=console.error;console.error=function(){var a=arguments[0];if(typeof a==="string"&&(a.indexOf("[vite]")!==-1||a.indexOf("vite:ws")!==-1)){return;}return orig.apply(console,arguments);};})();</script>';
        template = template.replace('<script type="module" src="/@vite/client"></script>', filterScript + '<script type="module" src="/@vite/client"></script>');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Muhammadi Egg Store server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
