import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User as UserIcon, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { login, loginAsRole } = useAuth();
  const { showToast } = useNotification();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [email, setEmail] = useState('ananya@example.com');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('1234');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email);
    if (success) {
      showToast('Welcome Back! 🍦', 'Successfully signed in to Sweet Scoop.');
      onClose();
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAsRole(role);
    showToast('Demo Role Switched! ⚡', `Signed in as ${role.replace('_', ' ')}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fcfae4] border-2 border-[#964261] rounded-[2.5rem] w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-[#553b34]">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-3xl block mb-1">🍦</span>
          <h2 className="text-2xl font-black text-[#553b34] font-serif">Sign In to Sweet Scoop</h2>
          <p className="text-xs text-[#8d7871]">Unlock Sweet Points loyalty rewards & instant 15-min delivery</p>
        </div>

        {/* 1-Click Quick Demo Role Switcher Bar */}
        <div className="bg-[#f4f1d4] border border-[#d8d1a3] rounded-2xl p-3 mb-6">
          <span className="text-[10px] font-black uppercase text-[#964261] block mb-2 text-center">
            ⚡ 1-Click Demo Quick Logins
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => handleDemoLogin('CUSTOMER')}
              className="p-2 rounded-xl bg-[#fcfae4] border border-[#d8d1a3] text-[#553b34] hover:bg-[#964261] hover:text-white transition-colors"
            >
              👤 Customer (Ananya)
            </button>
            <button
              onClick={() => handleDemoLogin('ADMIN')}
              className="p-2 rounded-xl bg-[#fcfae4] border border-[#d8d1a3] text-[#553b34] hover:bg-[#964261] hover:text-white transition-colors"
            >
              👑 Master Admin
            </button>
            <button
              onClick={() => handleDemoLogin('KITCHEN_STAFF')}
              className="p-2 rounded-xl bg-[#fcfae4] border border-[#d8d1a3] text-[#553b34] hover:bg-[#964261] hover:text-white transition-colors"
            >
              👨‍🍳 Kitchen Staff
            </button>
            <button
              onClick={() => handleDemoLogin('DELIVERY_STAFF')}
              className="p-2 rounded-xl bg-[#fcfae4] border border-[#d8d1a3] text-[#553b34] hover:bg-[#964261] hover:text-white transition-colors"
            >
              🏍️ Delivery Rider
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#553b34] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#f4f1d4] border border-[#d8d1a3] rounded-2xl px-4 py-2.5 text-xs text-[#553b34] focus:outline-none focus:ring-2 focus:ring-[#964261]"
              />
              <Mail className="w-4 h-4 text-[#8d7871] absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#964261] hover:bg-[#7e344e] text-white text-xs font-black shadow-[0_4px_0_0_#63263b] flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
