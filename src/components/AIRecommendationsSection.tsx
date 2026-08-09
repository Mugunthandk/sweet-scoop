import React, { useState } from 'react';
import { Sparkles, RefreshCw, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

interface AIRecommendationsSectionProps {
  onOpenDetails: (product: Product) => void;
}

export const AIRecommendationsSection: React.FC<AIRecommendationsSectionProps> = ({ onOpenDetails }) => {
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const [craving, setCraving] = useState<string>('Rich & Chocolatey');
  const [dietary, setDietary] = useState<string>('None');
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<{ product: Product; reason: string }[]>([]);

  const cravingPresets = [
    { label: '✨ All Category Sections', value: 'All Sections' },
    { label: '🍫 Rich & Chocolatey', value: 'Rich & Chocolatey' },
    { label: '🥭 Fruity Refreshment', value: 'Fruity Refreshment' },
    { label: '👑 Royal Nutty Luxury', value: 'Royal Nutty Luxury' },
    { label: '🌱 100% Plant-Based', value: 'Vegan' },
    { label: '✨ Guilt-Free Sugarless', value: 'Sugar-Free' },
  ];

  const fetchRecommendations = async (selectedCraving: string, selectedDietary: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ craving: selectedCraving, dietary: selectedDietary })
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecommendations(craving, dietary);
  }, []);

  return (
    <section className="py-16 bg-[#fcfae4] border-y border-[#e2dcb3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#f48fb1]/20 border border-[#f48fb1]/40 px-3 py-1 rounded-full text-[#964261] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd54f]" /> Gemini AI Flavor Sommelier
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#553b34] font-serif tracking-tight">
              Personalized Flavor Recommendations 🍨
            </h2>
          </div>

          {/* Craving Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {cravingPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setCraving(preset.value);
                  fetchRecommendations(preset.value, dietary);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  craving === preset.value
                    ? 'bg-[#964261] text-white shadow-md'
                    : 'bg-[#f4f1d4] border border-[#d8d1a3] text-[#553b34] hover:bg-[#e8e2be]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Section Banner Header */}
        <div className="bg-[#f4f1d4] border border-[#d8d1a3] rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#964261] bg-[#fcfae4] px-3 py-1 rounded-full border border-[#e2dcb3]">
              Active Section
            </span>
            <h3 className="text-base font-black text-[#553b34] font-serif">
              {craving === 'All Sections'
                ? '✨ All Category Sections Overview'
                : cravingPresets.find(p => p.value === craving)?.label || craving}
            </h3>
          </div>
          <span className="text-xs font-bold text-[#6B5A4E]">
            {recommendations.length} {recommendations.length === 1 ? 'Curated Flavor' : 'Curated Flavors'}
          </span>
        </div>

        {/* AI Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#f4f1d4] h-72 rounded-[2rem] border border-[#d8d1a3]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map(({ product, reason }) => {
              if (!product) return null;
              const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));

              return (
                <div
                  key={product.id}
                  onClick={() => onOpenDetails(product)}
                  className="bg-[#f4f1d4] border border-[#e5dfb8] rounded-[2rem] p-5 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative"
                >
                  <div>
                    {/* Section Tag Badge */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#964261] bg-[#fcfae4] px-2.5 py-0.5 rounded-full border border-[#e2dcb3]">
                        {product.category || 'Specialty'} Section
                      </span>
                    </div>

                    <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden bg-white mb-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-[#964261] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#ffd54f]" /> AI Match
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-[#553b34] font-serif mb-1 group-hover:text-[#964261] transition-colors">
                      {product.name}
                    </h3>

                    {/* AI Reason Callout */}
                    <p className="text-xs text-[#964261] bg-[#fcfae4] border border-[#f48fb1]/30 p-2.5 rounded-xl italic font-semibold mb-3">
                      "{reason}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#e2dcb3]">
                    <span className="text-xl font-black text-[#553b34] font-serif">
                      ₹{discountedPrice}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ product, quantity: 1, unitPrice: discountedPrice });
                        showToast(`Added to Cart! 🍦`, `${product.name} added to your cart.`);
                      }}
                      className="px-4 py-2 rounded-full bg-[#964261] hover:bg-[#7e344e] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
