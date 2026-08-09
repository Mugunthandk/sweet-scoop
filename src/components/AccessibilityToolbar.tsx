import React, { useState, useEffect } from 'react';
import { Eye, Type, Sparkles, Volume2, X, Check, Shield } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Apply font size class to body
    document.documentElement.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    if (fontSize === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else if (fontSize === 'xlarge') {
      document.documentElement.style.fontSize = '20px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('contrast-125');
    } else {
      document.documentElement.classList.remove('contrast-125');
    }
  }, [highContrast]);

  return (
    <>
      {/* Floating Accessibility Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Accessibility Settings"
        className="fixed bottom-24 right-5 z-40 bg-[#4A3728] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#964261] transition-all border-2 border-white flex items-center justify-center hover:scale-110"
        title="Accessibility Controls"
      >
        <Eye className="w-5 h-5" />
      </button>

      {/* Accessibility Controls Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border-2 border-[#964261] rounded-[2.5rem] w-full max-w-md p-6 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-[#4A3728] hover:text-[#964261]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F5] text-[#964261] flex items-center justify-center font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#4A3728] font-serif">Accessibility Center</h3>
                <p className="text-xs text-[#8C7A6B]">Customize text, contrast, and motion preferences</p>
              </div>
            </div>

            {/* 1. Font Size Control */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-[#964261]" /> Font Size Scale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: '100% Normal' },
                  { id: 'large', label: '110% Large' },
                  { id: 'xlarge', label: '125% X-Large' }
                ].map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setFontSize(sz.id as any)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all ${
                      fontSize === sz.id
                        ? 'bg-[#964261] text-white border-[#964261]'
                        : 'bg-[#F3EFE7] border-[#E8E2D6] text-[#4A3728]'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. High Contrast Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F3EFE7] border border-[#E8E2D6]">
              <div>
                <strong className="block text-xs font-bold text-[#4A3728]">High Contrast Mode</strong>
                <span className="text-[10px] text-[#8C7A6B]">Enhances text readability and icon borders</span>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  highContrast ? 'bg-[#964261]' : 'bg-[#E8E2D6]'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F3EFE7] border border-[#E8E2D6]">
              <div>
                <strong className="block text-xs font-bold text-[#4A3728]">Reduce Animations</strong>
                <span className="text-[10px] text-[#8C7A6B]">Minimizes bounces and scrolling motion</span>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  reducedMotion ? 'bg-[#964261]' : 'bg-[#E8E2D6]'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Keyboard Shortcuts Notice */}
            <div className="p-3 bg-[#FDF2F5] rounded-2xl border border-[#EFCCD6] text-xs text-[#6B5A4E] space-y-1">
              <strong className="block text-[#964261] font-bold">⌨️ Keyboard Shortcuts:</strong>
              <div className="flex justify-between text-[11px]">
                <span>Tab / Shift+Tab:</span>
                <span>Navigate controls</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Space / Enter:</span>
                <span>Select & Add To Cart</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-full bg-[#4A3728] text-white text-xs font-bold hover:bg-[#2D1B0E]"
            >
              Save Preferences
            </button>

          </div>
        </div>
      )}
    </>
  );
};
