import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, ChefHat, Bike, Home, Phone, MapPin, Sparkles, AlertCircle, Star } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { StarCelebration } from './StarCelebration';

interface OrderTrackerProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order, onClose }) => {
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.orderStatus);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    // Show star celebration for 2.2s on order mount
    const timer = setTimeout(() => setShowCelebration(false), 2200);
    return () => clearTimeout(timer);
  }, [order.id]);

  // Poll order status updates from server
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const updated = await res.json();
          setCurrentStatus(updated.orderStatus);
        }
      } catch (err) {
        // silent
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [order.id]);

  const stages: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    { status: 'Order Placed', label: 'Order Placed', desc: 'Received & sent to kitchen', icon: Clock },
    { status: 'Confirmed', label: 'Kitchen Confirmed', desc: 'Scoop master approved', icon: CheckCircle },
    { status: 'Preparing', label: 'Scooping & Chilling', desc: 'Packing in thermal box', icon: ChefHat },
    { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider en route to you', icon: Bike },
    { status: 'Delivered', label: 'Delivered Fresh!', desc: 'Enjoy your Sweet Scoop!', icon: Home }
  ];

  const getStageIndex = (st: OrderStatus) => {
    if (st === 'Order Placed') return 0;
    if (st === 'Confirmed') return 1;
    if (st === 'Preparing') return 2;
    if (st === 'Ready') return 3;
    if (st === 'Out for Delivery') return 3;
    if (st === 'Delivered') return 4;
    return 0;
  };

  const currentIdx = getStageIndex(currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#FFFFFF] border-2 border-[#964261] rounded-[2.5rem] w-full max-w-2xl my-8 p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-[#4A3728]">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FDF2F5] text-[#964261] flex items-center justify-center text-2xl">
            🍦
          </div>
          <div>
            <h3 className="text-xl font-black text-[#4A3728] font-serif">Live Order Tracking</h3>
            <p className="text-xs text-[#8C7A6B]">Order <strong className="text-[#964261]">#{order.id}</strong> • Estimated Arrival: <strong className="text-[#2e7d32]">{order.estimatedDelivery}</strong></p>
          </div>
        </div>

        {/* Simulated Vector Delivery Map */}
        <div className="w-full h-48 bg-[#F3EFE7] rounded-[2rem] border border-[#E8E2D6] mb-8 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
          <div className="flex justify-between text-xs font-bold text-[#4A3728] z-10">
            <span className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#964261]" /> Store: {order.storeName || 'Indiranagar Flagship'}
            </span>
            <span className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full shadow-sm">
              <Home className="w-3.5 h-3.5 text-[#2e7d32]" /> {order.deliveryAddress?.house || 'Customer House'}
            </span>
          </div>

          {/* Animated Rider Map Route Line */}
          <div className="relative w-full h-1 bg-[#E8E2D6] rounded-full my-auto">
            <div
              className="absolute h-full bg-[#964261] transition-all duration-1000"
              style={{ width: `${Math.min(100, (currentIdx + 1) * 25)}%` }}
            />
            {/* Moving Rider Icon */}
            <div
              className="absolute -top-4 w-9 h-9 rounded-full bg-[#964261] text-white flex items-center justify-center shadow-lg transition-all duration-1000 text-sm"
              style={{ left: `calc(${Math.min(100, (currentIdx + 1) * 25)}% - 18px)` }}
            >
              🏍️
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-[#6B5A4E] font-semibold">
            <span>Thermal Box Sealed ❄️</span>
            <span>Live GPS Signals Active 📡</span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-4 mb-8">
          {stages.map((stg, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = stg.icon;

            return (
              <div key={stg.status} className="flex items-start gap-4 relative">
                {idx < stages.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-8 -ml-px ${
                      idx < currentIdx ? 'bg-[#964261]' : 'bg-[#E8E2D6]'
                    }`}
                  />
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#964261] text-white ring-4 ring-[#FDF2F5] scale-110'
                      : isCompleted
                      ? 'bg-[#2e7d32] text-white'
                      : 'bg-[#F3EFE7] text-[#8C7A6B] border border-[#E8E2D6]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <h4 className={`text-xs font-bold leading-tight ${isCurrent ? 'text-[#964261]' : 'text-[#4A3728]'}`}>
                    {stg.label}
                  </h4>
                  <p className="text-[10px] text-[#8C7A6B]">{stg.desc}</p>
                </div>

                {isCurrent && (
                  <span className="text-[10px] bg-[#964261] text-white font-black px-2 py-0.5 rounded-full animate-pulse">
                    IN PROGRESS
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Delivery Partner Contact Card */}
        {order.deliveryPartnerName && (
          <div className="bg-[#F3EFE7] border border-[#E8E2D6] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#964261] text-white flex items-center justify-center font-bold">
                {order.deliveryPartnerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#4A3728]">{order.deliveryPartnerName}</h4>
                <p className="text-[10px] text-[#8C7A6B]">Express Chilled Delivery Executive</p>
              </div>
            </div>
            <a
              href={`tel:${order.deliveryPartnerPhone || '+91 92222 22222'}`}
              className="px-3.5 py-2 rounded-full bg-[#2e7d32] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#1b5e20]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        )}

        {/* WOW Star Celebration Overlay */}
        <StarCelebration
          show={showCelebration}
          message={`WOW! ORDER #${order.id} CONFIRMED! 🌟`}
          subText="Your payment was verified. Our master chef is scooping your ice cream now!"
        />

      </div>
    </div>
  );
};
