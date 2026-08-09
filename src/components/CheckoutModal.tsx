import React, { useState } from 'react';
import { X, MapPin, Truck, Store as StoreIcon, Clock, ArrowRight, Plus, Check, Calendar, Gift, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { PaymentModal } from './PaymentModal';
import { Address, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  if (!isOpen) return null;

  const {
    cart,
    subtotal,
    deliveryCharge,
    tax,
    discountAmount,
    pointsDiscount,
    total,
    deliveryType,
    setDeliveryType,
    clearCart,
    giftOptions
  } = useCart();

  const { user, addAddress } = useAuth();
  const { showToast } = useNotification();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    user?.addresses?.[0] || null
  );
  const [showAddAddress, setShowAddAddress] = useState(!user?.addresses?.length);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // New Address Form State
  const [newHouse, setNewHouse] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newPincode, setNewPincode] = useState('560038');

  // Scheduled Delivery State
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('06:00 PM - 08:00 PM');
  const [occasionNote, setOccasionNote] = useState('');

  // Referral Code State
  const [referralCode, setReferralCode] = useState('');
  const [referralDiscount, setReferralDiscount] = useState(0);

  // Pincode Zone Checker State
  const [checkedPincode, setCheckedPincode] = useState('560038');
  const [isZoneDeliverable, setIsZoneDeliverable] = useState(true);

  const handleApplyReferral = () => {
    if (referralCode.trim().length > 3) {
      setReferralDiscount(50);
      showToast('Referral Code Applied! 🎉', '₹50 discount applied from your friend\'s referral link!');
    } else {
      showToast('Invalid Code', 'Please enter a valid referral code', 'error');
    }
  };

  const handleCheckPincode = (pincode: string) => {
    setCheckedPincode(pincode);
    // Demo deliverable pincodes check (starts with 560, 400, 110, 600, etc.)
    const deliverable = ['560', '400', '110', '600', '500'].some(prefix => pincode.startsWith(prefix));
    setIsZoneDeliverable(deliverable || pincode.length === 6);
  };

  const handleSaveAddress = () => {
    if (!newHouse || !newStreet) return;
    const addr = {
      type: 'Home' as const,
      name: user?.name || 'Customer',
      phone: user?.mobile || '+91 98765 43210',
      house: newHouse,
      street: newStreet,
      city: newCity,
      state: 'Karnataka',
      pincode: newPincode
    };
    addAddress(addr);
    setSelectedAddress(addr as any);
    setShowAddAddress(false);
    handleCheckPincode(newPincode);
  };

  const finalOrderTotal = Math.max(0, total - referralDiscount);

  const handlePaymentSuccess = async (paymentMethod: any, transactionId: string) => {
    setShowPaymentModal(false);

    const orderPayload = {
      userId: user?.id || 'usr-customer',
      customerName: user?.name || 'Ananya Sharma',
      customerPhone: user?.mobile || '+91 98765 43210',
      customerEmail: user?.email || 'ananya@example.com',
      items: cart.map(item => ({
        id: item.id,
        name: item.product ? item.product.name : 'Custom Artisanal Scoop',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        details: `${item.size} • ${item.container || 'Cone'} ${item.toppings.length ? `• Toppings: ${item.toppings.join(', ')}` : ''}`,
        image: item.product?.images?.[0]
      })),
      subtotal,
      deliveryCharge,
      discount: discountAmount + referralDiscount,
      tax,
      pointsDiscount,
      total: finalOrderTotal,
      deliveryAddress: selectedAddress || {
        id: 'addr-default',
        type: 'Home',
        name: user?.name || 'Customer',
        phone: user?.mobile || '+91 98765 43210',
        house: 'Flat 402, Rosewood Heights',
        street: 'MG Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: checkedPincode || '560038'
      },
      deliveryType,
      storeName: 'Sweet Scoop Flagship - Indiranagar',
      paymentMethod,
      paymentStatus: 'SUCCESS' as const,
      transactionId,
      orderStatus: 'Order Placed' as const,
      estimatedDelivery: isScheduled ? `Scheduled: ${scheduledDate} (${scheduledTimeSlot})` : (deliveryType === 'Express' ? '15-20 Mins' : '30-40 Mins'),
      giftOptions: occasionNote ? { isGift: true, message: occasionNote, recipientName: 'Special Someone' } : giftOptions
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        showToast('Order Confirmed! 🍦', `Order #${data.order.id} placed successfully! Track live now.`);
        onClose();
        onOrderSuccess(data.order);
      }
    } catch (err) {
      console.error(err);
      showToast('Error Placing Order', 'Please try again', 'error');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div className="bg-[#FFFFFF] border-2 border-[#964261] rounded-[2.5rem] w-full max-w-2xl my-8 p-6 sm:p-8 shadow-2xl relative space-y-6">
          
          <button onClick={onClose} className="absolute top-6 right-6 text-[#4A3728]">
            <X className="w-5 h-5" />
          </button>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#964261]">Final Step</span>
            <h2 className="text-2xl font-black text-[#4A3728] font-serif">Checkout & Delivery Details 🍦</h2>
          </div>

          {/* Cold-Chain Protection Banner */}
          <div className="bg-[#F3EFE7] border border-[#E8E2D6] rounded-2xl p-3 flex items-center gap-3 text-xs text-[#4A3728]">
            <div className="w-8 h-8 rounded-full bg-[#FDF2F5] text-[#964261] flex items-center justify-center font-bold text-base shrink-0">
              ❄️
            </div>
            <div>
              <strong className="block text-[#964261] font-bold">100% Cold-Chain Protected Delivery</strong>
              <p className="text-[10px] text-[#8C7A6B]">Packed in food-grade insulated dry-ice thermal containers to ensure zero melting guarantee!</p>
            </div>
          </div>

          {/* 1. Scheduled vs Immediate Delivery Option */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#4A3728] uppercase tracking-wider">
                Select Delivery Speed
              </label>
              <button
                onClick={() => setIsScheduled(!isScheduled)}
                className="text-xs font-bold text-[#964261] flex items-center gap-1.5 underline"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isScheduled ? 'Switch to Immediate Delivery' : '📅 Schedule for Party/Birthday'}</span>
              </button>
            </div>

            {!isScheduled ? (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Express', label: '15-Min Express (Chilled)', price: '₹35', icon: Truck },
                  { id: 'Standard', label: 'Standard Delivery', price: '₹20', icon: Clock },
                  { id: 'Store Pickup', label: 'Store Self-Pickup', price: 'FREE', icon: StoreIcon }
                ].map((dt) => {
                  const Icon = dt.icon;
                  return (
                    <button
                      key={dt.id}
                      onClick={() => setDeliveryType(dt.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-bold ${
                        deliveryType === dt.id
                          ? 'bg-[#964261] text-white border-[#964261] shadow-md'
                          : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{dt.label}</span>
                      <span className="text-[10px] opacity-80">{dt.price}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#FDF2F5] border border-[#EFCCD6] rounded-2xl p-4 space-y-3 text-xs">
                <strong className="block font-bold text-[#964261]">📅 Select Scheduled Date & Slot:</strong>
                
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'In 2 Days'].map((date) => (
                    <button
                      key={date}
                      onClick={() => setScheduledDate(date)}
                      className={`p-2 rounded-xl border text-xs font-bold ${
                        scheduledDate === date ? 'bg-[#964261] text-white border-[#964261]' : 'bg-white border-[#E8E2D6] text-[#4A3728]'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Time Slot</label>
                  <select
                    value={scheduledTimeSlot}
                    onChange={(e) => setScheduledTimeSlot(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D6] rounded-xl px-3 py-2 font-bold text-[#4A3728]"
                  >
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Morning)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon Tea)</option>
                    <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM (Evening Treats)</option>
                    <option value="08:00 PM - 10:00 PM">08:00 PM - 10:00 PM (Late Night Party)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Occasion / Gift Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Happy Birthday Rahul! 🎂 From Ananya"
                    value={occasionNote}
                    onChange={(e) => setOccasionNote(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D6] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Address Selector & Pincode Zone Validation */}
          {deliveryType !== 'Store Pickup' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#4A3728] uppercase tracking-wider">
                  Delivery Address & Zone Check
                </label>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs text-[#964261] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              </div>

              {/* Saved Addresses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user?.addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      handleCheckPincode(addr.pincode);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddress?.id === addr.id
                        ? 'bg-[#964261] text-white border-[#964261] shadow-md'
                        : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black uppercase tracking-wider">{addr.type}</span>
                      {selectedAddress?.id === addr.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <p className="text-xs font-bold leading-tight line-clamp-1">{addr.house}, {addr.street}</p>
                    <p className="text-[10px] opacity-80">{addr.city} - {addr.pincode}</p>
                  </div>
                ))}
              </div>

              {/* Add New Address Form */}
              {showAddAddress && (
                <div className="bg-[#F3EFE7] border border-[#E8E2D6] rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-[#4A3728]">Enter New Address Details</h4>
                  <input
                    type="text"
                    placeholder="Flat / House / Building Name"
                    value={newHouse}
                    onChange={(e) => setNewHouse(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D6] rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Street / Area / Landmark"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D6] rounded-xl px-3 py-2 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D6] rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 560038)"
                      value={newPincode}
                      onChange={(e) => {
                        setNewPincode(e.target.value);
                        handleCheckPincode(e.target.value);
                      }}
                      className="w-full bg-white border border-[#E8E2D6] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <button
                    onClick={handleSaveAddress}
                    className="px-4 py-2 rounded-xl bg-[#964261] text-white text-xs font-bold"
                  >
                    Save & Select Address
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. Referral Code Box */}
          <div className="p-3.5 bg-[#F3EFE7] border border-[#E8E2D6] rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Tag className="w-4 h-4 text-[#964261]" />
              <input
                type="text"
                placeholder="Have a Friend's Referral Code?"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full bg-transparent text-xs font-bold focus:outline-none uppercase text-[#4A3728]"
              />
            </div>
            <button
              onClick={handleApplyReferral}
              className="px-4 py-1.5 rounded-xl bg-[#4A3728] text-white text-xs font-bold shrink-0 hover:bg-[#2D1B0E]"
            >
              Apply
            </button>
          </div>

          {/* Order Total Overview */}
          <div className="bg-[#F3EFE7] border border-[#E8E2D6] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8C7A6B] font-bold block">Final Total</span>
              <span className="text-2xl font-black text-[#4A3728] font-serif">₹{finalOrderTotal}</span>
              {referralDiscount > 0 && (
                <span className="text-[10px] text-[#2e7d32] font-bold block">Includes ₹50 Referral Discount!</span>
              )}
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-6 py-3.5 rounded-full bg-[#964261] text-white text-xs font-black shadow-[0_4px_0_0_#6A2B43] flex items-center gap-2 hover:scale-105"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={finalOrderTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};
