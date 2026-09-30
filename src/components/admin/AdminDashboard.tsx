import React, { useState, useEffect } from 'react';
import {
  adminLogin,
  adminGetMetrics,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetBulkOrders,
  adminUpdateBulkStatus,
  adminGetCustomers,
  adminSaveProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  fetchProducts,
  adminUpdateSettings,
  fetchSettings
} from '../../services/api';
import { Product, Order, BulkOrderInquiry, CustomerRecord, AdminMetrics, OrderStatus, BulkInquiryStatus, StoreSettings } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Building2,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Phone,
  MessageCircle,
  AlertCircle,
  Lock,
  Loader2,
  TrendingUp,
  Clock,
  Truck,
  IndianRupee,
  RefreshCw,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mes_admin_token'));
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'bulk' | 'customers' | 'settings'>('overview');

  // Data States
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrderInquiry[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product Modal (Add/Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    tagline: '',
    description: '',
    category: 'Eggs' as 'Eggs' | 'Bakery',
    unit: 'Tray (30 Eggs)',
    price: 175,
    stockStatus: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock',
    stockQuantity: 200,
    minOrderQuantity: 50,
    image: '/src/assets/images/white_eggs_trays_1790536765513.jpg',
    isActive: true,
  });

  // Settings Form
  const [newPin, setNewPin] = useState('');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      const res = await adminLogin(pinInput);
      setToken(res.token);
      localStorage.setItem('mes_admin_token', res.token);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid PIN. Try store PIN (e.g. 6392)');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('mes_admin_token');
  };

  // Load Admin Data
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [m, p, o, b, c, s] = await Promise.all([
        adminGetMetrics(token).catch(() => null),
        fetchProducts(token).catch(() => []),
        adminGetOrders(token, orderStatusFilter, orderSearchQuery).catch(() => []),
        adminGetBulkOrders(token).catch(() => []),
        adminGetCustomers(token).catch(() => []),
        fetchSettings().catch(() => null)
      ]);
      setMetrics(m);
      setProducts(p);
      setOrders(o);
      setBulkOrders(b);
      setCustomers(c);
      setSettings(s);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, orderStatusFilter, orderSearchQuery]);

  // Order Status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    try {
      const updated = await adminUpdateOrderStatus(token, orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      setActionSuccess(`Order ${orderId} updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
      adminGetMetrics(token).then(setMetrics).catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // Bulk Status update
  const handleUpdateBulkStatus = async (id: string, newStatus: BulkInquiryStatus) => {
    if (!token) return;
    try {
      const updated = await adminUpdateBulkStatus(token, id, newStatus);
      setBulkOrders(prev => prev.map(b => b.id === id ? updated : b));
      setActionSuccess(`Bulk inquiry ${id} updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Product Add / Edit
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      tagline: '',
      description: '',
      category: 'Eggs',
      unit: 'Tray (30 Eggs)',
      price: 175,
      stockStatus: 'in_stock',
      stockQuantity: 500,
      minOrderQuantity: 50,
      image: '/src/assets/images/white_eggs_trays_1790536765513.jpg',
      isActive: true,
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      tagline: prod.tagline || '',
      description: prod.description || '',
      category: prod.category,
      unit: prod.unit,
      price: prod.price,
      stockStatus: prod.stockStatus,
      stockQuantity: prod.stockQuantity || 100,
      minOrderQuantity: prod.minOrderQuantity || 1,
      image: prod.image,
      isActive: prod.isActive !== false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingProduct) {
        const updated = await adminUpdateProduct(token, editingProduct.id, {
          ...productForm,
          price: Number(productForm.price),
          stockQuantity: Number(productForm.stockQuantity),
          minOrderQuantity: Number(productForm.minOrderQuantity),
        });
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
        setActionSuccess(`Updated ${productForm.name}`);
      } else {
        const created = await adminSaveProduct(token, {
          ...productForm,
          price: Number(productForm.price),
          stockQuantity: Number(productForm.stockQuantity),
          minOrderQuantity: Number(productForm.minOrderQuantity),
        });
        setProducts(prev => [...prev, created]);
        setActionSuccess(`Added ${productForm.name}`);
      }
      setIsProductModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await adminDeleteProduct(token, id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setActionSuccess(`Deleted ${name}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // If NOT logged in, show secure login prompt
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                MES
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Owner Dashboard Login</h3>
                <p className="text-[11px] text-neutral-500">Muhammadi Egg Store</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            {authError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Enter Store Management PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Default PIN: 6392"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-mono tracking-widest"
                />
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Store owner PIN is initialized to <strong>6392</strong> (last 4 digits of phone).
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying PIN...</span>
                </>
              ) : (
                <span>Access Store Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-emerald-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 border border-emerald-700 flex items-center justify-center font-bold text-amber-300 text-xs">
            MES
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Muhammadi Egg Store • Admin Dashboard</h1>
            <p className="text-[11px] text-emerald-200">Loni, Ghaziabad • Live Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="Refresh Data"
            className="p-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-emerald-950 text-white hover:bg-black min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Close Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-16 sm:w-56 bg-white border-r border-neutral-200 flex flex-col shrink-0">
          <nav className="p-2 sm:p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Orders</span>
              </div>
              {orders.length > 0 && (
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-neutral-950 font-bold font-mono">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Products & Pricing</span>
            </button>

            <button
              onClick={() => setActiveTab('bulk')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'bulk'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Bulk Inquiries</span>
              </div>
              {bulkOrders.filter(b => b.status === 'New').length > 0 && (
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold font-mono">
                  {bulkOrders.filter(b => b.status === 'New').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'customers'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Customers</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {actionSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Business Overview</h2>
                  <p className="text-xs text-neutral-500">Live activity metrics for Muhammadi Egg Store</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Today's Sales</span>
                    <IndianRupee className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-mono tabular-nums">
                    ₹{metrics?.todaySales || 0}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">From delivered/active orders</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Pending Orders</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
                    {metrics?.pendingOrdersCount || 0}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">To confirm / prepare</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Out for Delivery</span>
                    <Truck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 font-mono tabular-nums">
                    {metrics?.outForDeliveryCount || 0}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">On delivery in Loni</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>New Bulk Leads</span>
                    <Building2 className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-rose-600 font-mono tabular-nums">
                    {metrics?.bulkInquiriesCount || 0}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Wholesale quote requests</p>
                </div>
              </div>

              {/* Quick Action Tables in Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-neutral-900">Recent Customer Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-emerald-800 hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 5).map((o) => (
                      <div
                        key={o.id}
                        className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs cursor-pointer hover:border-emerald-400 transition-colors"
                        onClick={() => setSelectedOrder(o)}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-neutral-900">{o.id}</span>
                            <StatusBadge status={o.status} size="sm" />
                          </div>
                          <p className="text-neutral-600 mt-1">
                            {o.customer.name} • {o.delivery.locality}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-neutral-900">₹{o.total}</div>
                          <div className="text-[10px] text-neutral-400">{o.items.length} item(s)</div>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-xs text-neutral-400 py-4 text-center">No orders placed yet.</p>
                    )}
                  </div>
                </div>

                {/* Products & Inventory Quick Look */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-neutral-900">Catalog Inventory & Rates</h3>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-semibold text-emerald-800 hover:underline"
                    >
                      Manage Products →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-neutral-100" />
                          <div>
                            <h4 className="font-bold text-neutral-900">{p.name}</h4>
                            <p className="text-neutral-500">{p.unit} • Stock: {p.stockQuantity} units</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-sm text-neutral-900">₹{p.price}</div>
                          <button
                            onClick={() => openEditProduct(p)}
                            className="text-[11px] font-semibold text-emerald-800 hover:underline"
                          >
                            Edit Price
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Customer Orders</h2>
                  <p className="text-xs text-neutral-500">Manage orders, update live delivery status, and contact customers</p>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-neutral-200">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order ID, name, phone, locality..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['all', 'Order Received', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        orderStatusFilter === st
                          ? 'bg-emerald-800 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Order ID / Date</th>
                        <th className="px-4 py-3">Customer & Phone</th>
                        <th className="px-4 py-3">Address (Loni)</th>
                        <th className="px-4 py-3">Items</th>
                        <th className="px-4 py-3">Total / Payment</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/70">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-neutral-900 whitespace-nowrap">
                            <div>{o.id}</div>
                            <div className="text-[10px] text-neutral-400 font-normal">
                              {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-neutral-900">{o.customer.name}</div>
                            <div className="text-neutral-500 font-mono text-[11px] flex items-center gap-1">
                              <span>{o.customer.phone}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-[200px] truncate">
                            <div className="truncate text-neutral-900">{o.delivery.address}</div>
                            <div className="text-[11px] text-neutral-500 font-medium">{o.delivery.locality}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold">{o.items.length} item(s)</span>
                            <div className="text-[11px] text-neutral-500 truncate max-w-[150px]">
                              {o.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-mono font-bold text-neutral-900 text-sm">₹{o.total}</div>
                            <div className="text-[10px] text-neutral-500">
                              {o.paymentMethod === 'upi_on_delivery' ? 'UPI on Delivery' : 'Cash on Delivery'}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <StatusBadge status={o.status} size="sm" />
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-[11px]"
                            >
                              Details
                            </button>

                            {/* Direct WhatsApp Call link */}
                            <a
                              href={`https://wa.me/${o.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${o.customer.name}, regarding your order ${o.id} from Muhammadi Egg Store:`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 inline-flex items-center justify-center rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              title="WhatsApp Customer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                            No orders matching the current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Products, Stock & Pricing</h2>
                  <p className="text-xs text-neutral-500">Update rates, change stock availability, or add new egg/bakery items</p>
                </div>
                <button
                  onClick={openAddProduct}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col shadow-2xs">
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 mb-3 relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.isActive ? 'bg-emerald-100 text-emerald-900' : 'bg-neutral-200 text-neutral-600'}`}>
                          {p.isActive ? 'Active in Store' : 'Hidden'}
                        </span>
                        {p.stockStatus === 'low_stock' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-neutral-900 text-sm">{p.name}</h3>
                    <p className="text-xs text-neutral-500 mb-2">{p.tagline || p.unit}</p>

                    <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-neutral-400">Current Rate:</span>
                        <div className="font-mono text-lg font-extrabold text-neutral-900">
                          ₹{p.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BULK INQUIRIES */}
          {activeTab === 'bulk' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Bulk & Commercial Inquiries</h2>
                  <p className="text-xs text-neutral-500">Incoming wholesale requests from restaurants, bakeries, gyms & caterers</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Inquiry ID / Date</th>
                        <th className="px-4 py-3">Customer / Business</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Required Supply</th>
                        <th className="px-4 py-3">Location & Start Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/70">
                      {bulkOrders.map((b) => (
                        <tr key={b.id} className="hover:bg-neutral-50/60">
                          <td className="px-4 py-3 font-mono font-bold whitespace-nowrap">
                            <div>{b.id}</div>
                            <div className="text-[10px] text-neutral-400 font-normal">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-neutral-900">{b.customerName}</div>
                            <div className="text-neutral-500 text-[11px]">{b.businessName} ({b.businessType})</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-mono">{b.phone}</div>
                            <div className="flex gap-2 mt-1">
                              <a
                                href={`tel:${b.phone}`}
                                className="inline-flex items-center gap-1 text-[10px] text-neutral-600 hover:text-emerald-700"
                              >
                                <Phone className="w-3 h-3 text-emerald-700" /> Call
                              </a>
                              <a
                                href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${b.customerName}, regarding your bulk egg supply request for ${b.businessName} from Muhammadi Egg Store:`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-800"
                              >
                                <MessageCircle className="w-3 h-3" /> WhatsApp
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-neutral-900">{b.requiredProduct}</div>
                            <div className="text-neutral-600 font-mono text-[11px]">{b.requiredQuantity} • {b.frequency}</div>
                            {b.additionalRequirements && (
                              <p className="text-[10px] text-neutral-400 italic mt-0.5 truncate max-w-xs">{b.additionalRequirements}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div>{b.deliveryLocation}</div>
                            <div className="text-[10px] text-neutral-400">{b.preferredDate}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <StatusBadge status={b.status} size="sm" />
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBulkStatus(b.id, e.target.value as BulkInquiryStatus)}
                              className="px-2 py-1 rounded border border-neutral-300 text-xs bg-white focus:outline-none"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Quoted">Quoted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {bulkOrders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                            No bulk requests received yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Customer Directory</h2>
                <p className="text-xs text-neutral-500">Repeated customers, addresses & lifetime spend</p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Customer Name</th>
                        <th className="px-4 py-3">Phone / WhatsApp</th>
                        <th className="px-4 py-3">Saved Address (Loni)</th>
                        <th className="px-4 py-3">Orders Count</th>
                        <th className="px-4 py-3">Total Spend</th>
                        <th className="px-4 py-3">Last Order</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/70">
                      {customers.map((c) => (
                        <tr key={c.phone} className="hover:bg-neutral-50/60">
                          <td className="px-4 py-3 font-semibold text-neutral-900">{c.name}</td>
                          <td className="px-4 py-3 font-mono">{c.phone}</td>
                          <td className="px-4 py-3 max-w-xs truncate text-neutral-600">{c.address}</td>
                          <td className="px-4 py-3 font-bold font-mono text-neutral-900">{c.totalOrders}</td>
                          <td className="px-4 py-3 font-bold font-mono text-emerald-900">₹{c.totalSpend}</td>
                          <td className="px-4 py-3 text-neutral-400 text-[11px]">
                            {new Date(c.lastOrderAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                            No customers registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-5">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Store Settings</h2>
                <p className="text-xs text-neutral-500">Operational configuration for Muhammadi Egg Store</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Official Business Name</label>
                  <input
                    type="text"
                    disabled
                    value={settings?.storeName || 'Muhammadi Egg Store'}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Official Phone Number</label>
                  <input
                    type="text"
                    disabled
                    value={settings?.phone || '+91 639 2855 719'}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Official phone number as per business requirements.</p>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Current Service Area</label>
                  <input
                    type="text"
                    disabled
                    value={settings?.serviceArea || 'Loni, Ghaziabad, Uttar Pradesh, India'}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Current delivery coverage is strictly Loni, Ghaziabad.</p>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <h3 className="font-bold text-neutral-900 mb-2">Change Management PIN</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Enter new 4-6 digit PIN"
                      className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 font-mono text-sm"
                    />
                    <button
                      onClick={async () => {
                        if (!newPin || newPin.length < 4) {
                          alert('PIN must be at least 4 digits');
                          return;
                        }
                        try {
                          await adminUpdateSettings(token!, { adminPin: newPin });
                          alert('Admin PIN updated! Next time please use this new PIN.');
                          setNewPin('');
                        } catch (e: any) {
                          alert(e.message || 'Failed to update PIN');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                    >
                      Update PIN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Details Modal (when viewing single order in admin) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="font-mono font-bold text-sm text-neutral-900">{selectedOrder.id}</span>
                <p className="text-[11px] text-neutral-400">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Change Status Fast Buttons */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Change Order Status:</label>
              <div className="flex flex-wrap gap-1.5">
                {(['Order Received', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedOrder.status === st
                        ? 'bg-emerald-800 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-3 rounded-xl bg-neutral-50 space-y-1">
              <div className="font-bold text-neutral-900">{selectedOrder.customer.name}</div>
              <div className="text-neutral-600 font-mono">Mobile: {selectedOrder.customer.phone}</div>
              <div className="text-neutral-600 font-mono">WhatsApp: {selectedOrder.customer.whatsapp}</div>
              <div className="pt-2 border-t border-neutral-200">
                <span className="font-semibold text-neutral-700">Delivery Address:</span>
                <p className="text-neutral-900">{selectedOrder.delivery.address}, {selectedOrder.delivery.locality}</p>
                {selectedOrder.delivery.landmark && (
                  <p className="text-neutral-500">Landmark: {selectedOrder.delivery.landmark}</p>
                )}
                {selectedOrder.delivery.instructions && (
                  <p className="text-amber-800 font-medium">Note: {selectedOrder.delivery.instructions}</p>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-bold text-neutral-900 mb-2">Ordered Items ({selectedOrder.items.length})</h4>
              <div className="space-y-1.5">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-neutral-100">
                    <div>
                      <span className="font-semibold text-neutral-900">{it.productName}</span>
                      {it.variantName && <span className="text-neutral-500 ml-1">({it.variantName})</span>}
                      <span className="text-neutral-400 ml-2 font-mono">x {it.quantity}</span>
                    </div>
                    <span className="font-mono font-bold tabular-nums">₹{it.subtotal}</span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between font-extrabold text-sm text-neutral-900">
                  <span>Total Amount</span>
                  <span className="font-mono text-emerald-900 text-base">₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <a
                href={`tel:${selectedOrder.customer.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Customer</span>
              </a>
              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${selectedOrder.customer.name}, Muhammadi Egg Store here regarding your order #${selectedOrder.id}:`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingProduct ? 'Edit Product / Price' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Fresh Farm Egg Tray"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={productForm.tagline}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  placeholder="e.g. Grade-A Daily Fresh Poultry Eggs"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white"
                  >
                    <option value="Eggs">Eggs</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Unit Description</label>
                  <input
                    type="text"
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="Tray (30 Eggs) / Loaf (400g)"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="175"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                    placeholder="100"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Stock Status</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white"
                  >
                    <option value="in_stock">Available (In Stock)</option>
                    <option value="low_stock">Limited (Low Stock)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Min Order Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={productForm.minOrderQuantity}
                    onChange={(e) => setProductForm({ ...productForm, minOrderQuantity: Number(e.target.value) })}
                    placeholder="e.g. 50 (Eggs) or 25 (Bread/Buns)"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Clean direct-from-farm poultry eggs..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={productForm.isActive}
                  onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-700"
                />
                <label htmlFor="isActiveCheck" className="text-xs text-neutral-700 font-medium">
                  Visible to customers in store
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
