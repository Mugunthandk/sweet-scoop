import React from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface KidsJoyBannerProps {
  onNavigateToFlavors: () => void;
}

export const KidsJoyBanner: React.FC<KidsJoyBannerProps> = ({ onNavigateToFlavors }) => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-[#EFCCD6]">
        
        {/* Background Image of Children Eating Ice Cream */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&q=80&w=1600"
            alt="Happy children eating delicious artisanal ice cream"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Dark Plum & Warm Overlay gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B0E]/90 via-[#4A3728]/75 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl text-white space-y-4">
          
          <div className="inline-flex items-center gap-2 bg-[#964261] text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-pink-200" />
            <span>Loved by Kids & Families</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight sm:leading-snug">
            Pure Joy in Every <span className="text-[#EFCCD6] underline decoration-[#964261] decoration-wavy underline-offset-8">Creamy Bite</span> 🍦
          </h2>

          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed font-medium">
            Made with 100% natural, organic sweet milk, real fresh fruits, and zero artificial preservatives. Safe, healthy, and delightfully delicious for your little ones!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToFlavors}
              className="px-6 py-3.5 rounded-full bg-[#964261] hover:bg-[#7A324E] text-white text-xs font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
              <span>Explore Artisanal Flavors</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-extrabold text-pink-200 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>100% Preservative-Free & Organic</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
