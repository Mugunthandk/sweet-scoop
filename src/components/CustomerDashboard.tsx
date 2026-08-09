import React, { useState, useEffect } from 'react';
import { Award, ShoppingBag, MapPin, Calendar, Plus, RefreshCw, FileText, XCircle, Share2, Copy, Check, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { Order, Product } from '../types';
import { InvoiceModal } from './InvoiceModal';

interface CustomerDashboardProps {
  onNavigateToFlavors: () => void;
  onOpenOrderTracker: (order: Order) => void;
  products: Product[];
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigateToFlavors,
  onOpenOrderTracker,
  products
}) => {
  const { user, addAddress, removeAddress } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'orders' | 'insights' | 'points' | 'referral' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Order Cancellation State
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind');
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/orders?userId=${user.id}`);
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      const matchedProduct = products.find(p => p.name === item.name) || products[0];
      if (matchedProduct) {
        addToCart(matchedProduct, {
          size: 'Double Scoop',
          container: 'Waffle Cone',
          toppings: [],
          specialInstructions: `Reorder from Order #${order.id}`
        });
      }
    });
    showToast('Items Added to Cart! 🍦', `Added ${order.items.length} items from Order #${order.id} to your cart.`);
  };

  const handleCancelOrder = async () => {
    if (!cancellingOrder) return;
    try {
      const res = await fetch(`/api/orders/${cancellingOrder.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order Cancelled', `Order #${cancellingOrder.id} has been cancelled. Refund of ₹${cancellingOrder.total} initiated!`);
        setCancellingOrder(null);
        fetchOrders();
      }
    } catch (err) {
      showToast('Cancellation Failed', 'Could not cancel order at this time', 'error');
    }
  };

  if (!user) return null;

  // Calculate Spending Insights
  const totalSpent = orders.reduce((sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const referralCode = `SWEET-${user.name.toUpperCase().slice(0, 4)}-89`;

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Banner Header */}
        <div className="bg-[#FFFFFF] border-2 border-[#964261] rounded-[2.5rem] p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#964261] text-white flex items-center justify-center font-serif text-2xl font-black shadow-md border-2 border-white">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#4A3728] font-serif">{user.name}</h1>
                <span className="bg-[#964261] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {user.tier}
                </span>
              </div>
              <p className="text-xs text-[#8C7A6B]">{user.email} • {user.mobile}</p>
            </div>
          </div>

          {/* Points & Total Spent Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="bg-[#F3EFE7] border border-[#E8E2D6] p-4 rounded-2xl flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F5] text-[#964261] flex items-center justify-center text-xl">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider block">Sweet Points</span>
                <strong className="text-xl font-black text-[#4A3728] font-serif">{user.sweetPoints} Points</strong>
              </div>
            </div>

            <div className="bg-[#F3EFE7] border border-[#E8E2D6] p-4 rounded-2xl flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F5] text-[#964261] flex items-center justify-center text-xl">
                💰
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider block">Total Spent</span>
                <strong className="text-xl font-black text-[#4A3728] font-serif">₹{totalSpent}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-[#E8E2D6] mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: 'My Orders & Live Tracking', icon: ShoppingBag },
            { id: 'insights', label: 'Spending Insights', icon: TrendingUp },
            { id: 'points', label: 'Sweet Points Loyalty', icon: Award },
            { id: 'referral', label: 'Refer & Earn ₹50', icon: Share2 },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === tab.id
                    ? 'border-[#964261] text-[#964261] bg-[#FFFFFF] rounded-t-xl'
                    : 'border-transparent text-[#6B5A4E] hover:text-[#4A3728]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders & Live Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <p className="text-xs text-[#8C7A6B]">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-12 text-center">
                <span className="text-5xl block mb-2">🍦</span>
                <h3 className="font-bold text-[#4A3728] font-serif">No orders placed yet!</h3>
                <button onClick={onNavigateToFlavors} className="mt-4 px-6 py-2.5 rounded-full bg-[#964261] text-white text-xs font-bold">
                  Explore Fresh Scoops
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D6]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#4A3728] font-serif">Order #{ord.id}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          ord.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-[#e8f5e9] text-[#2e7d32]'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8C7A6B]">{new Date(ord.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xl font-black text-[#4A3728] font-serif mr-2">₹{ord.total}</span>
                      
                      <button
                        onClick={() => onOpenOrderTracker(ord)}
                        className="px-3.5 py-1.5 rounded-full bg-[#964261] text-white text-xs font-bold shadow-sm hover:bg-[#7A324E]"
                      >
                        Track Live
                      </button>

                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="px-3.5 py-1.5 rounded-full bg-[#F3EFE7] text-[#4A3728] border border-[#E8E2D6] text-xs font-bold hover:bg-[#EAE4D8] flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> GST Invoice
                      </button>

                      <button
                        onClick={() => handleReorder(ord)}
                        className="px-3.5 py-1.5 rounded-full bg-[#FDF2F5] text-[#964261] border border-[#EFCCD6] text-xs font-bold hover:bg-[#F9E4EB] flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Order Again
                      </button>

                      {['Order Placed', 'Confirmed'].includes(ord.orderStatus) && (
                        <button
                          onClick={() => setCancellingOrder(ord)}
                          className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-2">
                    {ord.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs text-[#4A3728]">
                        <span>{item.quantity}x <strong>{item.name}</strong> ({item.details})</span>
                        <strong className="font-serif">₹{item.totalPrice}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Customer Spending Insights */}
        {activeTab === 'insights' && (
          <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#4A3728] font-serif">Your Ice Cream Analytics & Preferences 📊</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#F3EFE7] border border-[#E8E2D6]">
                <span className="text-[10px] font-bold text-[#8C7A6B] uppercase block">Lifetime Purchases</span>
                <strong className="text-3xl font-black text-[#964261] font-serif">{totalOrdersCount} Orders</strong>
                <p className="text-[10px] text-[#8C7A6B] mt-1">Average ₹{Math.round(totalSpent / (totalOrdersCount || 1))} per order</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F3EFE7] border border-[#E8E2D6]">
                <span className="text-[10px] font-bold text-[#8C7A6B] uppercase block">Most Loved Flavor</span>
                <strong className="text-xl font-black text-[#4A3728] font-serif block mt-1">Double Dark Belgian Fudge</strong>
                <span className="text-[10px] text-[#2e7d32] font-extrabold">Ordered 5 times! 🍫</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#F3EFE7] border border-[#E8E2D6]">
                <span className="text-[10px] font-bold text-[#8C7A6B] uppercase block">Sweet Points Earned</span>
                <strong className="text-3xl font-black text-[#2e7d32] font-serif">{user.sweetPoints} Pts</strong>
                <p className="text-[10px] text-[#8C7A6B] mt-1">Tier: {user.tier}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sweet Points Loyalty */}
        {activeTab === 'points' && (
          <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#4A3728] font-serif">Sweet Points Membership Tiers 🏆</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Scoop Starter', points: '0 - 200 pts', perk: '5% bonus points on orders' },
                { name: 'Scoop Lover', points: '201 - 500 pts', perk: 'Free toppings + 10% bonus points' },
                { name: 'Scoop VIP', points: '500+ pts', perk: 'Free birthday pint + 25% OFF coupon' },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`p-5 rounded-2xl border ${
                    user.tier === tier.name ? 'bg-[#964261] text-white border-[#964261] shadow-md' : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728]'
                  }`}
                >
                  <h4 className="font-bold text-sm mb-1">{tier.name}</h4>
                  <span className="text-xs opacity-80 block mb-2">{tier.points}</span>
                  <p className="text-xs leading-snug">{tier.perk}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Referral System */}
        {activeTab === 'referral' && (
          <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-8 shadow-sm space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-4xl block">🎁</span>
              <h3 className="text-2xl font-black text-[#4A3728] font-serif">Invite Friends & Earn Sweet Points!</h3>
              <p className="text-xs text-[#8C7A6B]">
                Share your personal referral code with friends. They get <strong className="text-[#964261]">₹50 OFF</strong> their first order, and you earn <strong className="text-[#2e7d32]">50 Sweet Points</strong> automatically!
              </p>

              <div className="p-4 bg-[#F3EFE7] rounded-2xl border border-[#E8E2D6] flex items-center justify-between max-w-md mx-auto mt-4">
                <span className="font-mono font-black text-lg text-[#964261] tracking-wider">{referralCode}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    setCopiedReferral(true);
                    setTimeout(() => setCopiedReferral(false), 2000);
                    showToast('Referral Code Copied! 📋', 'Share with friends to earn Sweet Points!');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#964261] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReferral ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Addresses */}
        {activeTab === 'addresses' && (
          <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-black text-[#4A3728] font-serif mb-4">Saved Delivery Addresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="bg-[#F3EFE7] border border-[#E8E2D6] p-4 rounded-2xl relative">
                  <span className="bg-[#964261] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    {addr.type}
                  </span>
                  <p className="text-xs font-bold text-[#4A3728] mt-2">{addr.house}, {addr.street}</p>
                  <p className="text-xs text-[#8C7A6B]">{addr.city} - {addr.pincode}</p>
                  <button onClick={() => removeAddress(addr.id)} className="text-xs text-red-600 font-bold mt-2 block">
                    Remove Address
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Tax Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* Cancel Order Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-[#964261] rounded-[2.5rem] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-[#4A3728] font-serif">Cancel Order #{cancellingOrder.id}?</h3>
            <p className="text-xs text-[#8C7A6B]">Please select a reason for cancellation. A full refund of ₹{cancellingOrder.total} will be processed immediately.</p>
            
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-[#F3EFE7] border border-[#E8E2D6] rounded-xl p-3 text-xs font-bold text-[#4A3728]"
            >
              <option value="Changed my mind">Changed my mind</option>
              <option value="Added wrong flavor">Added wrong flavor/items</option>
              <option value="Delivery time too long">Delivery estimated time too long</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
            </select>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancellingOrder(null)}
                className="flex-1 py-3 rounded-full bg-[#F3EFE7] text-[#4A3728] text-xs font-bold"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-3 rounded-full bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
