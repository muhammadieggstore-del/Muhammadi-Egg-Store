import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

interface ContactButtonsProps {
  layout?: 'row' | 'col';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPhoneText?: boolean;
}

export const ContactButtons: React.FC<ContactButtonsProps> = ({
  layout = 'row',
  size = 'md',
  className = '',
  showPhoneText = true,
}) => {
  const officialPhoneDisplay = '+91 639 2855 719';
  const officialPhoneTel = '+916392855719';
  const officialWhatsApp = '916392855719';

  const isLg = size === 'lg';
  const isSm = size === 'sm';

  const btnPadding = isLg ? 'py-3.5 px-5 text-base' : isSm ? 'py-2 px-3 text-xs' : 'py-2.5 px-4 text-sm';
  const iconSize = isLg ? 'w-5 h-5' : isSm ? 'w-3.5 h-3.5' : 'w-4 h-4';

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Assalam-o-Alaikum! Hello Muhammadi Egg Store, I need fresh eggs supply in Loni, Ghaziabad.'
    );
    window.open(`https://wa.me/${officialWhatsApp}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`flex ${layout === 'col' ? 'flex-col' : 'flex-wrap sm:flex-nowrap'} gap-2.5 items-center ${className}`}
    >
      <a
        href={`tel:${officialPhoneTel}`}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-neutral-900 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-xl transition-all shadow-xs active:scale-98 min-h-[44px] ${btnPadding}`}
      >
        <Phone className={`${iconSize} text-emerald-700 shrink-0`} />
        <span>Call {showPhoneText ? officialPhoneDisplay : 'Now'}</span>
      </a>

      <button
        type="button"
        onClick={handleWhatsApp}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs shadow-emerald-900/10 active:scale-98 min-h-[44px] ${btnPadding}`}
      >
        <MessageCircle className={`${iconSize} fill-current shrink-0`} />
        <span>WhatsApp Store</span>
      </button>
    </div>
  );
};
