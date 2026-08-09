import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, RotateCcw, Plus, Info } from 'lucide-react';
import { Product, CustomBuild } from '../types';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

interface ScoopBuilderProps {
  products: Product[];
  onNavigateToCart: () => void;
}

export const ScoopBuilder: React.FC<ScoopBuilderProps> = ({ products, onNavigateToCart }) => {
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const [container, setContainer] = useState<CustomBuild['base']>('Waffle Cone');
  const [size, setSize] = useState<CustomBuild['size']>('Medium (2 Scoops)');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(['Madagascar Vanilla Bean', 'Double Dark Belgian Fudge']);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Hot Fudge', 'Rainbow Sprinkles']);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['Whipped Cream']);

  const maxScoops = size.includes('1') ? 1 : size.includes('2') ? 2 : 3;

  const bases = [
    { id: 'Waffle Cone', label: 'Artisanal Waffle Cone', price: 30, icon: '🍦', bg: 'bg-[#fff8e1]' },
    { id: 'Classic Cup', label: 'Eco Sundae Cup', price: 10, icon: '🍨', bg: 'bg-[#e1f5fe]' },
    { id: 'Chocolate Cone', label: 'Belgian Chocolate Cone', price: 40, icon: '🍫', bg: 'bg-[#efebe9]' },
    { id: 'Sundae Bowl', label: 'Grand Glass Bowl', price: 50, icon: '🍧', bg: 'bg-[#f3e5f5]' },
  ];

  const toppingsList = [
    { id: 'Hot Fudge', label: 'Hot Belgian Fudge Drizzle', price: 25, color: '#4e342e' },
    { id: 'Rainbow Sprinkles', label: 'Fun Rainbow Sprinkles', price: 15, color: '#f48fb1' },
    { id: 'Oreo Crumbles', label: 'Crunchy Oreo Crumbles', price: 20, color: '#212121' },
    { id: 'Toasted Almonds', label: 'Sliced Roasted Almonds', price: 25, color: '#d7ccc8' },
    { id: 'Cashew Crunch', label: 'Honey Cashew Brittle', price: 30, color: '#ffecb3' },
    { id: 'Maraschino Cherry', label: 'Gourmet Maraschino Cherry', price: 20, color: '#d50000' }
  ];

  const addOnsList = [
    { id: 'Fresh Waffle', label: 'Warm Baked Waffle Wedge', price: 40 },
    { id: 'Brownie', label: 'Warm Fudgy Brownie Square', price: 50 },
    { id: 'Whipped Cream', label: 'Sweet Vanilla Whipped Cream Cloud', price: 20 },
    { id: 'Honey Drizzle', label: 'Organic Wildflower Honey', price: 25 }
  ];

  // Price Calculation
  const basePrice = bases.find(b => b.id === container)?.price || 30;
  const flavorPrice = selectedFlavors.length * 70;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + (toppingsList.find(item => item.id === t)?.price || 20), 0);
  const addOnsPrice = selectedAddOns.reduce((sum, a) => sum + (addOnsList.find(item => item.id === a)?.price || 30), 0);

  const totalPrice = basePrice + flavorPrice + toppingsPrice + addOnsPrice;

  const toggleFlavor = (flavorName: string) => {
    if (selectedFlavors.includes(flavorName)) {
      setSelectedFlavors(selectedFlavors.filter(f => f !== flavorName));
    } else {
      if (selectedFlavors.length < maxScoops) {
        setSelectedFlavors([...selectedFlavors, flavorName]);
      } else {
        // Replace last scoop
        setSelectedFlavors([...selectedFlavors.slice(1), flavorName]);
      }
    }
  };

  const toggleTopping = (toppingId: string) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter(t => t !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  const toggleAddOn = (addOnId: string) => {
    if (selectedAddOns.includes(addOnId)) {
      setSelectedAddOns(selectedAddOns.filter(a => a !== addOnId));
    } else {
      setSelectedAddOns([...selectedAddOns, addOnId]);
    }
  };

  const handleAddToCart = () => {
    const customBuild: CustomBuild = {
      base: container,
      flavors: selectedFlavors,
      size,
      toppings: selectedToppings,
      addOns: selectedAddOns
    };

    addToCart({
      customBuild,
      quantity: 1,
      unitPrice: totalPrice,
      instructions: `Custom Build Scoop: ${container} with ${selectedFlavors.join(', ')}`
    });

    showToast('Custom Masterpiece Added! 🍨', `Your custom ${selectedFlavors.length}-scoop creation is in your cart.`);
  };

  // Flavor colors map for visual preview
  const getFlavorColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('vanilla')) return 'bg-[#fffde7] border-[#fff9c4] text-[#795548]';
    if (lower.includes('chocolate') || lower.includes('fudge')) return 'bg-[#5d4037] border-[#4e342e] text-[#fff8e1]';
    if (lower.includes('mango')) return 'bg-[#ffe082] border-[#ffd54f] text-[#5d4037]';
    if (lower.includes('strawberry') || lower.includes('berry')) return 'bg-[#f8bbd0] border-[#f48fb1] text-[#880e4f]';
    if (lower.includes('pistachio')) return 'bg-[#c8e6c9] border-[#a5d6a7] text-[#1b5e20]';
    if (lower.includes('mint')) return 'bg-[#b2dfdb] border-[#80cbc4] text-[#004d40]';
    return 'bg-[#ffecb3] border-[#ffe082] text-[#5d4037]';
  };

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FDF2F5] border border-[#EFCCD6] px-4 py-1.5 rounded-full text-[#964261] text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#964261]" /> Interactive Scoop Lab
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#4A3728] font-serif tracking-tight mb-4 leading-tight">
            Build Your Custom Scoop 🍨
          </h1>
          <p className="text-sm text-[#6B5A4E]">
            Mix and match your favorite artisanal bases, fresh hand-churned scoops, decadent hot dripples, and gourmet toppings to create your dream dessert!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Customizer Steps (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Step 1: Base Container */}
            <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#964261] text-white text-xs font-black flex items-center justify-center">1</span>
                  Choose Serving Base
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {bases.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setContainer(b.id as any)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                      container === b.id
                        ? 'bg-[#964261] text-white border-[#964261] shadow-md scale-105'
                        : `bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728] hover:border-[#964261]`
                    }`}
                  >
                    <span className="text-3xl mb-1">{b.icon}</span>
                    <span className="text-xs font-bold leading-tight mb-1">{b.label}</span>
                    <span className="text-[10px] font-extrabold opacity-80">+₹{b.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Size & Max Scoops */}
            <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#964261] text-white text-xs font-black flex items-center justify-center">2</span>
                  Choose Size ({maxScoops} Scoops Max)
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Small (1 Scoop)', label: 'Single Scoop', scoops: 1 },
                  { id: 'Medium (2 Scoops)', label: 'Double Scoop', scoops: 2 },
                  { id: 'Large (3 Scoops)', label: 'Triple Scoop', scoops: 3 },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => {
                      setSize(sz.id as any);
                      if (selectedFlavors.length > sz.scoops) {
                        setSelectedFlavors(selectedFlavors.slice(0, sz.scoops));
                      }
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all font-bold text-xs ${
                      size === sz.id
                        ? 'bg-[#964261] text-white border-[#964261] shadow-md'
                        : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728] hover:bg-[#EAE4D8]'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Select Flavors */}
            <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#964261] text-white text-xs font-black flex items-center justify-center">3</span>
                  Pick Your Flavors ({selectedFlavors.length}/{maxScoops} Selected)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2">
                {products.map((p) => {
                  const isSelected = selectedFlavors.includes(p.name);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleFlavor(p.name)}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                        isSelected
                          ? 'bg-[#964261] text-white border-[#964261] shadow-md'
                          : 'bg-[#F3EFE7] text-[#4A3728] border-[#E8E2D6] hover:border-[#964261]'
                      }`}
                    >
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs line-clamp-1">{p.name}</h4>
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#8C7A6B]'}`}>
                          ₹70/scoop • {p.category}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-black shrink-0 ${
                        isSelected ? 'bg-white text-[#964261]' : 'border-[#8C7A6B]'
                      }`}>
                        {isSelected ? '✓' : '+'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Toppings */}
            <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-6 shadow-sm">
              <h3 className="font-bold text-sm text-[#4A3728] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#964261] text-white text-xs font-black flex items-center justify-center">4</span>
                Add Gourmet Toppings
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {toppingsList.map((t) => {
                  const active = selectedToppings.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTopping(t.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        active
                          ? 'bg-[#964261] text-white border-[#964261] shadow-sm'
                          : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      <span className="line-clamp-1">{t.label}</span>
                      <span className="text-[10px] shrink-0 font-extrabold ml-1">+₹{t.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Add-ons */}
            <div className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-6 shadow-sm">
              <h3 className="font-bold text-sm text-[#4A3728] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#964261] text-white text-xs font-black flex items-center justify-center">5</span>
                Decadent Add-ons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {addOnsList.map((a) => {
                  const active = selectedAddOns.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleAddOn(a.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        active
                          ? 'bg-[#964261] text-white border-[#964261] shadow-sm'
                          : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      <span>{a.label}</span>
                      <span className="text-[10px] font-extrabold">+₹{a.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Visual Assembly & Price Card (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-[#FFFFFF] border-2 border-[#964261] rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden">
              
              <div className="text-center pb-4 border-b border-[#E8E2D6] mb-6">
                <span className="text-[10px] font-black uppercase text-[#964261] tracking-widest">Live Dessert Assembly</span>
                <h3 className="text-xl font-black text-[#4A3728] font-serif">Your Artisanal Creation</h3>
              </div>

              {/* Animated Visual Bowl/Cone Display */}
              <div className="w-full h-64 bg-[#FDFBF7] rounded-[2rem] border border-[#E8E2D6] flex flex-col items-center justify-end p-6 mb-6 relative overflow-hidden shadow-inner">
                
                {/* Toppings Dripping Overlay */}
                {selectedToppings.includes('Hot Fudge') && (
                  <div className="absolute top-0 inset-x-0 h-10 bg-[#4A3728]/80 rounded-b-full animate-bounce z-20 flex items-center justify-center text-[10px] text-white font-bold">
                    🍫 Hot Fudge Dripping...
                  </div>
                )}

                {/* Whipped Cream Top */}
                {selectedAddOns.includes('Whipped Cream') && (
                  <div className="w-20 h-12 bg-white rounded-full border border-[#E8E2D6] shadow-md flex items-center justify-center text-xs font-extrabold text-[#964261] z-10 -mb-4 animate-pulse">
                    ☁️ Whipped
                  </div>
                )}

                {/* Stacked Flavor Scoops */}
                <div className="flex flex-col items-center -space-y-4 z-10 mb-2">
                  {selectedFlavors.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#8C7A6B] italic">
                      Pick at least 1 flavor to begin stacking! 🍦
                    </div>
                  ) : (
                    selectedFlavors.map((flv, idx) => (
                      <div
                        key={idx}
                        className={`w-28 h-16 rounded-full border-2 shadow-lg flex items-center justify-center font-bold text-xs px-2 text-center transform transition-all hover:scale-105 ${getFlavorColor(flv)}`}
                      >
                        <span className="line-clamp-1">{flv}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Base Container Graphic */}
                <div className="w-32 h-20 bg-[#F3EFE7] border-2 border-[#4A3728] rounded-b-3xl flex items-center justify-center shadow-md text-sm font-black text-[#4A3728]">
                  {container === 'Waffle Cone' ? '🍦 Waffle Cone' : container === 'Chocolate Cone' ? '🍫 Choco Cone' : '🍨 Sundae Bowl'}
                </div>

                {/* Sprinkles Floating Effect */}
                {selectedToppings.includes('Rainbow Sprinkles') && (
                  <div className="absolute inset-0 pointer-events-none opacity-40 flex items-center justify-center gap-4 text-xs">
                    <span>✨</span><span>🌟</span><span>💫</span><span>✨</span>
                  </div>
                )}

              </div>

              {/* Summary Breakdown */}
              <div className="space-y-2 text-xs border-b border-[#E8E2D6] pb-4 mb-4">
                <div className="flex justify-between text-[#4A3728]">
                  <span>Serving Base ({container}):</span>
                  <strong className="font-serif">₹{basePrice}</strong>
                </div>
                <div className="flex justify-between text-[#4A3728]">
                  <span>Scoops ({selectedFlavors.length}x ₹70):</span>
                  <strong className="font-serif">₹{flavorPrice}</strong>
                </div>
                {selectedToppings.length > 0 && (
                  <div className="flex justify-between text-[#4A3728]">
                    <span>Toppings ({selectedToppings.length} items):</span>
                    <strong className="font-serif">₹{toppingsPrice}</strong>
                  </div>
                )}
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between text-[#4A3728]">
                    <span>Add-ons ({selectedAddOns.length} items):</span>
                    <strong className="font-serif">₹{addOnsPrice}</strong>
                  </div>
                )}
              </div>

              {/* Total Price Bar */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-[#8C7A6B] font-bold uppercase">Total Custom Price</span>
                <span className="text-3xl font-black text-[#4A3728] font-serif">₹{totalPrice}</span>
              </div>

              {/* Add To Cart */}
              <button
                onClick={handleAddToCart}
                disabled={selectedFlavors.length === 0}
                className={`w-full py-4 rounded-full text-sm font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_#6A2B43] transition-all ${
                  selectedFlavors.length > 0
                    ? 'bg-[#964261] hover:bg-[#7A324E] text-white hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-[#E8E2D6] text-[#8C7A6B] cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Scoop To Cart - ₹{totalPrice}</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
