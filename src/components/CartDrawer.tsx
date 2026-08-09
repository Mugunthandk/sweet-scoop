import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, Gift, Award, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onProceedToCheckout }) => {
  if (!isOpen) return null;

  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryCharge,
    tax,
    discountAmount,
    pointsDiscount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    appliedPoints,
    applyPoints,
    giftOptions,
    setGiftOptions
  } = useCart();

  const { user } = useAuth();
  const { showToast } = useNotification();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showGiftInput, setShowGiftInput] = useState(giftOptions.isGift);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');
    const result = await applyCoupon(couponInput);
    if (result.success) {
      showToast('Coupon Applied! 🎉', result.message);
      setCouponInput('');
    } else {
      setCouponError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fcfae4] border-l-2 border-[#964261] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#964261] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-black font-serif tracking-tight">Your Sweet Scoop Cart</h2>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl block mb-3">🍨</span>
                <h3 className="font-bold text-lg text-[#553b34] font-serif mb-1">Your cart is empty</h3>
                <p className="text-xs text-[#8d7871] mb-6">Looks like you haven't picked your artisanal scoops yet!</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#964261] text-white text-xs font-extrabold shadow-md hover:bg-[#7e344e] transition-colors"
                >
                  Explore Flavors Now
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#f4f1d4] border border-[#e2dcb3] rounded-2xl p-4 flex gap-3 relative shadow-sm"
                >
                  {item.product?.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#f48fb1] text-white flex items-center justify-center text-2xl shrink-0">
                      🍨
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-bold text-xs text-[#553b34] font-serif leading-snug line-clamp-1">
                        {item.product ? item.product.name : 'Custom Artisanal Scoop'}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#8d7871] hover:text-red-600 p-0.5 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-[#755750] font-medium mt-0.5">
                      {item.size} • {item.container || 'Waffle Cone'}
                    </p>

                    {item.toppings.length > 0 && (
                      <p className="text-[9px] text-[#964261] font-semibold mt-0.5 line-clamp-1">
                        Toppings: {item.toppings.join(', ')}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-[#fcfae4] border border-[#d8d1a3] rounded-full p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full bg-[#f4f1d4] text-[#553b34] text-xs font-bold hover:bg-[#e8e2be]"
                        >
                          -
                        </button>
                        <span className="text-xs font-extrabold text-[#553b34] px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full bg-[#964261] text-white text-xs font-bold hover:bg-[#7e344e]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-black text-[#553b34] font-serif">
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cart.length > 0 && (
              <>
                {/* Coupon Box */}
                <div className="bg-[#fcfae4] border border-[#e2dcb3] rounded-2xl p-3.5 mt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#553b34] mb-2">
                    <Tag className="w-3.5 h-3.5 text-[#964261]" />
                    <span>Apply Promo Coupon</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[#e8f5e9] border border-[#a5d6a7] p-2.5 rounded-xl text-xs font-bold text-[#2e7d32]">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#2e7d32]" />
                        <span>Code '{appliedCoupon.code}' Applied (-₹{discountAmount})</span>
                      </div>
                      <button onClick={removeCoupon} className="text-xs underline text-red-600">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try 'SCOOP20' or 'WELCOME50'"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#f4f1d4] border border-[#d8d1a3] rounded-xl px-3 py-1.5 text-xs text-[#553b34] uppercase focus:outline-none"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-1.5 rounded-xl bg-[#964261] text-white text-xs font-bold hover:bg-[#7e344e]"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-[10px] text-red-600 mt-1 font-semibold">{couponError}</p>}
                </div>

                {/* Sweet Points Loyalty Box */}
                {user && user.sweetPoints > 0 && (
                  <div className="bg-[#fffde7] border border-[#fff59d] p-3.5 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#553b34]">
                      <Award className="w-4 h-4 text-[#ffd54f]" />
                      <div>
                        <strong className="block text-xs">Use Sweet Points ({user.sweetPoints} pts)</strong>
                        <span className="text-[10px] text-[#8d7871]">Save up to ₹{Math.min(user.sweetPoints, subtotal)}</span>
                      </div>
                    </div>
                    {appliedPoints > 0 ? (
                      <button onClick={() => applyPoints(0)} className="text-xs text-red-600 font-bold underline">
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => applyPoints(Math.min(user.sweetPoints, subtotal))}
                        className="px-3 py-1 rounded-full bg-[#ffd54f] text-[#553b34] font-black text-[10px]"
                      >
                        Redeem
                      </button>
                    )}
                  </div>
                )}

                {/* Gift Option Toggle */}
                <div className="bg-[#fcfae4] border border-[#e2dcb3] rounded-2xl p-3.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#553b34]">
                    <input
                      type="checkbox"
                      checked={showGiftInput}
                      onChange={(e) => {
                        setShowGiftInput(e.target.checked);
                        setGiftOptions({ ...giftOptions, isGift: e.target.checked });
                      }}
                      className="rounded text-[#964261] focus:ring-0"
                    />
                    <Gift className="w-4 h-4 text-[#964261]" />
                    <span>Send as a Chilled Gift Package (+₹30)</span>
                  </label>

                  {showGiftInput && (
                    <div className="mt-2 space-y-2 pt-2 border-t border-[#e2dcb3]">
                      <input
                        type="text"
                        placeholder="Recipient Name"
                        value={giftOptions.recipientName || ''}
                        onChange={(e) => setGiftOptions({ ...giftOptions, recipientName: e.target.value })}
                        className="w-full bg-[#f4f1d4] border border-[#d8d1a3] rounded-xl px-3 py-1.5 text-xs"
                      />
                      <textarea
                        placeholder="Warm personal gift message on card..."
                        value={giftOptions.giftMessage || ''}
                        onChange={(e) => setGiftOptions({ ...giftOptions, giftMessage: e.target.value })}
                        className="w-full bg-[#f4f1d4] border border-[#d8d1a3] rounded-xl px-3 py-1.5 text-xs h-16"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Summary & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#f4f1d4] border-t border-[#e2dcb3] space-y-2">
              <div className="flex justify-between text-xs text-[#755750]">
                <span>Items Subtotal:</span>
                <span className="font-bold font-serif text-[#553b34]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-[#755750]">
                <span>Chilled Express Delivery:</span>
                <span className="font-bold font-serif text-[#553b34]">₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-xs text-[#755750]">
                <span>Taxes (5% GST):</span>
                <span className="font-bold font-serif text-[#553b34]">₹{tax}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-[#2e7d32] font-bold">
                  <span>Coupon Discount:</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {pointsDiscount > 0 && (
                <div className="flex justify-between text-xs text-[#2e7d32] font-bold">
                  <span>Sweet Points Discount:</span>
                  <span>-₹{pointsDiscount}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-lg font-black text-[#553b34] font-serif pt-2 border-t border-[#d8d1a3]">
                <span>Grand Total:</span>
                <span className="text-2xl text-[#964261]">₹{total}</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-full bg-[#964261] hover:bg-[#7e344e] text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_0_#63263b] transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
