import { Product, Order, StoreSettings, AdminMetrics, BulkOrderInquiry, CustomerRecord } from '../types';

// Images are stored in /public/images and must use Vite's base URL so they
// work both locally and when deployed under a GitHub Pages project path.
const imageUrl = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`;

// Real high-quality product assets with correct paths
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Fresh White Eggs (Tray)',
    tagline: 'Direct-from-farm 100% white eggs',
    description: 'Fresh wholesale white eggs. High quality, reliable supply, zero tension. Minimum supply: 50 egg trays across Loni, Ghaziabad.',
    category: 'Eggs',
    price: 180,
    unit: 'Tray',
    image: imageUrl('white_eggs_trays_1790536765513.jpg'),
    stockStatus: 'in_stock',
    stockQuantity: 500,
    isPromotional: true,
    minOrderQuantity: 50,
    isActive: true,
    variants: [
      { id: 'v1-1', name: '50 Trays (Bulk)', quantityLabel: '50 Trays', price: 9000 },
      { id: 'v1-2', name: '100 Trays (Wholesale)', quantityLabel: '100 Trays', price: 18000 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Britannia White Bread',
    tagline: 'Medium Pack Fresh Bread',
    description: 'Fresh Britannia white bread packs. Minimum wholesale delivery requirement: 25 pieces.',
    category: 'Bakery',
    price: 30,
    unit: 'Piece',
    image: imageUrl('britannia_white_bread_1790535286771.jpg'),
    stockStatus: 'in_stock',
    stockQuantity: 200,
    minOrderQuantity: 25,
    isActive: true,
    variants: [
      { id: 'v2-1', name: '25 Pieces Pack', quantityLabel: '25 Pcs', price: 750 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Regular Buns',
    tagline: '2-Pack Transparent Wrap',
    description: 'Standard fresh regular buns in clean transparent double-packaging. Minimum wholesale delivery requirement: 25 packs.',
    category: 'Bakery',
    price: 15,
    unit: 'Pack',
    image: imageUrl('two_regular_buns_pack_1790535298654.jpg'),
    stockStatus: 'in_stock',
    stockQuantity: 300,
    minOrderQuantity: 25,
    isActive: true,
    variants: [
      { id: 'v3-1', name: '25 Packs Bundle', quantityLabel: '25 Packs', price: 375 }
    ]
  }
];

const MOCK_SETTINGS: StoreSettings = {
  storeName: 'Muhammadi Egg Store',
  isAcceptingOrders: true,
  deliveryAreas: ['Loni', 'Ghaziabad'],
  tagline: 'Fresh Eggs Supplier',
  phone: '+91 639 2855 719',
  whatsappNumber: '916392855719',
  serviceArea: 'Loni, Ghaziabad, Uttar Pradesh, India',
  supportedLocalities: ['Loni', 'Ghaziabad'],
  isOpen: true,
  openHours: '6:30 AM – 9:30 PM (Daily)',
  deliveryFee: 0,
  minOrderAmount: 0
};

// Core Fetch functions
export const fetchProducts = async (_token?: string): Promise<Product[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 50));
};

export const fetchSettings = async (): Promise<StoreSettings> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SETTINGS), 50));
};

// Order management system hooks required by CheckoutModal
export const createOrder = async (orderData: any): Promise<Order> => {
  return new Promise((resolve) => resolve({ id: 'ORD-' + Math.floor(Math.random() * 90000), ...orderData, status: 'pending', createdAt: new Date().toISOString() }));
};

export const trackOrder = async (orderId: string, phone: string): Promise<Order | null> => {
  return new Promise((resolve) => resolve(null));
};

export const submitBulkOrder = async (bulkData: any): Promise<boolean> => {
  return new Promise((resolve) => resolve(true));
};

// Admin Dashboard API
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://muhammadi-egg-store.onrender.com').replace(/\/$/, '');
const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  let body: any = null;
  try { body = await response.json(); } catch {}
  if (!response.ok) throw new Error(body?.error || `Request failed (${response.status})`);
  return body as T;
}

const adminHeaders = (token: string) => ({ 'x-admin-token': token });

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  message: string;
}

export const adminLogin = async (username: string, password: string): Promise<AdminLoginResponse> =>
  adminRequest<AdminLoginResponse>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const adminGetMetrics = async (token: string): Promise<AdminMetrics> =>
  adminRequest<AdminMetrics>('/api/admin/metrics', { headers: adminHeaders(token) });

export const adminGetOrders = async (token: string, status = 'all', search = '') => {
  const params = new URLSearchParams({ status, search });
  return adminRequest<Order[]>(`/api/orders?${params.toString()}`, { headers: adminHeaders(token) });
};

export const adminUpdateOrderStatus = async (token: string, orderId: string, status: any) =>
  adminRequest<Order>(`/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH', headers: adminHeaders(token), body: JSON.stringify({ status })
  });

export const adminGetBulkOrders = async (token: string): Promise<BulkOrderInquiry[]> =>
  adminRequest<BulkOrderInquiry[]>('/api/bulk-orders', { headers: adminHeaders(token) });

export const adminUpdateBulkStatus = async (token: string, id: string, status: any) =>
  adminRequest(`/api/bulk-orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH', headers: adminHeaders(token), body: JSON.stringify({ status })
  });

export const adminGetCustomers = async (token: string): Promise<CustomerRecord[]> =>
  adminRequest<CustomerRecord[]>('/api/customers', { headers: adminHeaders(token) });

export const adminSaveProduct = async (token: string, product: any) =>
  adminRequest<Product>('/api/products', {
    method: 'POST', headers: adminHeaders(token), body: JSON.stringify(product)
  });

export const adminUpdateProduct = async (token: string, id: string, product: any) =>
  adminRequest<Product>(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT', headers: adminHeaders(token), body: JSON.stringify(product)
  });

export const adminDeleteProduct = async (token: string, id: string) =>
  adminRequest<{ success: boolean }>(`/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE', headers: adminHeaders(token)
  });

export const adminUpdateSettings = async (token: string, settings: any) =>
  adminRequest('/api/settings', {
    method: 'PUT', headers: adminHeaders(token), body: JSON.stringify(settings)
  });
