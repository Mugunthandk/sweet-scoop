import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Store } from '../types';

export const StoreLocatorSection: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    fetch('/api/stores')
      .then(res => res.json())
      .then(data => setStores(data || []));
  }, []);

  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase text-[#964261] tracking-wider block mb-2">Physical Boutiques</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#4A3728] font-serif">Visit Our Artisanal Parlors 📍</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stores.map((st) => (
            <div key={st.id} className="bg-[#FFFFFF] border border-[#E8E2D6] rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F5] text-[#964261] flex items-center justify-center text-xl mb-4">
                🏪
              </div>
              <h3 className="font-bold text-base text-[#4A3728] font-serif mb-2">{st.name}</h3>
              <p className="text-xs text-[#6B5A4E] flex items-start gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#964261] shrink-0 mt-0.5" />
                <span>{st.address}, {st.city} ({st.distance} away)</span>
              </p>
              <p className="text-xs text-[#6B5A4E] flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#964261] shrink-0" />
                <span>{st.openingHours}</span>
              </p>
              <p className="text-xs text-[#6B5A4E] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#964261] shrink-0" />
                <span>{st.phone}</span>
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
