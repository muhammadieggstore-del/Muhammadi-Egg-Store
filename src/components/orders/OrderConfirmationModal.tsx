import React from 'react';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { WhatsAppOrderButton } from '../common/WhatsAppOrderButton';
import { CheckCircle2, Phone, MapPin, Package, ArrowRight, X } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string, phone: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Success Banner */}
        <div className="bg-emerald-800 text-white p-6 text-center relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-emerald-200 hover:text-white p-1 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-amber-300" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">Order Confirmed!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Thank you for ordering from Muhammadi Egg Store.
          </p>

          <div className="mt-3 inline-block bg-white/15 px-3 py-1 rounded-lg">
            <span className="text-xs text-emerald-200 font-medium">Order ID: </span>
            <span className="text-sm font-mono font-bold tracking-wide text-white">
              {order.id}
            </span>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Current Status Box */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
            <div>
              <span className="text-neutral-500 font-medium">Current Status:</span>
              <div className="mt-1">
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 font-medium">Payment:</span>
              <div className="mt-1 font-semibold text-neutral-800">
                {order.paymentMethod === 'upi_on_delivery' ? 'UPI on Delivery' : 'Cash on Delivery'}
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div>
            <h3 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5 text-xs">
              <Package className="w-3.5 h-3.5 text-emerald-700" />
              Items Ordered ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50/70 border border-neutral-100"
                >
                  <div>
                    <span className="font-bold text-neutral-900">{item.productName}</span>
                    {item.variantName && (
                      <span className="text-neutral-500 ml-1">({item.variantName})</span>
                    )}
                    <span className="text-neutral-400 ml-2 font-mono">x {item.quantity}</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-neutral-900">
                    ₹{item.subtotal}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-200 flex justify-between items-center text-sm font-extrabold text-neutral-900">
              <span>Total Amount</span>
              <span className="font-mono text-emerald-900 text-base">₹{order.total}</span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <h4 className="font-bold text-emerald-950 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-700" />
              Delivery Destination
            </h4>
            <p className="text-neutral-700">{order.customer.name}</p>
            <p className="text-neutral-600 mt-0.5">{order.delivery.address}</p>
            <p className="text-neutral-500 font-medium">{order.delivery.locality}</p>
            {order.delivery.landmark && (
              <p className="text-neutral-500">Landmark: {order.delivery.landmark}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onTrackOrder(order.id, order.customer.phone);
              }}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Track Live Order Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <WhatsAppOrderButton
                orderId={order.id}
                customerName={order.customer.name}
                deliveryAddress={order.delivery.address}
                items={order.items}
                total={order.total}
                label="WhatsApp Store"
                variant="primary"
                className="w-full"
              />

              <a
                href="tel:+916392855719"
                className="min-h-[44px] py-2.5 px-4 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
