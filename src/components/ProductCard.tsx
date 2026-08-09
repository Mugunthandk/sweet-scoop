import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useNotification();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Single Scoop');

  const isWishlisted = user?.wishlist?.includes(product.id);
  const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      product,
      size: selectedSize,
      quantity: 1,
      unitPrice: discountedPrice
    });
    showToast(`Added to Cart! 🍦`, `${product.name} (${selectedSize}) added to your cart.`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(
      isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist! ❤️',
      `${product.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
      'info'
    );
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-4 flex flex-col justify-between shadow-[0_4px_16px_rgba(74,55,40,0.04)] hover:shadow-[0_10px_25px_rgba(255,99,33,0.12)] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer relative group"
    >
      {/* Top Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 items-start">
        {product.discount > 0 && (
          <span className="bg-[#964261] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            {product.discount}% OFF
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-[#4A3728] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#964261]" /> Bestseller
          </span>
        )}
        {product.isVegan && (
          <span className="bg-[#2E7D32] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
            🌱 100% Vegan
          </span>
        )}
        {product.isSugarFree && (
          <span className="bg-[#0288D1] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
            ✨ Sugar Free
          </span>
        )}
      </div>

      {/* Wishlist Heart Toggle */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-6 right-6 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
          isWishlisted ? 'bg-[#964261] text-white' : 'bg-white/90 text-[#4A3728] hover:bg-white'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-52 rounded-[1.5rem] overflow-hidden bg-[#F3EFE7] mb-4 flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
          <span className="bg-white/90 text-[#4A3728] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#964261]" /> Quick View
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-extrabold text-[#964261] uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#4A3728] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#964261] text-[#964261]" />
              <span>{product.rating}</span>
              <span className="text-[#8C7A6B] text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-base text-[#4A3728] font-serif leading-snug line-clamp-1 mb-1 group-hover:text-[#964261] transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-[#6B5A4E] line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        <div>
          {/* Size Selector Pill */}
          {product.sizes.length > 1 && (
            <div className="mb-3" onClick={e => e.stopPropagation()}>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="w-full bg-[#F3EFE7] border border-[#E8E2D6] text-[#4A3728] text-xs font-semibold rounded-full py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#964261]"
              >
                {product.sizes.map(sz => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>
          )}

          {/* Pricing & Add Button */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D6]">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-[#4A3728] font-serif">
                  ₹{discountedPrice}
                </span>
                {product.discount > 0 && (
                  <span className="text-xs text-[#8C7A6B] line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#8C7A6B]">Incl. all taxes</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-full bg-[#964261] hover:bg-[#7A324E] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-[0_3px_0_0_#6A2B43] transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
