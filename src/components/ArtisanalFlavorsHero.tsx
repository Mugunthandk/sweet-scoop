import React from 'react';
import { Sparkles, Search, Filter, ShieldCheck, Award, Heart } from 'lucide-react';

interface ArtisanalFlavorsHeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  filterVegan: boolean;
  setFilterVegan: (v: boolean) => void;
  filterSugarFree: boolean;
  setFilterSugarFree: (s: boolean) => void;
  sortOption: string;
  setSortOption: (opt: string) => void;
  totalFlavorsCount: number;
}

export const ArtisanalFlavorsHero: React.FC<ArtisanalFlavorsHeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  filterVegan,
  setFilterVegan,
  filterSugarFree,
  setFilterSugarFree,
  sortOption,
  setSortOption,
  totalFlavorsCount
}) => {
  return (
    <div className="relative mb-12 rounded-[2.5rem] overflow-hidden border-2 border-[#EFCCD6] shadow-2xl">
      
      {/* Wow Photo Background - Artisanal Ice Cream Scoops in Waffle Cone */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=1800"
          alt="Artisanal ice cream gourmet scoops and waffle cones"
          className="w-full h-full object-cover object-center scale-105 filter brightness-95"
          referrerPolicy="no-referrer"
        />
        {/* Ambient Warm Plum Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B0E]/95 via-[#4A3728]/85 to-[#2D1B0E]/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-white max-w-5xl mx-auto space-y-6">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#964261] text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg border border-pink-300/30">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>★ Master-Churned Small Batch Creamery ★</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black font-serif tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-pink-100 to-amber-200">
            Explore Artisanal Flavors 🍨
          </h1>

          <p className="text-xs sm:text-base text-pink-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Handcrafted daily using organic grass-fed dairy, real Madagascar vanilla beans, 70% dark Belgian cocoa, and 100% plant-based oat & coconut milk bases.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold text-amber-200">
            <span className="bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-yellow-400" /> {totalFlavorsCount}+ Signature Flavors
            </span>
            <span className="bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-400" /> 100% Preservative-Free
            </span>
            <span className="bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> Chilled Express Delivery
            </span>
          </div>
        </div>

        {/* Floating Glassmorphism Search & Filters Bar */}
        <div className="bg-[#2D1B0E]/80 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gourmet flavors (e.g., Belgian Dark Fudge, Mango Sorbet, Lavender)..."
              className="w-full bg-black/40 border border-white/20 rounded-full pl-12 pr-4 py-3 text-xs sm:text-sm text-white placeholder-pink-200/60 focus:outline-none focus:border-yellow-400 transition-all font-medium"
            />
          </div>

          {/* Categories Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#964261] text-white shadow-lg border border-pink-300/40 scale-105'
                    : 'bg-white/10 text-pink-100 hover:bg-white/20 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Checkboxes & Sort dropdown */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-pink-100">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={filterVegan}
                  onChange={(e) => setFilterVegan(e.target.checked)}
                  className="rounded text-[#964261] focus:ring-0 accent-[#964261]"
                />
                <span>🌱 100% Vegan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={filterSugarFree}
                  onChange={(e) => setFilterSugarFree(e.target.checked)}
                  className="rounded text-[#964261] focus:ring-0 accent-[#964261]"
                />
                <span>✨ Sugar-Free</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-pink-200">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
              >
                <option value="recommended" className="bg-[#2D1B0E] text-white">Featured Bestsellers</option>
                <option value="price-low" className="bg-[#2D1B0E] text-white">Price: Low to High</option>
                <option value="price-high" className="bg-[#2D1B0E] text-white">Price: High to Low</option>
                <option value="rating" className="bg-[#2D1B0E] text-white">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
