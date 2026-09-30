import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CartItem } from '../../types';

interface WhatsAppOrderButtonProps {
  items?: CartItem[];
  customerName?: string;
  total?: number;
  orderId?: string;
  deliveryAddress?: string;
  className?: string;
  label?: string;
  variant?: 'primary' | 'outline' | 'subtle';
}

export const WhatsAppOrderButton: React.FC<WhatsAppOrderButtonProps> = ({
  items,
  customerName,
  total,
  orderId,
  deliveryAddress,
  className = '',
  label = 'Order via WhatsApp',
  variant = 'primary',
}) => {
  const storePhone = '916392855719'; // Standard international format without '+' or spaces

  const handleWhatsAppClick = () => {
    let message = `Assalam-o-Alaikum / Hello Muhammadi Egg Store,\n\n`;

    if (orderId) {
      message += `I want to check on my Order *#${orderId}*.\n`;
    } else {
      message += `I would like to place an order for delivery in Loni, Ghaziabad:\n\n`;
    }

    if (customerName) {
      message += `*Customer:* ${customerName}\n`;
    }

    if (items && items.length > 0) {
      message += `*Items:*\n`;
      items.forEach((item, idx) => {
        message += `${idx + 1}. ${item.productName} (${item.variantName || item.unit}) x ${item.quantity} = ₹${item.subtotal}\n`;
      });
      if (total !== undefined) {
        message += `\n*Total Amount:* ₹${total}\n`;
      }
    }

    if (deliveryAddress) {
      message += `*Delivery Address:* ${deliveryAddress}, Loni\n`;
    }

    message += `\nPlease confirm availability and dispatch time. Thank you!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${storePhone}?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const baseStyle =
    'min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs';

  const variantStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20',
    outline: 'border border-emerald-600 text-emerald-800 hover:bg-emerald-50 bg-white',
    subtle: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
  };

  return (
    <button
      type="button"
      onClick={handleWhatsAppClick}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-current shrink-0" />
      <span>{label}</span>
    </button>
  );
};
