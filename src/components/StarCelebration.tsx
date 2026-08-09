import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, Heart, Award, CheckCircle2 } from 'lucide-react';

interface StarCelebrationProps {
  show: boolean;
  message?: string;
  subText?: string;
  onComplete?: () => void;
}

export const StarCelebration: React.FC<StarCelebrationProps> = ({
  show,
  message = "WOW! PAYMENT SUCCESSFUL! 🌟",
  subText = "Your artisanal ice cream order is being prepared with love!",
  onComplete
}) => {
  // Generate 28 random stars memoized so values are stable during animation
  const stars = React.useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      size: Math.floor(Math.random() * 24) + 16,
      delay: Math.random() * 0.3,
      rotation: Math.random() * 360,
      color: ['#FFD700', '#F48FB1', '#FF9E80', '#A7FFEB', '#FFEB3B', '#E040FB'][i % 6]
    }));
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="star-celebration-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {/* Dark Backdrop with radial glow */}
          <motion.div
            key="star-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#2D1B0E] via-[#4A3728] to-[#1A0C06] backdrop-blur-md"
          />

          {/* Explosive Star Field */}
          <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-lg">
            
            {/* Central Glowing Badge */}
            <motion.div
              key="star-badge"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative mb-6"
            >
              {/* Pulsing Backlight */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-amber-300 blur-2xl opacity-75 animate-pulse scale-150" />
              
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#964261] via-[#c2537d] to-[#ffd54f] p-1 shadow-[0_0_50px_rgba(255,215,0,0.8)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#2D1B0E] flex flex-col items-center justify-center text-yellow-300 p-2 border-2 border-yellow-400">
                  <Star className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 fill-yellow-400 animate-bounce" />
                  <span className="text-[10px] font-black tracking-widest text-pink-300 uppercase mt-1">STAR WOW</span>
                </div>
              </div>
            </motion.div>

            {/* Flying Shooting Stars */}
            {stars.map((s) => (
              <motion.div
                key={`star-item-${s.id}`}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                animate={{
                  x: s.x,
                  y: s.y,
                  opacity: [0, 1, 1, 0],
                  scale: [0.2, 1.4, 1, 0],
                  rotate: s.rotation + 360
                }}
                transition={{
                  duration: 1.8,
                  delay: s.delay,
                  ease: "easeOut"
                }}
                className="absolute pointer-events-none"
              >
                <Star
                  style={{ width: s.size, height: s.size, color: s.color, fill: s.color }}
                  className="drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                />
              </motion.div>
            ))}

            {/* WOW Text Card */}
            <motion.div
              key="star-[#2D1B0E]-card"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-[#2D1B0E]/90 border-2 border-yellow-400/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(244,143,177,0.4)] backdrop-blur-xl relative z-20 text-white space-y-3"
            >
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                <Sparkles className="w-4 h-4 text-pink-700" />
                <span>★ WOW PAYMENT CONFIRMED ★</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-amber-300 leading-tight">
                {message}
              </h2>

              <p className="text-xs sm:text-sm text-pink-100 font-medium leading-relaxed">
                {subText}
              </p>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-yellow-300">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Instant Confirmation Sent to Your Phone</span>
              </div>
            </motion.div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
