import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/api';
import { Order } from '../../types';
import { X, MapPin, Phone, User, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  onOrderSuccess: (order: Order) => void;
}

const LONI_LOCALITIES = [
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
  'Banthla Road',
  'Other Loni Address',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onOrderSuccess }) => {
  const { items, subtotal, deliveryFee, total, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [locality, setLocality] = useState('Sangam Vihar');
  const [customLocality, setCustomLocality] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi_on_delivery'>('cod');

  // Request state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number');
      return;
    }

    const finalLocality = locality === 'Other Loni Address' ? (customLocality.trim() || 'Loni, Ghaziabad') : `${locality}, Loni`;
    if (!address.trim()) {
      setErrorMessage('Please enter your street address / house number');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your basket is empty. Please add items before placing order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: fullName.trim(),
          phone: phone.trim(),
          whatsapp: sameAsPhone ? phone.trim() : (whatsapp.trim() || phone.trim()),
        },
        delivery: {
          address: address.trim(),
          locality: finalLocality,
          landmark: landmark.trim(),
          instructions: instructions.trim(),
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          variantName: item.variantName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
          image: item.image,
        })),
        paymentMethod,
        notes: instructions.trim(),
      };

      const createdOrder = await createOrder(orderPayload);
      clearCart();
      setIsCheckoutOpen(false);
      onOrderSuccess(createdOrder);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          'Your order could not be submitted. Please contact Muhammadi Egg Store on WhatsApp or +91 639 2855 719.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60 shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Complete Delivery Order</h2>
            <p className="text-xs text-neutral-500">Muhammadi Egg Store • Serving Loni, Ghaziabad</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to place order</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              1. Customer Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mohammad Rizwan / Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-neutral-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={14}
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-neutral-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    disabled={sameAsPhone}
                    value={sameAsPhone ? phone : whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={14}
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-mono disabled:bg-neutral-50 disabled:text-neutral-500"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => setSameAsPhone(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-neutral-300"
              />
              <span className="text-xs text-neutral-600 font-medium">
                WhatsApp number is same as mobile number
              </span>
            </label>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              2. Delivery Address in Loni, Ghaziabad
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Area / Locality in Loni <span className="text-rose-500">*</span>
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
              >
                {LONI_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {locality === 'Other Loni Address' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Specify Locality Name in Loni <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customLocality}
                  onChange={(e) => setCustomLocality(e.target.value)}
                  placeholder="e.g. Mustafabad Border / Sabhapur / Gali No..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Street Address / House / Flat No. <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No., Building, Gali/Street name..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Jama Masjid / Primary School"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Delivery Instructions
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Call before coming, 2nd floor"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Options */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              3. Payment Option (On Delivery)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 text-emerald-700"
                />
                <div>
                  <div className="text-xs font-bold">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-neutral-500">Pay cash upon receiving fresh eggs</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'upi_on_delivery'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi_on_delivery"
                  checked={paymentMethod === 'upi_on_delivery'}
                  onChange={() => setPaymentMethod('upi_on_delivery')}
                  className="w-4 h-4 text-emerald-700"
                />
                <div>
                  <div className="text-xs font-bold">Pay via UPI on Delivery</div>
                  <div className="text-[11px] text-neutral-500">Scan QR via GPay / PhonePe / Paytm</div>
                </div>
              </label>
            </div>
            <p className="text-[11px] text-neutral-500">
              * Note: We do not take upfront card payments online. Verify egg tray freshness at your doorstep before paying!
            </p>
          </div>

          {/* Section 4: Summary Preview */}
          <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200/90 text-[11px] text-amber-900 leading-snug">
            <span className="font-bold">Wholesale Minimums Apply:</span> White Eggs (min. 50 trays), Britannia Bread (min. 25 pcs), Regular Buns (min. 25 packs). Single quantity sales are not supported.
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-xs space-y-1.5">
            <div className="flex justify-between text-neutral-600">
              <span>{items.length} product(s) in order</span>
              <span className="font-mono tabular-nums font-semibold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery in Loni</span>
              <span className="font-semibold text-emerald-800">FREE</span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-900">
              <span>Total Payable</span>
              <span className="font-mono tabular-nums text-emerald-900 text-base">₹{total}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Placing Your Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Place Order • ₹{total}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
