import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldAlert, Sparkles, Check, Truck, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Single Scoop');
  const [selectedContainer, setSelectedContainer] = useState<'Classic Cup' | 'Waffle Cone' | 'Sundae Bowl'>('Waffle Cone');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const isWishlisted = user?.wishlist?.includes(product.id);
  const baseDiscountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));

  // Additional cost for toppings (₹20 per topping) & waffle cone (₹25)
  const toppingsCost = selectedToppings.length * 20;
  const containerCost = selectedContainer === 'Waffle Cone' ? 25 : selectedContainer === 'Sundae Bowl' ? 30 : 0;
  const unitPrice = baseDiscountedPrice + toppingsCost + containerCost;
  const totalPrice = unitPrice * quantity;

  const availableToppings = [
    'Hot Fudge Sauce', 'Rainbow Sprinkles', 'Oreo Crumbles',
    'Toasted Almonds', 'Cashew Crunch', 'Maraschino Cherry', 'White Choco Chips'
  ];

  const toggleTopping = (top: string) => {
    if (selectedToppings.includes(top)) {
      setSelectedToppings(selectedToppings.filter(t => t !== top));
    } else {
      setSelectedToppings([...selectedToppings, top]);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      product,
      size: selectedSize,
      container: selectedContainer,
      toppings: selectedToppings,
      quantity,
      unitPrice,
      instructions: specialInstructions
    });
    showToast(`Added to Cart! 🍦`, `${quantity}x ${product.name} (${selectedSize}) added to your cart.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-[#F3EFE7] hover:bg-[#EAE4D8] text-[#4A3728] flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Image Gallery & Highlights */}
          <div>
            <div className="relative w-full h-80 rounded-[2rem] overflow-hidden bg-[#F3EFE7] mb-4 shadow-inner border border-[#E8E2D6]">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 ${
                  isWishlisted ? 'bg-[#964261] text-white' : 'bg-white/90 text-[#4A3728]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 mb-6">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#964261] scale-105 shadow-md' : 'border-[#E8E2D6] opacity-70'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Nutrition Highlights Table */}
            <div className="bg-[#F3EFE7] rounded-2xl p-4 border border-[#E8E2D6]">
              <h4 className="font-extrabold text-xs text-[#4A3728] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#964261]" /> Nutrition Facts (Per Scoop)
              </h4>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2D6]">
                  <span className="block text-[10px] text-[#8C7A6B]">Calories</span>
                  <strong className="text-[#4A3728]">{product.nutrition?.calories || 220}</strong>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2D6]">
                  <span className="block text-[10px] text-[#8C7A6B]">Fat</span>
                  <strong className="text-[#4A3728]">{product.nutrition?.fat || '12g'}</strong>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2D6]">
                  <span className="block text-[10px] text-[#8C7A6B]">Carbs</span>
                  <strong className="text-[#4A3728]">{product.nutrition?.carbs || '24g'}</strong>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2D6]">
                  <span className="block text-[10px] text-[#8C7A6B]">Sugar</span>
                  <strong className="text-[#4A3728]">{product.nutrition?.sugar || '18g'}</strong>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2D6]">
                  <span className="block text-[10px] text-[#8C7A6B]">Protein</span>
                  <strong className="text-[#4A3728]">{product.nutrition?.protein || '4g'}</strong>
                </div>
              </div>
            </div>

            {/* Allergens Notice */}
            <div className="mt-4 p-3 bg-[#FDF2F5] rounded-xl border border-[#EFCCD6] flex items-center gap-2.5 text-xs text-[#6A2B43]">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#964261]" />
              <span>
                <strong>Allergens:</strong> {product.allergens.length > 0 ? product.allergens.join(', ') : 'No common allergens'}
              </span>
            </div>

          </div>

          {/* Right Column: Customizer & Purchase */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-extrabold text-[#964261] uppercase tracking-wider text-xs">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-[#4A3728] font-bold bg-[#F3EFE7] px-3 py-1 rounded-full border border-[#E8E2D6]">
                  <Star className="w-4 h-4 fill-[#964261] text-[#964261]" />
                  <span>{product.rating}</span>
                  <span className="text-[#8C7A6B]">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#4A3728] font-serif mb-2 leading-tight">
                {product.name}
              </h2>

              <p className="text-xs text-[#6B5A4E] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-2">
                  1. Choose Serving Size
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`p-2.5 rounded-2xl text-xs font-bold transition-all border text-center ${
                        selectedSize === sz
                          ? 'bg-[#964261] text-white border-[#964261] shadow-md'
                          : 'bg-[#F3EFE7] text-[#4A3728] border-[#E8E2D6] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Container Option (Cone vs Cup) */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-2">
                  2. Choose Container
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Waffle Cone', label: 'Waffle Cone (+₹25)', icon: '🍦' },
                    { id: 'Classic Cup', label: 'Classic Cup (Free)', icon: '🍨' },
                    { id: 'Sundae Bowl', label: 'Sundae Bowl (+₹30)', icon: '🍧' },
                  ].map((cnt) => (
                    <button
                      key={cnt.id}
                      onClick={() => setSelectedContainer(cnt.id as any)}
                      className={`p-2.5 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                        selectedContainer === cnt.id
                          ? 'bg-[#964261] text-white border-[#964261] shadow-md'
                          : 'bg-[#F3EFE7] text-[#4A3728] border-[#E8E2D6] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      <span className="text-xl">{cnt.icon}</span>
                      <span>{cnt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-2">
                  3. Add Extra Toppings (+₹20 each)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableToppings.map((top) => {
                    const active = selectedToppings.includes(top);
                    return (
                      <button
                        key={top}
                        onClick={() => toggleTopping(top)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                          active
                            ? 'bg-[#964261] text-white border-[#964261] shadow-sm'
                            : 'bg-[#F3EFE7] text-[#4A3728] border-[#E8E2D6] hover:bg-[#EAE4D8]'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span>{top}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-1.5">
                  Special Kitchen Request
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra hot fudge on top, deliver extra cold..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#F3EFE7] border border-[#E8E2D6] rounded-2xl px-4 py-2.5 text-xs text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#964261]"
                />
              </div>

            </div>

            {/* Quantity & Checkout Bar */}
            <div className="bg-[#F3EFE7] p-4 rounded-3xl border border-[#E8E2D6] mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 bg-[#FFFFFF] border border-[#E8E2D6] rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-[#F3EFE7] text-[#4A3728] font-black hover:bg-[#EAE4D8] transition-colors"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm text-[#4A3728] px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-[#964261] text-white font-black hover:bg-[#7A324E] transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] text-[#8C7A6B] font-bold uppercase">Total Price</span>
                  <span className="text-2xl font-black text-[#4A3728] font-serif">₹{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-full bg-[#964261] hover:bg-[#7A324E] text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_0_#6A2B43] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart - ₹{totalPrice}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
