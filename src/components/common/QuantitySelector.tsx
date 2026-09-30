import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max = 999,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const btnDimensions = isSm
    ? 'min-w-[36px] min-h-[36px] w-9 h-9 text-xs'
    : isLg
    ? 'min-w-[48px] min-h-[48px] w-12 h-12 text-base'
    : 'min-w-[44px] min-h-[44px] w-11 h-11 text-sm';

  const textWidth = isSm ? 'w-8 text-xs' : isLg ? 'w-12 text-base font-bold' : 'w-10 text-sm font-semibold';

  return (
    <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white shadow-xs p-0.5">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={`${btnDimensions} flex items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent active:scale-95 transition-all`}
      >
        <Minus className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      <span
        className={`${textWidth} text-center font-mono tabular-nums text-neutral-900 select-none`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={`${btnDimensions} flex items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent active:scale-95 transition-all`}
      >
        <Plus className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>
    </div>
  );
};
