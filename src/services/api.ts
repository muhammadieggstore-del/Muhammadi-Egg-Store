import { Product, Order, BulkOrderInquiry, CustomerRecord, StoreSettings, AdminMetrics, OrderStatus, BulkInquiryStatus } from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fallback products in case offline/initial load
const LOCAL_FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-egg-tray-30',
    name: 'Fresh White Farm Eggs (Tray)',
    tagline: '100% White Eggs Only • Min Order: 50 Trays',
    description: 'Clean, unwashed grade-A fresh pure white poultry eggs only (we supply white eggs only, zero brown eggs). Uniform size, thick white shells, rich golden yolks. Packed securely in sturdy 30-egg trays. Minimum supply order is 50 trays (1,500 white eggs). Single quantity sales are not supported.',
    category: 'Eggs',
    unit: 'Tray (30 White Eggs)',
    price: 175,
    image: '/src/assets/images/white_eggs_trays_1790536765513.jpg',
    stockStatus: 'in_stock',
    stockQuantity: 500,
    minOrderQuantity: 50,
    isActive: true,
    isPromotional: true,
    variants: [
      { id: 'var-tray-50', name: '50 Trays (1,500 White Eggs) - Min Order', quantityLabel: '50 Trays (1,500 White Eggs)', price: 8750, isDefault: true },
      { id: 'var-tray-75', name: '75 Trays (2,250 White Eggs)', quantityLabel: '75 Trays (2,250 White Eggs)', price: 13125 },
      { id: 'var-tray-100', name: '100 Trays (3,000 White Eggs)', quantityLabel: '100 Trays (3,000 White Eggs)', price: 17500 },
      { id: 'var-tray-150', name: '150 Trays (4,500 White Eggs)', quantityLabel: '150 Trays (4,500 White Eggs)', price: 26250 }
    ]
  },
  {
    id: 'prod-britannia-white-bread-med',
    name: 'Britannia White Bread (Medium)',
    tagline: 'Medium Size Pack • Min Order: 25 Pieces',
    description: 'Britannia white bread medium size pack. Fresh, soft slices with wholesome taste. Daily supply for commercial kitchens, messes, and bulk orders. Minimum supply order is 25 pieces/packs. Single quantity sales are not supported.',
    category: 'Bakery',
    unit: 'Medium Pack',
    price: 35,
    image: '/src/assets/images/britannia_white_bread_1790535286771.jpg',
    stockStatus: 'in_stock',
    stockQuantity: 300,
    minOrderQuantity: 25,
    isActive: true,
    isPromotional: false,
    variants: [
      { id: 'var-brit-med-25', name: '25 Pieces (Medium Packs) - Min Order', quantityLabel: '25 Pieces', price: 875, isDefault: true },
      { id: 'var-brit-med-50', name: '50 Pieces (Medium Packs)', quantityLabel: '50 Pieces', price: 1750 },
      { id: 'var-brit-med-100', name: '100 Pieces (Medium Packs)', quantityLabel: '100 Pieces', price: 3500 }
    ]
  },
  {
    id: 'prod-regular-buns-2pack',
    name: 'Regular Buns (2 Buns Pack)',
    tagline: 'Single Transparent Pack • Min Order: 25 Pieces',
    description: 'Regular soft bakery buns packed in a 2 buns quantity in a single clear transparent sealed pack. Soft, golden-crusted morning buns. Minimum supply order is 25 pieces/packs (50 buns total). Single quantity sales are not supported.',
    category: 'Bakery',
    unit: 'Transparent Pack (2 Buns)',
    price: 15,
    image: '/src/assets/images/two_regular_buns_pack_1790535298654.jpg',
    stockStatus: 'in_stock',
    stockQuantity: 350,
    minOrderQuantity: 25,
    isActive: true,
    isPromotional: false,
    variants: [
      { id: 'var-bun-2p-25', name: '25 Pieces / Packs (50 Buns Total) - Min Order', quantityLabel: '25 Packs (50 Buns)', price: 375, isDefault: true },
      { id: 'var-bun-2p-50', name: '50 Pieces / Packs (100 Buns Total)', quantityLabel: '50 Packs (100 Buns)', price: 750 },
      { id: 'var-bun-2p-100', name: '100 Pieces / Packs (200 Buns Total)', quantityLabel: '100 Packs (200 Buns)', price: 1500 }
    ]
  }
];

