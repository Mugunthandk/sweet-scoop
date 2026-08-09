import React, { useState, useEffect } from 'react';
import { Bike, MapPin, Phone, CheckCircle, Navigation, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { useNotification } from '../context/NotificationContext';

export const DeliveryDashboard: React.FC = () => {
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
        showToast(`Delivery Update: #${orderId}`, `Order status: ${status}`);
        fetchOrders();
      }
    } catch (err) {
      showToast('Status update failed', '', 'error');
    }
  };

  const deliveryOrders = orders.filter(o => ['Out for Delivery', 'Delivered'].includes(o.orderStatus));

  return (
    <div className="py-12 bg-[#f6f3de] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-[#2e7d32] text-white rounded-[2.5rem] p-8 shadow-xl mb-8 flex items-center justify-between border-b-8 border-[#1b5e20]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              🏍️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-green-200 tracking-widest">Express Chilled Rider Portal</span>
              <h1 className="text-3xl font-black font-serif">Delivery Fleet Command</h1>
            </div>
          </div>
          <span className="bg-white/20 px-4 py-2 rounded-full font-black text-xs">
            Rider: Vikram Singh
          </span>
        </div>

        {/* Assigned Orders List */}
        <div className="space-y-4">
          {deliveryOrders.length === 0 ? (
            <div className="text-center py-16 bg-[#fcfae4] rounded-[2.5rem] border border-[#e2dcb3]">
              <span className="text-5xl block mb-2">🎉</span>
              <h3 className="font-bold text-lg text-[#553b34] font-serif">No active deliveries pending</h3>
            </div>
          ) : (
            deliveryOrders.map((ord) => (
              <div key={ord.id} className="bg-[#fcfae4] border border-[#e2dcb3] rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-[#553b34] font-serif text-lg">#{ord.id}</span>
                    <span className="bg-[#964261] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#553b34]">Customer: {ord.customerName} ({ord.customerPhone})</p>
                  <p className="text-xs text-[#8d7871]">{ord.deliveryAddress?.house}, {ord.deliveryAddress?.street}, {ord.deliveryAddress?.city}</p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${ord.customerPhone}`}
                    className="px-4 py-2 rounded-full bg-[#2e7d32] text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Customer
                  </a>

                  {ord.orderStatus === 'Out for Delivery' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                      className="px-5 py-2 rounded-full bg-[#964261] text-white text-xs font-bold shadow-md hover:bg-[#7e344e]"
                    >
                      Mark Delivered Fresh!
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
