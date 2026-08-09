import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, Plus, Trash2, Award, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

interface SmartComboBuilderProps {
  products: Product[];
  onNavigateToCart: () => void;
}

export const SmartComboBuilder: React.FC<SmartComboBuilderProps> = ({ products, onNavigateToCart }) => {
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const [comboSize, setComboSize] = useState<2 | 4 | 6>(4);
  const [selectedFlavors, setSelectedFlavors] = useState<Product[]>([]);
  const [selectedBase, setSelectedBase] = useState<string>('Artisanal Waffle Cone');
  const [selectedTopping, setSelectedTopping] = useState<string>('Hot Belgian Fudge');

  const discountPercents = { 2: 15, 4: 20, 6: 25 };
  const currentDiscountPercent = discountPercents[comboSize];

  const flavorUnitPrice = 120; // Regular price per scoop
  const originalSubtotal = selectedFlavors.length * flavorUnitPrice + 30; // base + topping
  const savingsAmount = Math.round((originalSubtotal * currentDiscountPercent) / 100);
  const finalComboPrice = Math.max(0, originalSubtotal - savingsAmount);

  const handleAddFlavor = (product: Product) => {
    if (selectedFlavors.length >= comboSize) {
      showToast('Combo Limit Reached', `You have already selected ${comboSize} flavors for this combo!`, 'info');
      return;
    }
    setSelectedFlavors([...selectedFlavors, product]);
  };

  const handleRemoveFlavor = (index: number) => {
    const updated = [...selectedFlavors];
    updated.splice(index, 1);
    setSelectedFlavors(updated);
  };

  const handleAddComboToCart = () => {
    if (selectedFlavors.length === 0) {
      showToast('Select Flavors', 'Please pick at least 1 flavor to build your combo!', 'error');
      return;
    }

    const mainProduct = selectedFlavors[0];
    const flavorNames = selectedFlavors.map(p => p.name).join(', ');

    addToCart(mainProduct, {
      size: `${comboSize}-Scoop Smart Combo (${currentDiscountPercent}% OFF)`,
      container: selectedBase as any,
      toppings: [selectedTopping],
      specialInstructions: `Smart Combo (${comboSize} Scoops): ${flavorNames}`
    });

    showToast(
      'Smart Combo Added! 🎁',
      `${comboSize}-Scoop Combo added to cart! You saved ₹${savingsAmount}! 🎉`
    );
    onNavigateToCart();
  };

  return (
    <section className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FDF2F5] border border-[#EFCCD6] px-4 py-1.5 rounded-full text-[#964261] text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#964261]" /> Smart Savings Lab
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#4A3728] font-serif tracking-tight mb-3">
            Smart Scoop Combo Builder 🎁
          </h1>
          <p className="text-sm text-[#6B5A4E] leading-relaxed">
            Select your combo size, mix any artisanal flavors of your choice, and enjoy up to <strong className="text-[#964261]">25% OFF</strong> automatically calculated instantly!
          </p>
        </div>

        {/* Step 1: Combo Tier Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { size: 2, label: 'Duo Scoop Combo', discount: '15% OFF', desc: 'Ideal for 1-2 dessert lovers', badge: 'Popular' },
            { size: 4, label: 'Quartet Party Box', discount: '20% OFF', desc: 'Best value for families & friends', badge: 'Best Seller' },
            { size: 6, label: 'Super 6 Family Pack', discount: '25% OFF', desc: 'Maximum discount & party savings', badge: 'Super Saver' }
          ].map((tier) => {
            const isSelected = comboSize === tier.size;
            return (
              <button
                key={tier.size}
                onClick={() => {
                  setComboSize(tier.size as any);
                  if (selectedFlavors.length > tier.size) {
                    setSelectedFlavors(selectedFlavors.slice(0, tier.size));
                  }
                }}
                className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#964261] shadow-xl ring-4 ring-[#FDF2F5]'
                    : 'bg-[#FFFFFF] border-[#E8E2D6] hover:border-[#964261] text-[#4A3728]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-[#964261] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      {tier.badge}
                    </span>
                    <span className="text-sm font-black text-[#2e7d32] font-mono bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">
                      {tier.discount}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#4A3728] font-serif mt-2">{tier.label}</h3>
                  <p className="text-xs text-[#8C7A6B] mt-1">{tier.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E2D6] flex items-center justify-between text-xs font-bold text-[#4A3728]">
                  <span>Pick {tier.size} Flavors</span>
                  <span className="text-[#964261]">Select →</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Builder Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Flavor Picker */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2.5rem] p-6 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#4A3728] font-serif">
                  Choose Your {comboSize} Flavors ({selectedFlavors.length}/{comboSize})
                </h3>
                <p className="text-xs text-[#8C7A6B]">Click on any artisanal scoop to add it to your combo</p>
              </div>
              <span className="text-xs font-extrabold text-[#964261] bg-[#FDF2F5] px-3 py-1 rounded-full border border-[#EFCCD6]">
                {currentDiscountPercent}% OFF ACTIVE
              </span>
            </div>

            {/* Flavor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
              {products.map((p) => {
                const countInCombo = selectedFlavors.filter(f => f.id === p.id).length;
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl border border-[#E8E2D6] bg-[#F3EFE7] hover:border-[#964261] transition-all flex items-center justify-between gap-3"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#4A3728] line-clamp-1">{p.name}</h4>
                      <span className="text-[10px] text-[#8C7A6B] block">{p.category} • ₹{flavorUnitPrice}</span>
                    </div>

                    <button
                      onClick={() => handleAddFlavor(p)}
                      disabled={selectedFlavors.length >= comboSize}
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                        selectedFlavors.length >= comboSize
                          ? 'bg-[#E8E2D6] text-[#8C7A6B] cursor-not-allowed'
                          : 'bg-[#964261] text-white hover:bg-[#7A324E] shadow-sm'
                      }`}
                    >
                      {countInCombo > 0 ? `+${countInCombo}` : '+'}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Live Combo Summary & Savings */}
          <div className="lg:col-span-5 sticky top-28 bg-[#FFFFFF] border-2 border-[#964261] rounded-[2.5rem] p-6 shadow-xl space-y-6">
            
            <div className="border-b border-[#E8E2D6] pb-4">
              <span className="text-[10px] font-black uppercase text-[#964261] tracking-widest block">Live Combo Summary</span>
              <h3 className="text-xl font-black text-[#4A3728] font-serif">{comboSize}-Scoop Custom Bundle</h3>
            </div>

            {/* Selected Flavors List */}
            <div className="space-y-2 min-h-[140px]">
              <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider">
                Selected Scoops ({selectedFlavors.length}/{comboSize})
              </label>

              {selectedFlavors.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-[#E8E2D6] text-center text-xs text-[#8C7A6B]">
                  Click '+' on the left to pick your {comboSize} favorite flavors! 🍦
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedFlavors.map((flv, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F3EFE7] border border-[#E8E2D6] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#964261] text-white font-extrabold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-[#4A3728]">{flv.name}</span>
                      </div>
                      <button onClick={() => handleRemoveFlavor(idx)} className="text-[#8C7A6B] hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Base & Topping Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Serving Base</label>
                <select
                  value={selectedBase}
                  onChange={(e) => setSelectedBase(e.target.value)}
                  className="w-full bg-[#F3EFE7] border border-[#E8E2D6] rounded-xl px-3 py-2 text-xs font-bold text-[#4A3728]"
                >
                  <option value="Artisanal Waffle Cone">Waffle Cone 🍦</option>
                  <option value="Chocolate Dipped Cone">Choco Cone 🍫</option>
                  <option value="Sundae Party Tub">Party Tub 🍨</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">Included Topping</label>
                <select
                  value={selectedTopping}
                  onChange={(e) => setSelectedTopping(e.target.value)}
                  className="w-full bg-[#F3EFE7] border border-[#E8E2D6] rounded-xl px-3 py-2 text-xs font-bold text-[#4A3728]"
                >
                  <option value="Hot Belgian Fudge">Hot Belgian Fudge 🍫</option>
                  <option value="Caramel Drizzle">Caramel Drizzle 🍯</option>
                  <option value="Rainbow Sprinkles">Rainbow Sprinkles 🌈</option>
                </select>
              </div>
            </div>

            {/* Savings & Price Breakdown Card */}
            <div className="bg-[#FDF2F5] border border-[#EFCCD6] rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#6B5A4E]">
                <span>Original Retail Price:</span>
                <span className="line-through font-serif">₹{originalSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#2e7d32] font-extrabold">
                <span>Combo Discount ({currentDiscountPercent}%):</span>
                <span>- ₹{savingsAmount}</span>
              </div>
              <div className="pt-2 border-t border-[#EFCCD6] flex justify-between items-baseline">
                <span className="font-extrabold text-[#4A3728] uppercase">Final Smart Price:</span>
                <span className="text-3xl font-black text-[#964261] font-serif">₹{finalComboPrice}</span>
              </div>
            </div>

            {/* You Saved Badge */}
            {savingsAmount > 0 && (
              <div className="bg-[#e8f5e9] border border-[#a5d6a7] text-[#2e7d32] text-xs font-extrabold p-3 rounded-2xl text-center animate-pulse">
                🎉 Congratulations! You are saving ₹{savingsAmount} on this Smart Combo!
              </div>
            )}

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddComboToCart}
              disabled={selectedFlavors.length === 0}
              className={`w-full py-4 rounded-full text-sm font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_#6A2B43] transition-all ${
                selectedFlavors.length > 0
                  ? 'bg-[#964261] hover:bg-[#7A324E] text-white hover:scale-[1.02]'
                  : 'bg-[#E8E2D6] text-[#8C7A6B] cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Smart Combo - ₹{finalComboPrice}</span>
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