export async function fetchProducts(adminToken?: string): Promise<Product[]> {
  try {
    const headers: Record<string, string> = {};
    if (adminToken) headers['x-admin-token'] = adminToken;
    const res = await fetch(`${API_BASE}/products`, { headers });
    if (!res.ok) throw new ApiError('Failed to fetch products', res.status);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : LOCAL_FALLBACK_PRODUCTS;
  } catch (err) {
    console.warn('Using offline/cached product catalog:', err);
    return LOCAL_FALLBACK_PRODUCTS;
  }
}

export async function createOrder(orderPayload: any): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(errorData.error || 'Your order could not be submitted. Please contact Muhammadi Egg Store on WhatsApp.', res.status);
  }
  return res.json();
}

export async function trackOrder(orderId: string, phone: string): Promise<Order> {
  const params = new URLSearchParams({ orderId: orderId.trim(), phone: phone.trim() });
  const res = await fetch(`${API_BASE}/orders/track?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(errorData.error || 'Order not found. Please verify your Order ID and Phone Number.', res.status);
  }
  return res.json();
}

export async function submitBulkOrder(bulkPayload: any): Promise<BulkOrderInquiry> {
  const res = await fetch(`${API_BASE}/bulk-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bulkPayload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(errorData.error || 'Bulk request failed to submit. Please contact Muhammadi Egg Store directly on WhatsApp.', res.status);
  }
  return res.json();
}

export async function fetchSettings(): Promise<StoreSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Settings fetch failed');
    return res.json();
  } catch {
    return {
      storeName: 'Muhammadi Egg Store',
      tagline: 'Fresh Eggs Supplier',
      phone: '+91 639 2855 719',
      whatsappNumber: '916392855719',
      serviceArea: 'Loni, Ghaziabad, Uttar Pradesh, India',
      supportedLocalities: [
        'Sangam Vihar',
        'Balram Nagar',
        'Loni Border',
        'Tronica City',
        'DLF Ankur Vihar',
        'Khanna Nagar',
        'Ashok Vihar',
        'Indirapuri',
        'Shiv Vihar Border',
        'Vikas Nagar',
        'Naveen Kunj',
        'Other Loni Address'
      ],
      isOpen: true,
      openHours: '6:30 AM – 9:30 PM (Daily)',
      deliveryFee: 0,
      minOrderAmount: 0
    };
  }
}

// Admin APIs
export async function adminLogin(pin: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(errorData.error || 'Invalid Admin PIN', res.status);
  }
  return res.json();
}

export async function adminGetMetrics(token: string): Promise<AdminMetrics> {
  const res = await fetch(`${API_BASE}/admin/metrics`, {
    headers: { 'x-admin-token': token }
  });
  if (!res.ok) throw new ApiError('Failed to fetch admin metrics', res.status);
  return res.json();
}

export async function adminGetOrders(token: string, status?: string, search?: string): Promise<Order[]> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/orders?${params.toString()}`, {
    headers: { 'x-admin-token': token }
  });
  if (!res.ok) throw new ApiError('Failed to fetch orders', res.status);
  return res.json();
}

export async function adminUpdateOrderStatus(token: string, orderId: string, status: OrderStatus, note?: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify({ status, note })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(err.error || 'Failed to update order status', res.status);
  }
  return res.json();
}

export async function adminGetBulkOrders(token: string): Promise<BulkOrderInquiry[]> {
  const res = await fetch(`${API_BASE}/bulk-orders`, {
    headers: { 'x-admin-token': token }
  });
  if (!res.ok) throw new ApiError('Failed to fetch bulk orders', res.status);
  return res.json();
}

export async function adminUpdateBulkStatus(token: string, id: string, status: BulkInquiryStatus): Promise<BulkOrderInquiry> {
  const res = await fetch(`${API_BASE}/bulk-orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new ApiError('Failed to update bulk order status', res.status);
  return res.json();
}

export async function adminGetCustomers(token: string): Promise<CustomerRecord[]> {
  const res = await fetch(`${API_BASE}/customers`, {
    headers: { 'x-admin-token': token }
  });
  if (!res.ok) throw new ApiError('Failed to fetch customers', res.status);
  return res.json();
}

export async function adminSaveProduct(token: string, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(err.error || 'Failed to create product', res.status);
  }
  return res.json();
}

export async function adminUpdateProduct(token: string, id: string, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(err.error || 'Failed to update product', res.status);
  }
  return res.json();
}

export async function adminDeleteProduct(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': token }
  });
  if (!res.ok) throw new ApiError('Failed to delete product', res.status);
}

export async function adminUpdateSettings(token: string, settingsData: Partial<StoreSettings>): Promise<StoreSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify(settingsData)
  });
  if (!res.ok) throw new ApiError('Failed to update settings', res.status);
  return res.json();
}
