import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { fetchProducts, fetchSettings } from './services/api';
import { Product, Order, StoreSettings } from './types';
import { Navbar } from './components/navigation/Navbar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { ProductCard } from './components/products/ProductCard';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/orders/OrderConfirmationModal';
import { OrderStatusView } from './components/orders/OrderStatusView';
import { BulkOrderSection } from './components/bulk/BulkOrderSection';
import { ContactPage } from './components/contact/ContactPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import {
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Layers,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

function StoreApp() {
  const [activeView, setActiveView] = useState<'home' | 'products' | 'bulk' | 'track' | 'contact'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Eggs' | 'Bakery'>('All');

  // Modals & Tracking
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingParams, setTrackingParams] = useState<{ orderId: string; phone: string }>({
    orderId: '',
    phone: '',
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const { addToCart, setIsCartOpen } = useCart();

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prods, sett] = await Promise.all([
        fetchProducts(),
        fetchSettings()
      ]);
      setProducts(prods);
      setSettings(sett);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter products by category
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  // Promotional egg tray
  const promoProduct = products.find((p) => p.isPromotional) || products[0];

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
  };

  const handleNavigateToTrack = (orderId: string, phone: string) => {
    setTrackingParams({ orderId, phone });
    setActiveView('track');
  };

  const officialPhoneDisplay = '+91 639 2855 719';
  const officialWhatsApp = '916392855719';

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col pb-20 md:pb-6">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* --- VIEW 1: HOME --- */}
        {activeView === 'home' && (
          <div className="space-y-10">
            {/* HERO SECTION */}
            <section className="relative bg-emerald-950 text-white overflow-hidden py-10 sm:py-16 px-4 sm:px-6">
              {/* Subtle ambient light */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-4">
                  {/* Service Area Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700 text-xs text-emerald-200 font-semibold tracking-wide shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Serving Loni, Ghaziabad</span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                      Muhammadi Egg Store
                    </h1>
                    <p className="text-lg sm:text-xl font-bold text-amber-300 mt-1">
                      Fresh Eggs Supplier
                    </p>
                  </div>

                  <p className="text-base sm:text-lg font-medium text-emerald-100 max-w-xl leading-relaxed">
                    “Fresh eggs. Reliable supply. Zero tension.”
                  </p>

                  <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl">
                    Direct-from-farm 100% white eggs only, Britannia white bread (medium pack), and regular buns (2-pack transparent pack). Minimum wholesale supply: 50 egg trays, 25 bread pieces, 25 bun packs across Loni.
                  </p>

                  {/* CTAs */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('products');
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="min-h-[48px] px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <span>Order Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent('Assalam-o-Alaikum! Hello Muhammadi Egg Store, I need white eggs supply in Loni, Ghaziabad.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[48px] px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 border border-emerald-600/60 shadow-xs transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>WhatsApp Us</span>
                    </a>

                    <a
                      href="tel:+916392855719"
                      className="min-h-[48px] px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm flex items-center gap-1.5 transition-all"
                    >
                      <Phone className="w-4 h-4 text-emerald-300" />
                      <span className="font-mono">{officialPhoneDisplay}</span>
                    </a>
                  </div>

                  {/* Micro features banner */}
                  <div className="pt-4 border-t border-emerald-800/80 grid grid-cols-3 gap-2 text-xs text-emerald-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>White Eggs Only</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Min 50 Trays / 25 Pcs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Cash / UPI on Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Hero Showcase Image */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-800/60 bg-emerald-900 aspect-16/10 lg:aspect-4/3">
                    <img
                      src="/src/assets/images/white_eggs_trays_1790536765513.jpg"
                      alt="Muhammadi Egg Store fresh white egg trays"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white text-xs">
                        <span className="font-bold text-amber-300">100% White Eggs Only • Pure Fresh Farm Stock</span>
                        <p className="text-emerald-100 text-[11px]">Strict quality control • Clean sturdy trays (Min 50 Trays)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURED PROMOTIONAL BANNER (EGG TRAY - 30 EGGS) */}
            {promoProduct && (
              <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 rounded-2xl border border-amber-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={promoProduct.image}
                      alt={promoProduct.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-white border border-amber-200 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider bg-amber-200 px-2 py-0.5 rounded">
                        <Sparkles className="w-3 h-3" />
                        Today's Store Featured Rate
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 mt-1">
                        Egg Tray — 30 White Eggs
                      </h2>
                      <p className="text-xs text-neutral-600 max-w-md mt-0.5">
                        100% pure white eggs only (zero brown eggs). Clean, unwashed grade-A eggs in sturdy 30-egg trays. Minimum supply order: 50 trays (1,500 white eggs). Single tray retail not sold.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-amber-200">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-neutral-500 font-medium block">Current Rate</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
                        ₹{promoProduct.price}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium ml-1">/ tray</span>
                      <span className="text-[10px] text-amber-800 font-bold block">Min. 50 Trays = ₹{promoProduct.price * 50}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(promoProduct, promoProduct.variants?.[0], 1)}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors active:scale-95"
                    >
                      <span>Order 50 Trays (Min)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* PRODUCT CATALOG PREVIEW */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                    Fresh Produce & Bakery
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    Select retail packs, full 30-egg trays, or bulk quantities for fast dispatch across Loni
                  </p>
                </div>

                {/* Filter Controls (Functional Button Tabs) */}
                <div className="flex items-center gap-1 p-1 bg-neutral-200/70 rounded-xl w-fit">
                  {(['All', 'Eggs', 'Bakery'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {cat === 'All' ? 'All Items' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* BULK ORDERS PROMO SECTION */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                <div className="max-w-2xl relative z-10 space-y-3">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded">
                    B2B & Commercial Supply
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Need eggs in bulk? We’ll handle the supply.
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Reliable morning supply for Restaurants, Cafés, Bakeries, Gyms, Caterers, Messes, and Wedding kitchens in Loni. Wholesale rates with guaranteed freshness.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('bulk');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm transition-colors"
                    >
                      Request Bulk Supply
                    </button>
                    <a
                      href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent('Assalam-o-Alaikum! I want to inquire about bulk eggs supply for my business in Loni.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Inquiries</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* TRUST & SERVICE REASSURANCE */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    🥚
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm">Always 30 Eggs per Tray</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Zero compromises on count. Grade-A eggs packed in secure commercial trays.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    🚚
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm">Serving Loni, Ghaziabad</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Fast delivery across Sangam Vihar, Balram Nagar, Tronica City, Loni Border, and nearby localities.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    🤝
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm">Zero Tension Payment</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Check egg freshness at your doorstep before paying via Cash or UPI (GPay/PhonePe).
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- VIEW 2: PRODUCTS --- */}
        {activeView === 'products' && (
          <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                  Product Catalog
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Fresh Farm Eggs, Britannia White Bread & Regular Buns (2-Pack) • Serving Loni, Ghaziabad
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-200/80 rounded-xl w-fit">
                {(['All', 'Eggs', 'Bakery'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {cat === 'All' ? 'All Items' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW 3: BULK ORDERS --- */}
        {activeView === 'bulk' && <BulkOrderSection />}

        {/* --- VIEW 4: TRACK ORDER --- */}
        {activeView === 'track' && (
          <OrderStatusView
            initialOrderId={trackingParams.orderId}
            initialPhone={trackingParams.phone}
          />
        )}

        {/* --- VIEW 5: CONTACT --- */}
        {activeView === 'contact' && (
          <ContactPage
            onOrderNow={() => {
              setActiveView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-white border-t border-neutral-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-xs">
              MES
            </div>
            <div>
              <span className="font-bold text-neutral-900">Muhammadi Egg Store</span>
              <span className="mx-2">·</span>
              <span>Fresh Eggs Supplier</span>
              <span className="mx-2">·</span>
              <span className="font-semibold text-emerald-800">Serving Loni, Ghaziabad</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+916392855719"
              className="font-mono font-bold text-neutral-900 hover:text-emerald-800 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>+91 639 2855 719</span>
            </a>
            <span className="text-neutral-300">|</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-neutral-400 hover:text-neutral-700"
            >
              Store Owner Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal onOrderSuccess={handleOrderSuccess} />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={handleNavigateToTrack}
      />

      {/* Admin Dashboard */}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}

      {/* Offline Connectivity Toast Indicator */}
      <OfflineIndicator />

      {/* Mobile Bottom Tab Bar */}
      <MobileBottomNav
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StoreApp />
    </CartProvider>
  );
}
