import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { QuantitySelector } from '../common/QuantitySelector';
import { ShoppingBag, Check, Layers, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() => {
    return (
      product.variants?.find((v) => v.isDefault) ||
      product.variants?.[0] || {
        id: 'default',
        name: product.name,
        quantityLabel: product.unit,
        price: product.price,
      }
    );
  });

  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  // Fallback assigner if the initial image link breaks
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const name = product.name.toLowerCase();
    
    if (name.includes('egg')) {
      target.src = 'https://unsplash.com';
    } else if (name.includes('bread')) {
      target.src = 'https://unsplash.com';
    } else if (name.includes('bun')) {
      target.src = 'https://unsplash.com';
    } else {
      target.src = 'https://unsplash.com';
    }
  };

  const activePrice = selectedVariant.price;
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQuantity <= 0;
  const isLowStock = product.stockStatus === 'low_stock' || (product.stockQuantity > 0 && product.stockQuantity < 30);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1400);
  };

  return (
    <article className="group bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.category === 'Eggs' && (
            <span className="bg-emerald-900/95 text-white font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-md shadow-xs border border-emerald-700/50 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
              White Eggs Only
            </span>
          )}
          <span className="bg-amber-400 text-amber-950 font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
            {product.category === 'Eggs' ? 'Min: 50 Trays' : 'Min: 25 Pieces'}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {product.isPromotional && (
            <span className="bg-neutral-900 text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs">
              Popular
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-orange-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              Limited Stock
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-neutral-900 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              Out of Stock
            </span>
          )}
        </div>

        <div className="absolute bottom-2 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-semibold text-neutral-700">
          {product.category}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="text-base font-bold text-neutral-900 leading-snug group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-xs text-emerald-800 font-semibold mt-0.5">{product.tagline}</p>
          )}
        </div>

        <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-3">
          {product.description}
        </p>

        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
          <span className="font-semibold">
            {product.category === 'Eggs' ? 'Minimum 50 Trays (1,500 White Eggs)' : 'Minimum 25 Pieces'}
          </span>
          <span className="text-[10px] font-medium text-amber-700">No single retail sale</span>
        </div>

        {product.variants && product.variants.length > 1 && (
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1 mb-1.5">
              <Layers className="w-3 h-3 text-emerald-700" />
              Select Quantity / Format:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`min-h-[40px] px-2 py-1.5 text-left rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 text-neutral-700'
                    }`}
                  >
                    <div className="truncate text-[11px]">{v.name}</div>
                    <div className="text-neutral-900 font-mono font-bold text-xs mt-0.5">
                      ₹{v.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-neutral-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-neutral-500 font-medium">Price: </span>
              <span className="text-xl font-extrabold text-neutral-900 font-mono tabular-nums">
                ₹{activePrice}
              </span>
              <span className="text-xs text-neutral-500 ml-1">
                / {selectedVariant.quantityLabel || product.unit}
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 font-medium">
              {!isOutOfStock ? `Stock: Available` : 'Unavailable'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <QuantitySelector
              quantity={quantity}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrease={() => setQuantity((q) => q + 1)}
              min={1}
              size="sm"
            />

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                isOutOfStock 
                  ? 'bg-neutral-300 cursor-not-allowed' 
                  : isAddedFeedback 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-900 hover:bg-emerald-800'
              }`}
            >
              {isAddedFeedback ? (
                <span className="flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Added
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
