import React from 'react';
import { useCart } from '../../context/CartContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { ShoppingBag, Lock, Phone } from 'lucide-react';

interface NavbarProps {
  activeView: 'home' | 'products' | 'bulk' | 'track' | 'contact';
  onNavigate: (view: 'home' | 'products' | 'bulk' | 'track' | 'contact') => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onNavigate, onOpenAdmin }) => {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group flex items-center gap-2 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-extrabold text-xs shadow-xs tracking-tight">
            MES
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-900 group-hover:text-emerald-800 transition-colors">
            Muhammadi Egg Store
          </span>
        </button>

        {/* Zone 2: 4-6 Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-600">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-emerald-800 ${
              activeView === 'home' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('products')}
            className={`transition-colors hover:text-emerald-800 ${
              activeView === 'products' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            Products
          </button>
          <button
            onClick={() => onNavigate('bulk')}
            className={`transition-colors hover:text-emerald-800 ${
              activeView === 'bulk' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            Bulk Orders
          </button>
          <button
            onClick={() => onNavigate('track')}
            className={`transition-colors hover:text-emerald-800 ${
              activeView === 'track' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            Track Order
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors hover:text-emerald-800 ${
              activeView === 'contact' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Cart Icon Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative min-h-[44px] min-w-[44px] p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-900" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-700 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </button>

          {/* Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-neutral-600 hover:text-neutral-900 text-xs font-medium transition-colors"
            title="Owner Dashboard"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Owner</span>
          </button>
        </div>
      </div>
    </header>
  );
};
