import React, { useState } from 'react';
import { Sparkles, Heart, ShoppingBag, ArrowRight, RefreshCw, Check, Smile, Flame, Moon, Coffee, PartyPopper } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

interface ScoopMoodEngineProps {
  products: Product[];
  onNavigateToCart: () => void;
}

interface MoodOption {
  id: string;
  name: string;
  emoji: string;
  icon: React.ElementType;
  tagline: string;
  gradient: string;
  recommendedFlavors: string[];
  recommendedBase: string;
  recommendedToppings: string[];
  recommendedAddOn: string;
  discountMessage: string;
  basePrice: number;
  discountedPrice: number;
}

const MOODS: MoodOption[] = [
  {
    id: 'happy',
    name: 'Feeling Happy & Energetic',
    emoji: '😎',
    icon: Smile,
    tagline: 'Bright tropical citrus, Alphonso mango & crunchy waffle cone joy!',
    gradient: 'from-[#964261] to-[#C2185B]',
    recommendedFlavors: ['Alphonso Mango Sorbet', 'Madagascar Vanilla Bean'],
    recommendedBase: 'Waffle Cone',
    recommendedToppings: ['Fresh Mango Cubes', 'Rainbow Sprinkles'],
    recommendedAddOn: 'Whipped Cream',
    discountMessage: 'Happy Vibe 15% Combo Discount Applied!',
    basePrice: 280,
    discountedPrice: 238,
  },
  {
    id: 'comfort',
    name: 'Need Choco Comfort & Warmth',
    emoji: '🍫',
    icon: Flame,
    tagline: 'Rich 70% Belgian dark chocolate fudge with warm brownie bytes.',
    gradient: 'from-[#4A3728] to-[#2D1B0E]',
    recommendedFlavors: ['Double Dark Belgian Fudge', 'Cookies & Cream Crunch'],
    recommendedBase: 'Chocolate Dipped Cone',
    recommendedToppings: ['Hot Fudge Drizzle', 'Roasted Hazelnut Flakes'],
    recommendedAddOn: 'Fudge Brownie Bite',
    discountMessage: 'Choco Therapy 20% Discount Applied!',
    basePrice: 320,
    discountedPrice: 256,
  },
  {
    id: 'chill',
    name: 'Chill & Relaxed Vibes',
    emoji: '🍦',
    icon: Moon,
    tagline: 'Smooth Madagascar vanilla, salted caramel dripple & lotus biscoff.',
    gradient: 'from-[#8C7A6B] to-[#5C4D42]',
    recommendedFlavors: ['Madagascar Vanilla Bean', 'Sea Salted Caramel Macchiato'],
    recommendedBase: 'Sundae Bowl',
    recommendedToppings: ['Caramel Drizzle', 'Lotus Biscoff Crumb'],
    recommendedAddOn: 'Extra Waffle Wafer',
    discountMessage: 'Chill Session 15% OFF!',
    basePrice: 290,
    discountedPrice: 246,
  },
  {
    id: 'romantic',
    name: 'Romantic Date Night',
    emoji: '💕',
    icon: Heart,
    tagline: 'Sweet garden strawberry preserves with white chocolate shavings.',
    gradient: 'from-[#E91E63] to-[#880E4F]',
    recommendedFlavors: ['Vegan Coconut Strawberry Delight', 'Wild Berry Cheesecake Swirl'],
    recommendedBase: 'Waffle Cone',
    recommendedToppings: ['White Choco Chips', 'Wild Berry Compote'],
    recommendedAddOn: 'Edible Gold Sprinkles',
    discountMessage: 'Sweetheart Couple Special 20% OFF!',
    basePrice: 310,
    discountedPrice: 248,
  },
  {
    id: 'focus',
    name: 'High Focus & Late Night Study',
    emoji: '⚡',
    icon: Coffee,
    tagline: 'Double shot espresso gelato with dark chocolate cocoa nibs.',
    gradient: 'from-[#3E2723] to-[#1B0000]',
    recommendedFlavors: ['Sea Salted Caramel Macchiato', 'Sugar-Free Hazelnut Dark Cocoa'],
    recommendedBase: 'Sundae Bowl',
    recommendedToppings: ['Roasted Almond Flakes', 'Espresso Powder Drizzle'],
    recommendedAddOn: 'Dark Cocoa Nibs',
    discountMessage: 'Late Night Focus 15% Discount!',
    basePrice: 295,
    discountedPrice: 250,
  },
  {
    id: 'party',
    name: 'Party & Celebration Mode',
    emoji: '🥳',
    icon: PartyPopper,
    tagline: 'Rainbow sprinkle overload with birthday cake fudge and extra scoops!',
    gradient: 'from-[#964261] to-[#E91E63]',
    recommendedFlavors: ['Royal Nutty Sundae Supreme', 'Alphonso Mango Sorbet', 'Double Dark Belgian Fudge'],
    recommendedBase: 'Grand Party Bowl',
    recommendedToppings: ['Rainbow Sprinkles', 'Hot Fudge Drizzle', 'Roasted Hazelnut Flakes'],
    recommendedAddOn: 'Whipped Cream & Cherry',
    discountMessage: 'Party Celebration 25% OFF!',
    basePrice: 420,
    discountedPrice: 315,
  }
];

