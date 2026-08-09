import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import { useNotification } from '../context/NotificationContext';

export const KitchenDashboard: React.FC = () => {
  const { showToast } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 4000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Kitchen Update: #${orderId}`, `Status changed to ${status}`);
        fetchOrders();
      }
    } catch (err) {
      showToast('Status update failed', '', 'error');
    }
  };

  const activeKitchenOrders = orders.filter(o => ['Order Placed', 'Confirmed', 'Preparing'].includes(o.orderStatus));

  return (
    <div className="py-12 bg-[#f6f3de] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kitchen Header */}
        <div className="bg-[#964261] text-white rounded-[2.5rem] p-8 shadow-xl mb-8 flex items-center justify-between border-b-8 border-[#722544]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              👨‍🍳
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-pink-200 tracking-widest">Live Kitchen Kiosk</span>
              <h1 className="text-3xl font-black font-serif">Artisanal Scoop Assembly Pipeline</h1>
            </div>
          </div>
          <div className="bg-white/20 text-white text-xs px-4 py-2 rounded-full font-black">
            {activeKitchenOrders.length} Active Orders
          </div>
        </div>

        {/* Live Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeKitchenOrders.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#fcfae4] rounded-[2.5rem] border border-[#e2dcb3]">
              <span className="text-5xl block mb-2">✨</span>
              <h3 className="font-bold text-lg text-[#553b34] font-serif">Kitchen All Caught Up!</h3>
              <p className="text-xs text-[#8d7871]">Waiting for new orders to arrive...</p>
            </div>
          ) : (
            activeKitchenOrders.map((ord) => (
              <div key={ord.id} className="bg-[#fcfae4] border-2 border-[#964261] rounded-[2rem] p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-lg text-[#553b34] font-serif">#{ord.id}</span>
                    <span className="bg-[#ffd54f] text-[#553b34] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      {ord.orderStatus}
                    </span>
                  </div>

                  <p className="text-xs text-[#8d7871] mb-4">Customer: {ord.customerName} ({ord.deliveryType})</p>

                  <div className="bg-[#f4f1d4] p-3 rounded-xl border border-[#d8d1a3] space-y-2 mb-4">
                    <span className="text-[10px] font-black uppercase text-[#964261]">Order Recipe Items:</span>
                    {ord.items.map((it) => (
                      <div key={it.id} className="text-xs text-[#553b34]">
                        <strong className="text-[#964261]">{it.quantity}x</strong> {it.name}
                        <span className="block text-[10px] text-[#755750]">{it.details}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {ord.orderStatus === 'Order Placed' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'Confirmed')}
                      className="w-full py-2.5 rounded-full bg-[#964261] text-white text-xs font-bold shadow-sm"
                    >
                      Confirm & Accept Order
                    </button>
                  )}
                  {ord.orderStatus === 'Confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'Preparing')}
                      className="w-full py-2.5 rounded-full bg-[#ffd54f] text-[#553b34] text-xs font-black shadow-sm"
                    >
                      Start Scooping & Packing
                    </button>
                  )}
                  {ord.orderStatus === 'Preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'Out for Delivery')}
                      className="w-full py-2.5 rounded-full bg-[#2e7d32] text-white text-xs font-bold shadow-sm"
                    >
                      Mark Packed & Hand Over to Rider
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
