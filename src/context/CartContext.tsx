import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, CustomBuild, Coupon, GiftOptions, Address } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: {
    product?: Product;
    customBuild?: CustomBuild;
    size?: string;
    container?: string;
    toppings?: string[];
    addOns?: string[];
    quantity?: number;
    unitPrice?: number;
    instructions?: string;
  }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discountAmount: number;
  pointsDiscount: number;
  total: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  appliedPoints: number;
  applyPoints: (points: number) => void;
  giftOptions: GiftOptions;
  setGiftOptions: React.Dispatch<React.SetStateAction<GiftOptions>>;
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  deliveryType: 'Standard' | 'Express' | 'Scheduled' | 'Store Pickup';
  setDeliveryType: (type: 'Standard' | 'Express' | 'Scheduled' | 'Store Pickup') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sweet_scoop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [appliedPoints, setAppliedPoints] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliveryType, setDeliveryType] = useState<'Standard' | 'Express' | 'Scheduled' | 'Store Pickup'>('Express');
  const [giftOptions, setGiftOptions] = useState<GiftOptions>({ isGift: false });

  useEffect(() => {
    localStorage.setItem('sweet_scoop_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (data: {
    product?: Product;
    customBuild?: CustomBuild;
    size?: string;
    container?: string;
    toppings?: string[];
    addOns?: string[];
    quantity?: number;
    unitPrice?: number;
    instructions?: string;
  }) => {
    const qty = data.quantity || 1;
    const basePrice = data.unitPrice ?? (data.product ? data.product.price * (1 - (data.product.discount || 0) / 100) : 150);
    const calculatedUnitPrice = Math.round(basePrice);

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: data.product?.id,
      product: data.product,
      customBuild: data.customBuild,
      size: data.size || (data.customBuild ? data.customBuild.size : 'Single Scoop'),
      container: data.container || (data.customBuild ? data.customBuild.base : 'Classic Cup'),
      toppings: data.toppings || data.customBuild?.toppings || [],
      addOns: data.addOns || data.customBuild?.addOns || [],
      quantity: qty,
      unitPrice: calculatedUnitPrice,
      totalPrice: calculatedUnitPrice * qty,
      instructions: data.instructions
    };

    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setAppliedPoints(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCharge = deliveryType === 'Store Pickup' ? 0 : deliveryType === 'Express' ? 35 : 20;
  const tax = Math.round(subtotal * 0.05); // 5% GST

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENT') {
      discountAmount = Math.min((subtotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    discountAmount = Math.round(discountAmount);
  }

  const pointsDiscount = Math.min(appliedPoints, subtotal - discountAmount);
  const total = Math.max(0, subtotal + deliveryCharge + tax - discountAmount - pointsDiscount);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        return { success: true, message: `Coupon '${code}' applied successfully!` };
      }
      return { success: false, message: data.message || 'Invalid coupon' };
    } catch (err) {
      return { success: false, message: 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const applyPoints = (pts: number) => {
    setAppliedPoints(pts);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
        setGiftOptions,
        selectedAddress,
        setSelectedAddress,
        deliveryType,
        setDeliveryType
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