export const ScoopMoodEngine: React.FC<ScoopMoodEngineProps> = ({ products, onNavigateToCart }) => {
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const [selectedMood, setSelectedMood] = useState<MoodOption>(MOODS[0]);
  const [customToppings, setCustomToppings] = useState<string[]>(selectedMood.recommendedToppings);
  const [selectedContainer, setSelectedContainer] = useState<string>(selectedMood.recommendedBase);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
    setCustomToppings(mood.recommendedToppings);
    setSelectedContainer(mood.recommendedBase);
    setAiAnalysis(null);
  };

  const handleToggleTopping = (topping: string) => {
    if (customToppings.includes(topping)) {
      setCustomToppings(customToppings.filter(t => t !== topping));
    } else {
      setCustomToppings([...customToppings, topping]);
    }
  };

  const handleFetchAiMoodMatch = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          craving: selectedMood.tagline,
          mood: selectedMood.name,
          dietary: 'None'
        })
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setAiAnalysis(data[0].reason || `Perfect match for your ${selectedMood.name} mood!`);
      } else {
        setAiAnalysis(`AI Pairing: The combination of ${selectedMood.recommendedFlavors.join(' & ')} elevates endorphins and perfectly satisfies a ${selectedMood.name} mood! 🍦✨`);
      }
    } catch (err) {
      setAiAnalysis(`AI Pairing: The combination of ${selectedMood.recommendedFlavors.join(' & ')} elevates endorphins and perfectly satisfies a ${selectedMood.name} mood! 🍦✨`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddMoodComboToCart = () => {
    const matchedProduct = products.find(p => p.name.includes(selectedMood.recommendedFlavors[0])) || products[0];

    addToCart(matchedProduct, {
      size: 'Double Scoop',
      container: selectedContainer as any,
      toppings: customToppings,
      specialInstructions: `Mood Engine Creation: ${selectedMood.name} (${selectedMood.emoji})`
    });

    showToast(
      'Mood Combo Added! 🍨',
      `${selectedMood.name} combo added to cart with ₹${selectedMood.basePrice - selectedMood.discountedPrice} discount!`
    );
    onNavigateToCart();
  };

  return (
    <section className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FDF2F5] border border-[#EFCCD6] px-4 py-1.5 rounded-full text-[#964261] text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#964261]" /> Signature AI Scoop Matcher
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#4A3728] font-serif tracking-tight mb-3">
            What's Your Vibe Today? 🎭
          </h1>
          <p className="text-sm text-[#6B5A4E] leading-relaxed">
            Choose your current mood and let our automated Scoop Engine handpick the ideal artisanal flavors, toppings, and sauces designed to match your emotion!
          </p>
        </div>

        {/* Step 1: Choose Your Mood Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {MOODS.map((m) => {
            const isSelected = selectedMood.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMood(m)}
                className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#964261] shadow-xl scale-105 ring-4 ring-[#FDF2F5]'
                    : 'bg-[#FFFFFF] border-[#E8E2D6] hover:border-[#964261]/60 text-[#4A3728]'
                }`}
              >
                <span className="text-4xl mb-2 transition-transform hover:scale-125 block">{m.emoji}</span>
                <strong className="text-xs font-black leading-tight text-[#4A3728] mb-1">{m.name.split(' ')[0]} {m.name.split(' ')[1]}</strong>
                <span className="text-[10px] text-[#8C7A6B] line-clamp-1">{m.tagline.split(' ')[0]} {m.tagline.split(' ')[1]}</span>

                {isSelected && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-[#964261] rounded-full border-2 border-white shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Step 2: Interactive Mood Combo Card */}
        <div className="bg-[#FFFFFF] border-2 border-[#964261] rounded-[2.5rem] p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Visual Scoop Graphics */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              
              <div className={`w-full h-72 rounded-[2rem] bg-gradient-to-br ${selectedMood.gradient} p-6 text-white flex flex-col justify-between relative shadow-inner overflow-hidden`}>
                
                <div className="flex items-center justify-between text-xs font-bold bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <span>{selectedMood.emoji} Mood Match</span>
                  <span className="bg-white text-[#964261] px-2 py-0.5 rounded-full text-[10px] font-black">
                    Save ₹{selectedMood.basePrice - selectedMood.discountedPrice}
                  </span>
                </div>

                <div className="my-auto">
                  <span className="text-6xl block mb-2 animate-bounce">{selectedMood.emoji}</span>
                  <h3 className="text-2xl font-black font-serif">{selectedMood.name}</h3>
                  <p className="text-xs text-white/80 mt-1">{selectedMood.tagline}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 text-left text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="opacity-80">Included Flavors:</span>
                    <strong>{selectedMood.recommendedFlavors.join(' + ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Serving Base:</span>
                    <strong>{selectedContainer}</strong>
                  </div>
                </div>

              </div>

              {/* AI Assistant Button */}
              <button
                onClick={handleFetchAiMoodMatch}
                disabled={isAnalyzing}
                className="mt-4 px-5 py-2.5 rounded-full bg-[#FDF2F5] border border-[#EFCCD6] text-[#964261] text-xs font-black hover:bg-[#F9E4EB] transition-all flex items-center gap-2"
              >
                {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Ask AI Mood Analyzer</span>
              </button>

              {aiAnalysis && (
                <div className="mt-3 p-3 rounded-2xl bg-[#F3EFE7] border border-[#E8E2D6] text-left text-xs text-[#4A3728] animate-fade-in">
                  <strong className="block text-[10px] font-extrabold uppercase text-[#964261] mb-1">🤖 AI Mood Analysis</strong>
                  <p className="italic text-[11px] leading-relaxed">{aiAnalysis}</p>
                </div>
              )}

            </div>

            {/* Right Column: Customization Controls & Instant Checkout */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <span className="text-[10px] font-extrabold text-[#964261] uppercase tracking-widest block mb-1">
                  Step 2 of 3 • Customization
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#4A3728] font-serif">
                  {selectedMood.name} Combo 🍨
                </h2>
                <p className="text-xs text-[#6B5A4E] mt-1">
                  We've assembled the perfect pairing below. You can tweak toppings and serving base as you like!
                </p>
              </div>

              {/* Serving Base Selector */}
              <div>
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-2">
                  Choose Serving Base
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Waffle Cone', 'Chocolate Dipped Cone', 'Sundae Bowl'].map((base) => (
                    <button
                      key={base}
                      onClick={() => setSelectedContainer(base)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                        selectedContainer === base
                          ? 'bg-[#964261] text-white border-[#964261] shadow-md'
                          : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      {base}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings Selector */}
              <div>
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-2">
                  Handpicked Toppings
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Hot Fudge Drizzle', 'Fresh Mango Cubes', 'Rainbow Sprinkles',
                    'Roasted Hazelnut Flakes', 'Lotus Biscoff Crumb', 'Caramel Drizzle',
                    'White Choco Chips', 'Wild Berry Compote'
                  ].map((top) => {
                    const isSelected = customToppings.includes(top);
                    return (
                      <button
                        key={top}
                        onClick={() => handleToggleTopping(top)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#964261] text-white border-[#964261] shadow-sm'
                            : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728] hover:bg-[#EAE4D8]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{top}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discounted Price Bar & Order CTA */}
              <div className="pt-4 border-t border-[#E8E2D6] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider block">Special Combo Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#4A3728] font-serif">₹{selectedMood.discountedPrice}</span>
                    <span className="text-sm font-semibold text-[#8C7A6B] line-through">₹{selectedMood.basePrice}</span>
                    <span className="text-xs text-[#2e7d32] font-extrabold bg-[#e8f5e9] px-2 py-0.5 rounded-full">
                      {selectedMood.discountMessage}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddMoodComboToCart}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#964261] hover:bg-[#7A324E] text-white text-sm font-black flex items-center justify-center gap-3 shadow-[0_4px_0_0_#6A2B43] transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Mood Combo - ₹{selectedMood.discountedPrice}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
