import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Truck, Flame, Clock } from 'lucide-react';

interface HeroProps {
  onNavigateToFlavors: () => void;
  onNavigateToBuilder: () => void;
  onNavigateToMood?: () => void;
  onNavigateToCombos?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigateToFlavors,
  onNavigateToBuilder,
  onNavigateToMood,
  onNavigateToCombos
}) => {
  // Live Flash Sale Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 42, seconds: 18 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[#FDFBF7] pt-6 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Live Flash Sale Banner */}
        <div className="bg-[#4A3728] text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border-2 border-[#964261]">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#964261] text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="bg-[#964261] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  LIMITED STOCK FLASH SALE
                </span>
                <span className="text-[11px] text-amber-300 font-bold animate-pulse">⚡ Only 4 Left!</span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-serif">Blackberry Lavender Swirl Pint - 30% OFF</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#2D1B0E] px-4 py-2 rounded-2xl border border-[#8C7A6B] flex items-center gap-2 font-mono text-xs font-black">
              <Clock className="w-4 h-4 text-[#964261]" />
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={onNavigateToFlavors}
              className="px-5 py-2.5 rounded-full bg-[#964261] hover:bg-[#7A324E] text-white text-xs font-black shadow-md shrink-0"
            >
              Claim Sale ₹155
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-[#FDF2F5] border border-[#EFCCD6] px-4 py-1.5 rounded-full text-[#964261] text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-[#964261]" /> Hand-Churned Artisanal Creamery
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#4A3728] font-serif leading-tight sm:leading-snug tracking-tight">
              Happiness in Every <span className="text-[#964261] underline decoration-[#EFCCD6] decoration-wavy underline-offset-8">Decadent Scoop</span> 🍦
            </h1>

            <p className="text-sm sm:text-base text-[#6B5A4E] leading-relaxed max-w-xl mx-auto lg:mx-0">
              Handcrafted in small daily batches using organic sweet milk, real Bourbon Madagascar vanilla beans, 70% dark Belgian cocoa, and wild forest berries.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onNavigateToFlavors}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#964261] hover:bg-[#7A324E] text-white text-xs font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_#6A2B43] transition-all hover:scale-105 active:scale-95"
              >
                <span>Order Fresh Scoop</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onNavigateToMood && (
                <button
                  onClick={onNavigateToMood}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FDF2F5] border-2 border-[#964261] hover:bg-[#F9E4EB] text-[#964261] text-xs font-black flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <span>Scoop Mood Engine 🎭</span>
                </button>
              )}

              {onNavigateToCombos && (
                <button
                  onClick={onNavigateToCombos}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FFFFFF] border-2 border-[#4A3728] hover:bg-[#F3EFE7] text-[#4A3728] text-xs font-black flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <span>Smart Combos 🎁</span>
                </button>
              )}
            </div>

            {/* Badges */}
            <div className="pt-6 border-t border-[#E8E2D6] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <strong className="block text-lg font-black text-[#4A3728] font-serif">15 Mins</strong>
                <span className="text-[11px] text-[#6B5A4E] font-semibold">Chilled Delivery</span>
              </div>
              <div>
                <strong className="block text-lg font-black text-[#4A3728] font-serif">20+ Flavors</strong>
                <span className="text-[11px] text-[#6B5A4E] font-semibold">Artisanal Varieties</span>
              </div>
              <div>
                <strong className="block text-lg font-black text-[#4A3728] font-serif">4.9 ★</strong>
                <span className="text-[11px] text-[#6B5A4E] font-semibold">10,000+ Reviews</span>
              </div>
            </div>

          </div>

          {/* Right Column Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Glowing Accent Backdrop */}
            <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#FDF2F5] via-[#F3EFE7] to-[#EFCCD6] blur-3xl absolute -z-10" />

            {/* Main Hero Scoop Card */}
            <div className="relative bg-[#FFFFFF] border border-[#E8E2D6] rounded-[3rem] p-4 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm">
              <img
                src="https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&q=80&w=800"
                alt="Double Dark Belgian Fudge"
                className="w-full h-80 object-cover rounded-[2.5rem] shadow-md"
                referrerPolicy="no-referrer"
              />
              
              <div className="p-4 text-center">
                <span className="bg-[#964261] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  Today's Top Scoop
                </span>
                <h3 className="text-xl font-black text-[#4A3728] font-serif">Double Dark Belgian Fudge</h3>
                <p className="text-xs text-[#6B5A4E] mt-1">70% Dark Belgian cocoa with hot truffle dripples</p>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-5 bg-[#4A3728] text-white px-4 py-2 rounded-2xl font-black text-xs shadow-xl border-2 border-white flex items-center gap-1.5 animate-bounce">
                <span>🔥 20% OFF Today!</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
