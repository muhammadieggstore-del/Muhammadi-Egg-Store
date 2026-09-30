import React, { useState } from 'react';
import { trackOrder } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { WhatsAppOrderButton } from '../common/WhatsAppOrderButton';
import { Search, Package, MapPin, CheckCircle2, Clock, Truck, AlertCircle, Phone, Loader2 } from 'lucide-react';

interface OrderStatusViewProps {
  initialOrderId?: string;
  initialPhone?: string;
}

const ORDER_STEPS: OrderStatus[] = [
  'Order Received',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

export const OrderStatusView: React.FC<OrderStatusViewProps> = ({
  initialOrderId = '',
  initialPhone = '',
}) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // If initial values are provided, trigger tracking automatically
  React.useEffect(() => {
    if (initialOrderId && initialPhone) {
      handleSearch(initialOrderId, initialPhone);
    }
  }, [initialOrderId, initialPhone]);

  const handleSearch = async (idToUse?: string, phoneToUse?: string) => {
    const searchId = (idToUse || orderId).trim();
    const searchPhone = (phoneToUse || phone).trim();

    if (!searchId) {
      setError('Please enter your Order ID (e.g. MES-20260927-001)');
      return;
    }
    if (!searchPhone) {
      setError('Please enter the 10-digit mobile number used when ordering');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await trackOrder(searchId, searchPhone);
      setOrder(data);
    } catch (err: any) {
      setError(
        err.message ||
          'Order not found. Please check your Order ID and Phone Number, or WhatsApp Muhammadi Egg Store directly.'
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return ORDER_STEPS.indexOf(status);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;
  const isCancelled = order?.status === 'Cancelled';

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 sm:px-6">
      {/* Search Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-5 h-5 text-emerald-800" />
          <h2 className="text-lg font-bold text-neutral-900">Track Your Order Status</h2>
        </div>
        <p className="text-xs text-neutral-500 mb-4">
          Enter your Order ID and phone number to see live preparation & delivery progress.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="MES-20260927-001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Checking Status...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to find order</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Result Card */}
      {order && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden mb-6">
          {/* Top Banner */}
          <div className="p-5 border-b border-neutral-100 bg-neutral-50/60 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium">Order ID:</span>
                <span className="font-mono font-bold text-sm text-neutral-900">{order.id}</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <StatusBadge status={order.status} size="md" />
          </div>

          {/* Stepper (Unless cancelled) */}
          {!isCancelled ? (
            <div className="p-5 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-4">
                Delivery Progress
              </h3>

              <div className="relative">
                {/* Horizontal Progress line for desktop / vertical for small screen */}
                <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between relative">
                  {ORDER_STEPS.map((step, idx) => {
                    const isDone = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div
                        key={step}
                        className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 flex-1 relative z-10"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isDone
                              ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                              : 'bg-neutral-200 text-neutral-500'
                          } ${isCurrent ? 'ring-amber-300 ring-4' : ''}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div className="text-left sm:text-center">
                          <span
                            className={`block text-xs ${
                              isCurrent
                                ? 'font-bold text-emerald-950'
                                : isDone
                                ? 'font-medium text-neutral-800'
                                : 'text-neutral-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 border-b border-neutral-100 bg-rose-50/50 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="text-xs text-rose-800">
                <span className="font-bold">This order was cancelled.</span> If you need assistance, please contact Muhammadi Egg Store on WhatsApp or +91 639 2855 719.
              </div>
            </div>
          )}

          {/* Timeline Notes if any */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/30">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
                Activity Log
              </h4>
              <div className="space-y-2 text-xs">
                {order.timeline.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-neutral-900">{entry.status}</span>
                      <span className="text-neutral-400 text-[11px] ml-2 font-mono">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {entry.note && (
                        <p className="text-neutral-600 text-[11px] mt-0.5">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Content Summary */}
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-700" />
                Items
              </h4>
              <div className="space-y-1.5 text-xs">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-neutral-800">
                      {it.productName} {it.variantName && `(${it.variantName})`} x {it.quantity}
                    </span>
                    <span className="font-mono font-bold tabular-nums text-neutral-900">
                      ₹{it.subtotal}
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-neutral-200 flex justify-between items-center font-bold text-sm">
                  <span>Total Amount</span>
                  <span className="font-mono text-emerald-900 text-base">₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="pt-3 border-t border-neutral-100 text-xs">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                Delivery Address
              </h4>
              <p className="text-neutral-800 font-medium">{order.customer.name}</p>
              <p className="text-neutral-600">{order.delivery.address}</p>
              <p className="text-neutral-500">{order.delivery.locality}</p>
            </div>

            {/* Support Actions */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <WhatsAppOrderButton
                orderId={order.id}
                customerName={order.customer.name}
                label="WhatsApp Store About Order"
                variant="primary"
                className="w-full"
              />

              <a
                href="tel:+916392855719"
                className="min-h-[44px] py-2 px-3 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call +91 639 2855 719</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* No query yet state */}
      {!order && !loading && !hasSearched && (
        <div className="text-center py-8 text-neutral-400 text-xs">
          <p>Have an order with us? Enter your details above to check real-time progress.</p>
        </div>
      )}
    </div>
  );
};
