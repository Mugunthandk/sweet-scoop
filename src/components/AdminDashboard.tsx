import React, { useState, useEffect } from 'react';
import { BarChart3, Package, ShoppingBag, Layers, Users, Plus, Edit, Trash2, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { Product, Order, InventoryItem, Staff } from '../types';
import { useNotification } from '../context/NotificationContext';

interface AdminDashboardProps {
  products: Product[];
  onRefreshProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onRefreshProducts }) => {
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'staff'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // New Product Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Classic');
  const [prodPrice, setProdPrice] = useState(190);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=800');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, ordersRes, inventoryRes, staffRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/orders'),
        fetch('/api/inventory'),
        fetch('/api/staff')
      ]);
      setAnalytics(await analyticsRes.json());
      setOrders(await ordersRes.json());
      setInventory(await inventoryRes.json());
      setStaffList(await staffRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async () => {
    if (!prodName || !prodPrice) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prodName,
          category: prodCategory,
          price: Number(prodPrice),
          discount: 0,
          description: prodDesc || 'Hand-churned artisanal delight.',
          images: [prodImage],
          rating: 4.9,
          reviewsCount: 1,
          stock: 30,
          sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
          ingredients: ['Fresh Cream', 'Milk', 'Cane Sugar'],
          nutrition: { calories: 200, fat: '10g', carbs: '22g', protein: '4g', sugar: '16g' },
          allergens: ['Milk'],
          isAvailable: true
        })
      });
      if (res.ok) {
        showToast('Product Added! 🍦', `${prodName} was added to catalog.`);
        setShowAddProduct(false);
        onRefreshProducts();
      }
    } catch (err) {
      showToast('Failed to add product', '', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast('Order Status Updated! ⚡', `Order #${orderId} is now ${status}`);
        fetchAdminData();
      }
    } catch (err) {
      showToast('Failed to update status', '', 'error');
    }
  };

  return (
    <div className="py-12 bg-[#f6f3de] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="bg-[#553b34] text-white rounded-[2.5rem] p-8 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b-8 border-[#964261]">
          <div>
            <span className="text-[10px] font-black uppercase text-[#f48fb1] tracking-widest">Master Admin Command Center</span>
            <h1 className="text-3xl font-black font-serif">Sweet Scoop Management</h1>
          </div>
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-5 py-3 rounded-full bg-[#f48fb1] hover:bg-[#e07799] text-[#553b34] text-xs font-black flex items-center gap-2 shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Ice Cream Product</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#d8d1a3] mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'analytics', label: 'Analytics & Revenue', icon: BarChart3 },
            { id: 'products', label: 'Product Catalog', icon: Package },
            { id: 'orders', label: 'Order Pipeline', icon: ShoppingBag },
            { id: 'inventory', label: 'Kitchen Inventory', icon: Layers },
            { id: 'staff', label: 'Staff Roster', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === tab.id
                    ? 'border-[#964261] text-[#964261] bg-[#fcfae4] rounded-t-xl'
                    : 'border-transparent text-[#755750] hover:text-[#553b34]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#fcfae4] p-6 rounded-[2rem] border border-[#e2dcb3] shadow-sm">
                <span className="text-xs font-bold text-[#8d7871] uppercase">Total Revenue</span>
                <strong className="text-3xl font-black text-[#553b34] font-serif block mt-1">₹{analytics.totalRevenue}</strong>
              </div>
              <div className="bg-[#fcfae4] p-6 rounded-[2rem] border border-[#e2dcb3] shadow-sm">
                <span className="text-xs font-bold text-[#8d7871] uppercase">Total Orders</span>
                <strong className="text-3xl font-black text-[#553b34] font-serif block mt-1">{analytics.totalOrders}</strong>
              </div>
              <div className="bg-[#fcfae4] p-6 rounded-[2rem] border border-[#e2dcb3] shadow-sm">
                <span className="text-xs font-bold text-[#8d7871] uppercase">Active Pending Orders</span>
                <strong className="text-3xl font-black text-[#964261] font-serif block mt-1">{analytics.pendingOrders}</strong>
              </div>
              <div className="bg-[#fcfae4] p-6 rounded-[2rem] border border-[#e2dcb3] shadow-sm">
                <span className="text-xs font-bold text-[#8d7871] uppercase">Registered Customers</span>
                <strong className="text-3xl font-black text-[#553b34] font-serif block mt-1">{analytics.totalCustomers}</strong>
              </div>
            </div>

            {/* Popular Flavors Bar Breakdown */}
            <div className="bg-[#fcfae4] p-6 rounded-[2rem] border border-[#e2dcb3] shadow-sm">
              <h3 className="font-bold text-base text-[#553b34] font-serif mb-4">Top Selling Flavors Share</h3>
              <div className="space-y-3">
                {analytics.popularFlavors.map((flv: any) => (
                  <div key={flv.name}>
                    <div className="flex justify-between text-xs font-bold text-[#553b34] mb-1">
                      <span>{flv.name}</span>
                      <span>{flv.percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-[#f4f1d4] rounded-full overflow-hidden">
                      <div className="h-full bg-[#964261] rounded-full" style={{ width: `${flv.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-[#fcfae4] p-5 rounded-[2rem] border border-[#e2dcb3] shadow-sm flex items-center gap-4">
                <img src={p.images[0]} alt={p.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-[#964261] uppercase">{p.category}</span>
                  <h4 className="font-bold text-xs text-[#553b34] line-clamp-1">{p.name}</h4>
                  <p className="text-sm font-black text-[#553b34] font-serif mt-1">₹{p.price}</p>
                  <span className="text-[10px] text-[#2e7d32] font-semibold">In Stock ({p.stock})</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Order Pipeline */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-[#fcfae4] p-6 rounded-[2rem] border border-[#e2dcb3] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#553b34] font-serif">#{ord.id}</span>
                    <span className="bg-[#964261] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{ord.orderStatus}</span>
                  </div>
                  <p className="text-xs text-[#8d7871]">{ord.customerName} ({ord.customerPhone})</p>
                  <p className="text-xs text-[#755750]">{ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                    className="bg-[#f4f1d4] border border-[#d8d1a3] text-xs font-bold text-[#553b34] rounded-full py-1.5 px-3"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#fcfae4] border-2 border-[#964261] rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-black text-[#553b34] font-serif mb-4">Add New Ice Cream Product</h3>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Product Name (e.g. Pistachio Gelato)"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                className="w-full bg-[#f4f1d4] border border-[#d8d1a3] rounded-xl px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="bg-[#f4f1d4] border border-[#d8d1a3] rounded-xl px-3 py-2 font-bold"
                >
                  <option value="Classic">Classic</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Premium">Premium</option>
                  <option value="Sundaes">Sundaes</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Sugar-Free">Sugar-Free</option>
                </select>
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="bg-[#f4f1d4] border border-[#d8d1a3] rounded-xl px-3 py-2"
                />
              </div>
              <textarea
                placeholder="Description..."
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full bg-[#f4f1d4] border border-[#d8d1a3] rounded-xl px-3 py-2 h-20"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowAddProduct(false)} className="flex-1 py-2.5 rounded-full bg-[#f4f1d4] text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleCreateProduct} className="flex-1 py-2.5 rounded-full bg-[#964261] text-white text-xs font-bold">
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
