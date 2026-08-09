import React from 'react';
import { Heart, ShieldCheck, Truck, Sparkles, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#4A3728] text-[#FDFBF7] pt-16 pb-8 border-t-8 border-[#964261] relative overflow-hidden">
      {/* Decorative Wave Drip SVG top border */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#6B5A4E]">
          <div className="flex items-center gap-4 bg-[#3B2B1F] p-4 rounded-2xl border border-[#5A4535]">
            <div className="w-12 h-12 rounded-full bg-[#964261]/20 flex items-center justify-center text-[#964261]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FDFBF7]">15-Min Chilled Express</h4>
              <p className="text-xs text-[#D8D0C3]">Delivered cold in thermal insulated boxes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#3B2B1F] p-4 rounded-2xl border border-[#5A4535]">
            <div className="w-12 h-12 rounded-full bg-[#964261]/20 flex items-center justify-center text-[#964261]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FDFBF7]">100% Real Pure Milk</h4>
              <p className="text-xs text-[#D8D0C3]">No vegetable fats or artificial preservatives</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#3B2B1F] p-4 rounded-2xl border border-[#5A4535]">
            <div className="w-12 h-12 rounded-full bg-[#964261]/20 flex items-center justify-center text-[#964261]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FDFBF7]">Fresh Daily Batches</h4>
              <p className="text-xs text-[#D8D0C3]">Hand-churned artisanal recipes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#3B2B1F] p-4 rounded-2xl border border-[#5A4535]">
            <div className="w-12 h-12 rounded-full bg-[#964261]/20 flex items-center justify-center text-[#964261]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FDFBF7]">Sweet Rewards Loyalty</h4>
              <p className="text-xs text-[#D8D0C3]">Earn points on every scoop</p>
            </div>
          </div>
        </div>

        {/* Links & Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-[#6B5A4E]">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🍦</span>
              <h3 className="text-2xl font-black font-serif text-[#FDFBF7] tracking-tight">SWEET SCOOPS</h3>
            </div>
            <p className="text-xs text-[#D8D0C3] leading-relaxed mb-6 max-w-sm">
              Sweet Scoop is an artisanal ice cream boutique dedicated to delivering happiness in every scoop. Handcrafted with organic ingredients, real vanilla beans, and 70% dark Belgian cocoa.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-[#3B2B1F] hover:bg-[#964261] flex items-center justify-center transition-colors text-white">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#3B2B1F] hover:bg-[#964261] flex items-center justify-center transition-colors text-white">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#3B2B1F] hover:bg-[#964261] flex items-center justify-center transition-colors text-white">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#964261] uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-[#D8D0C3]">
              <li><button onClick={() => onNavigate('flavors')} className="hover:text-white transition-colors">Explore Flavors</button></li>
              <li><button onClick={() => onNavigate('builder')} className="hover:text-white transition-colors">Build Your Scoop Customizer</button></li>
              <li><button onClick={() => onNavigate('offers')} className="hover:text-white transition-colors">Coupons & Special Offers</button></li>
              <li><button onClick={() => onNavigate('loyalty')} className="hover:text-white transition-colors">Sweet Points Loyalty Program</button></li>
              <li><button onClick={() => onNavigate('stores')} className="hover:text-white transition-colors">Store Locator & Pickup</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#964261] uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs text-[#D8D0C3]">
              <li><button onClick={() => onNavigate('flavors')} className="hover:text-white transition-colors">Classic Vanilla & Chocolate</button></li>
              <li><button onClick={() => onNavigate('flavors')} className="hover:text-white transition-colors">Royal Nutty & Saffron</button></li>
              <li><button onClick={() => onNavigate('flavors')} className="hover:text-white transition-colors">100% Vegan Coconut Series</button></li>
              <li><button onClick={() => onNavigate('flavors')} className="hover:text-white transition-colors">Monk Fruit Sugar-Free</button></li>
              <li><button onClick={() => onNavigate('flavors')} className="hover:text-white transition-colors">Party Combo Tubs</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#964261] uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-xs text-[#D8D0C3]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#964261] shrink-0 mt-0.5" />
                <span>100 Feet Road, Indiranagar, Bengaluru, 560038</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#964261] shrink-0" />
                <span>+91 80 4123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#964261] shrink-0" />
                <span>hello@sweetscoop.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8D0C3] gap-4">
          <p>© 2026 Sweet Scoop Creamery Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">FSSAI Certified</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
