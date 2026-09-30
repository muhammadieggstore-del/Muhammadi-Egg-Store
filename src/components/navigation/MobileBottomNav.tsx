import React from 'react';
import { useCart } from '../../context/CartContext';
import { Home, Package, Building2, Clock, Phone, ShoppingBag, ArrowRight } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: 'home' | 'products' | 'bulk' | 'track' | 'contact';
  onNavigate: (view: 'home' | 'products' | 'bulk' | 'track' | 'contact') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeView, onNavigate }) => {
  const { itemCount, total, setIsCartOpen } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
      {/* Floating cart bar preview if user has added items */}
      {itemCount > 0 && (
        <div className="px-3 pb-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-800 text-white rounded-xl py-2.5 px-4 flex items-center justify-between shadow-lg shadow-emerald-950/20 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-semibold">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in basket
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="font-mono text-amber-300">₹{total}</span>
              <span>• View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Main Tab Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-neutral-200/90 grid grid-cols-5 h-14 items-center">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeView === 'home' ? 'text-emerald-800 font-bold' : 'text-neutral-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('products')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeView === 'products' ? 'text-emerald-800 font-bold' : 'text-neutral-500'
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 tracking-tight">Products</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('bulk')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeView === 'bulk' ? 'text-emerald-800 font-bold' : 'text-neutral-500'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 tracking-tight">Bulk</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('track')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeView === 'track' ? 'text-emerald-800 font-bold' : 'text-neutral-500'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 tracking-tight">Orders</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeView === 'contact' ? 'text-emerald-800 font-bold' : 'text-neutral-500'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 tracking-tight">Contact</span>
        </button>
      </nav>
    </div>
  );
};
