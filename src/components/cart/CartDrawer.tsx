import React from 'react';
import { useCart } from '../../context/CartContext';
import { QuantitySelector } from '../common/QuantitySelector';
import { WhatsAppOrderButton } from '../common/WhatsAppOrderButton';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-neutral-900">Your Basket</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-75" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mt-1 mb-6">
                  Add fresh farm egg trays, Britannia white bread, or regular buns for quick delivery in Loni, Ghaziabad.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
                >
                  Browse Fresh Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-neutral-200/90 bg-neutral-50/30 flex gap-3 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {item.productName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center rounded"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.variantName && (
                      <p className="text-[11px] text-neutral-500">{item.variantName}</p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <QuantitySelector
                        quantity={item.quantity}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        min={1}
                        size="sm"
                      />

                      <div className="text-right">
                        <span className="text-xs text-neutral-400 font-mono">
                          ₹{item.unitPrice} x {item.quantity} =
                        </span>
                        <span className="ml-1 text-sm font-bold text-neutral-900 font-mono tabular-nums">
                          ₹{item.subtotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-white space-y-3">
              {/* Order breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-900">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery in Loni</span>
                  <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                    {deliveryFee === 0 ? 'FREE Local Delivery' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-base font-extrabold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-emerald-900 text-lg">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Service area reassurance & Wholesale MOQ notice */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-200/80 p-2 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Wholesale Supply: 100% White Eggs (Min 50 Trays), Britannia Bread & Buns (Min 25 Pcs).</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Serving Loni, Ghaziabad • Pay Cash or UPI on delivery</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-900/10 active:scale-98 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <WhatsAppOrderButton
                  items={items}
                  total={total}
                  label="Quick Order via WhatsApp"
                  variant="outline"
                  className="w-full"
                />

                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs text-neutral-500 hover:text-neutral-800 font-medium py-1"
                  >
                    ← Continue Shopping
                  </button>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium py-1"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
