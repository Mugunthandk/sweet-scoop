import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { KidsJoyBanner } from './components/KidsJoyBanner';
import { ArtisanalFlavorsHero } from './components/ArtisanalFlavorsHero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ScoopBuilder } from './components/ScoopBuilder';
import { ScoopMoodEngine } from './components/ScoopMoodEngine';
import { SmartComboBuilder } from './components/SmartComboBuilder';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { AIRecommendationsSection } from './components/AIRecommendationsSection';
import { ScoopBotWidget } from './components/ScoopBotWidget';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { StoreLocatorSection } from './components/StoreLocatorSection';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { KitchenDashboard } from './components/KitchenDashboard';
import { DeliveryDashboard } from './components/DeliveryDashboard';
import { AuthModal } from './components/AuthModals';

import { Product, Order } from './types';
import { Sparkles, Tag, Award, Check, Search, Filter } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activePage, setActivePage] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Catalog Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterSugarFree, setFilterSugarFree] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, filterVegan, filterSugarFree, sortOption]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('q', searchQuery);
      if (filterVegan) params.append('isVegan', 'true');
      if (filterSugarFree) params.append('isSugarFree', 'true');
      if (sortOption) params.append('sort', sortOption);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const categories = ['All', 'Classic', 'Chocolate', 'Fruit', 'Premium', 'Sundaes', 'Cookies & Cream', 'Vegan', 'Sugar-Free', 'Seasonal', 'Combos'];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3728] font-sans flex flex-col antialiased selection:bg-[#FDF2F5] selection:text-[#964261]">
      
      {/* Navigation Bar */}
      <Navbar
        onNavigate={setActivePage}
        activePage={activePage}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* Page 1: Home View */}
        {activePage === 'home' && (
          <>
            <Hero
              onNavigateToFlavors={() => setActivePage('flavors')}
              onNavigateToBuilder={() => setActivePage('builder')}
              onNavigateToMood={() => setActivePage('mood-engine')}
              onNavigateToCombos={() => setActivePage('smart-combos')}
            />

            {/* AI Personalization & Craving Engine */}
            <AIRecommendationsSection
              onOpenDetails={setSelectedProduct}
            />

            {/* Kids & Family Joy Banner with Children Eating Ice Cream */}
            <KidsJoyBanner onNavigateToFlavors={() => setActivePage('flavors')} />

            {/* Bestseller Grid */}
            <section className="py-16 bg-[#F3EFE7]/50 border-t border-[#E8E2D6]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-black uppercase tracking-widest text-[#964261]">Handcrafted Masterpieces</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#4A3728] font-serif mt-1">Our Featured Artisanal Scoops</h2>
                  <p className="text-xs sm:text-sm text-[#6B5A4E] mt-2">
                    Churned fresh every morning in Indiranagar using organic grass-fed dairy and premium imported cocoa.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} onOpenDetails={setSelectedProduct} />
                  ))}
                </div>

                <div className="text-center mt-10">
                  <button
                    onClick={() => setActivePage('flavors')}
                    className="px-8 py-3.5 rounded-full bg-[#FFFFFF] border-2 border-[#964261] text-[#964261] hover:bg-[#964261] hover:text-white font-black text-xs transition-all shadow-sm"
                  >
                    View All 20+ Artisanal Flavors →
                  </button>
                </div>

              </div>
            </section>
          </>
        )}

        {/* Page 2: Full Flavors Catalog */}
        {activePage === 'flavors' && (
          <div className="py-8 bg-[#FDFBF7] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Wow Hero Photo Header for Artisanal Flavors */}
              <ArtisanalFlavorsHero
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                filterVegan={filterVegan}
                setFilterVegan={setFilterVegan}
                filterSugarFree={filterSugarFree}
                setFilterSugarFree={setFilterSugarFree}
                sortOption={sortOption}
                setSortOption={setSortOption}
                totalFlavorsCount={products.length}
              />

              {/* Products Catalog - Grouped by Section */}
              {products.length === 0 ? (
                <div className="py-16 text-center bg-[#F3EFE7] rounded-3xl border border-[#E8E2D6]">
                  <span className="text-4xl block mb-2">🍨</span>
                  <h3 className="text-lg font-black text-[#4A3728]">No matching artisanal flavors found</h3>
                  <p className="text-xs text-[#6B5A4E] mt-1">Try resetting filters or searching for different ingredients like chocolate, berry, or vanilla.</p>
                </div>
              ) : selectedCategory !== 'All' || searchQuery ? (
                /* Filtered Single Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} onOpenDetails={setSelectedProduct} />
                  ))}
                </div>
              ) : (
                /* Grouped by Distinct Sections */
                <div className="space-y-12">
                  {[
                    { title: '🍫 Rich Chocolate & Dark Fudge Section', desc: 'Indulgent, decadent 70% Belgian chocolate, truffles & brownies', cats: ['Chocolate', 'Cookies & Cream'] },
                    { title: '🥭 Tropical Fruit & Fresh Berry Section', desc: 'Real fruit sorbets & berry swirls packed with natural sweetness', cats: ['Fruit'] },
                    { title: '👑 Royal Nutty & Gourmet Specials Section', desc: 'Caramelised praline, pistachio, saffron & roasted nut blends', cats: ['Premium', 'Seasonal'] },
                    { title: '🌱 100% Plant-Based & Guilt-Free Section', desc: 'Dairy-free oat/coconut cream & monk fruit naturally sweetened scoops', cats: ['Vegan', 'Sugar-Free'] },
                    { title: '🍦 Timeless Classic Creams Section', desc: 'Pure Madagascar vanilla, heritage recipe creams & butterscotch', cats: ['Classic'] },
                    { title: '🍨 Signature Sundaes & Party Combos Section', desc: 'Multi-layer artisanal sundae tubs & celebration scoop bundles', cats: ['Sundaes', 'Combos'] },
                  ].map((sec) => {
                    const secProducts = products.filter(p => sec.cats.includes(p.category));
                    if (secProducts.length === 0) return null;
                    return (
                      <section key={sec.title} className="bg-[#F3EFE7]/40 p-6 sm:p-8 rounded-[2.5rem] border border-[#E8E2D6]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#E8E2D6] gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#964261] bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#E8E2D6]">
                              Artisanal Category Section
                            </span>
                            <h3 className="text-2xl font-black text-[#4A3728] font-serif mt-1">
                              {sec.title}
                            </h3>
                            <p className="text-xs text-[#6B5A4E] mt-0.5">{sec.desc}</p>
                          </div>
                          <span className="text-xs font-bold text-[#964261] bg-[#FFFFFF] px-3 py-1.5 rounded-full border border-[#E8E2D6] self-start sm:self-center">
                            {secProducts.length} Flavors
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {secProducts.map((product) => (
                            <ProductCard key={product.id} product={product} onOpenDetails={setSelectedProduct} />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Page 3: Custom Scoop Builder */}
        {activePage === 'builder' && (
          <ScoopBuilder
            products={products}
            onNavigateToCart={() => setIsCartOpen(true)}
          />
        )}

        {/* Page 4: Scoop Mood Engine */}
        {activePage === 'mood-engine' && (
          <ScoopMoodEngine
            products={products}
            onNavigateToCart={() => setIsCartOpen(true)}
          />
        )}

        {/* Page 5: Smart Combo Builder */}
        {activePage === 'smart-combos' && (
          <SmartComboBuilder
            products={products}
            onNavigateToCart={() => setIsCartOpen(true)}
          />
        )}

        {/* Page 6: Offers & Coupons */}
        {activePage === 'offers' && (
          <div className="py-12 bg-[#FDFBF7] min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <span className="text-xs font-black uppercase text-[#964261] tracking-wider block mb-2">Special Promotions</span>
                <h1 className="text-3xl sm:text-5xl font-black text-[#4A3728] font-serif">Coupons & Sweet Deals 🎟️</h1>
              </div>

              <div className="space-y-4">
                {[
                  { code: 'SCOOP20', desc: 'Get 20% OFF on all orders above ₹300 (Max discount ₹150)', badge: 'Most Popular' },
                  { code: 'WELCOME50', desc: 'Flat ₹50 OFF on your first Sweet Scoop purchase of ₹200+', badge: 'New Customer' },
                  { code: 'SWEETVIP', desc: 'Exclusive 25% OFF for Sweet Scoop VIP Members', badge: 'VIP Only' }
                ].map((c) => (
                  <div key={c.code} className="bg-[#FFFFFF] border-2 border-[#964261] rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                      <span className="bg-[#FDF2F5] text-[#964261] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase mb-2 inline-block">
                        {c.badge}
                      </span>
                      <h3 className="text-2xl font-black text-[#964261] font-mono tracking-wider">{c.code}</h3>
                      <p className="text-xs text-[#6B5A4E] mt-1">{c.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(c.code);
                        showToast('Coupon Code Copied! 🎟️', `Code '${c.code}' copied to clipboard.`);
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#964261] text-white text-xs font-bold shadow-sm hover:bg-[#7A324E]"
                    >
                      Copy Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Page 7: Stores Locator */}
        {activePage === 'stores' && <StoreLocatorSection />}

        {/* Page 8: Customer Profile & Orders */}
        {(activePage === 'profile' || activePage === 'orders' || activePage === 'wishlist') && (
          <CustomerDashboard
            onNavigateToFlavors={() => setActivePage('flavors')}
            onOpenOrderTracker={setTrackedOrder}
            products={products}
          />
        )}

        {/* Page 9: Admin Dashboard */}
        {activePage === 'admin' && (
          <AdminDashboard products={products} onRefreshProducts={fetchProducts} />
        )}

        {/* Page 10: Kitchen Dashboard */}
        {activePage === 'kitchen' && <KitchenDashboard />}

        {/* Page 11: Delivery Rider Dashboard */}
        {activePage === 'delivery' && <DeliveryDashboard />}

      </main>

      {/* Footer */}
      <Footer onNavigate={setActivePage} />

      {/* Global Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Global Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setTrackedOrder(order)}
      />

      {/* Product Inspection Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Live Order Tracker Modal */}
      <OrderTracker
        order={trackedOrder}
        onClose={() => setTrackedOrder(null)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Floating ScoopBot AI Concierge Widget */}
      <ScoopBotWidget />

      {/* Persistent Accessibility Center Toolbar */}
      <AccessibilityToolbar />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <MainAppContent />
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
