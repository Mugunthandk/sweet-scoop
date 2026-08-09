import React, { useState } from 'react';
import { ShoppingBag, Heart, User as UserIcon, Search, MapPin, Sparkles, Shield, ChevronDown, Menu, X, Gift, Award, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserRole } from '../types';

interface NavbarProps {
  onNavigate: (page: string) => void;
  activePage: string;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activePage,
  onOpenCart,
  onOpenAuth,
  searchQuery,
  setSearchQuery
}) => {
  const { user, loginAsRole, logout } = useAuth();
  const { cart } = useCart();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const roles: { role: UserRole; label: string; badge: string; color: string }[] = [
    { role: 'CUSTOMER', label: 'Customer View', badge: 'Ananya', color: 'bg-pink-100 text-pink-700' },
    { role: 'ADMIN', label: 'Admin Dashboard', badge: 'Manager', color: 'bg-purple-100 text-purple-700' },
    { role: 'KITCHEN_STAFF', label: 'Kitchen View', badge: 'Chef', color: 'bg-amber-100 text-amber-700' },
    { role: 'DELIVERY_STAFF', label: 'Delivery Rider', badge: 'Rider', color: 'bg-blue-100 text-blue-700' },
  ];

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'flavors', label: 'Flavors' },
    { id: 'builder', label: 'Build Scoop 🍨' },
    { id: 'mood-engine', label: 'Mood Engine 🎭', highlight: true },
    { id: 'smart-combos', label: 'Smart Combos 🎁', highlight: true },
    { id: 'offers', label: 'Offers' },
    { id: 'stores', label: 'Stores' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D6] transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#4A3728] text-[#FDFBF7] text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#964261]" />
        <span>Get 20% OFF on all orders above ₹300! Use Code: <strong className="underline decoration-wavy underline-offset-4 text-[#964261]">SCOOP20</strong></span>
        <span className="hidden md:inline">| ⚡ Express 15-Min Chilled Delivery</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#964261] text-white flex items-center justify-center shadow-[0_4px_0_0_#6A2B43] transform hover:scale-105 transition-transform shrink-0">
              <span className="text-xl sm:text-2xl">🍦</span>
            </div>
            <div className="shrink-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#4A3728] font-serif leading-none flex items-center gap-1 whitespace-nowrap">
                SWEET SCOOPS
              </h1>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#964261] uppercase block whitespace-nowrap mt-0.5">
                Artisanal Creamery
              </span>
            </div>
          </div>

          {/* Search Input (Desktop) */}
          <div className="hidden lg:flex items-center relative w-72">
            <input
              type="text"
              placeholder="Search vanilla, Belgian fudge, mango..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'flavors') onNavigate('flavors');
              }}
              className="w-full bg-[#F3EFE7] border border-[#E8E2D6] text-[#4A3728] placeholder-[#8C7A6B] text-xs rounded-full py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-[#964261] shadow-inner"
            />
            <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-3" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 text-xs text-[#8C7A6B]">✕</button>
            )}
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  activePage === link.id
                    ? 'bg-[#964261] text-white shadow-[0_2px_0_0_#6A2B43]'
                    : link.highlight
                    ? 'bg-[#FDF2F5] text-[#964261] hover:bg-[#F9E4EB] border border-[#EFCCD6]'
                    : 'text-[#4A3728] hover:bg-[#F3EFE7]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Quick Demo Role Switcher Badge */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#F3EFE7] border border-[#E8E2D6] text-[11px] font-bold text-[#4A3728] hover:bg-[#EAE4D8] transition-colors"
                title="Switch demo mode role"
              >
                <Shield className="w-3.5 h-3.5 text-[#964261]" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-extrabold text-[#964261] capitalize">{user?.role?.replace('_', ' ') || 'Customer'}</span>
                <ChevronDown className="w-3 h-3 text-[#8C7A6B]" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#E8E2D6] rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1 border-b border-[#E8E2D6] text-[10px] font-extrabold text-[#8C7A6B] uppercase tracking-wider">
                    Demo Mode Switcher
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        loginAsRole(r.role);
                        setShowRoleMenu(false);
                        if (r.role === 'ADMIN') onNavigate('admin');
                        else if (r.role === 'KITCHEN_STAFF') onNavigate('kitchen');
                        else if (r.role === 'DELIVERY_STAFF') onNavigate('delivery');
                        else onNavigate('home');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#F3EFE7] ${
                        user?.role === r.role ? 'bg-[#FDF2F5] font-bold text-[#964261]' : 'text-[#4A3728]'
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${r.color}`}>{r.badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            {user?.role === 'CUSTOMER' && (
              <button
                onClick={() => onNavigate('wishlist')}
                className="p-2.5 rounded-full bg-[#F3EFE7] hover:bg-[#EAE4D8] text-[#4A3728] relative transition-transform hover:scale-105"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 text-[#964261]" />
                {user?.wishlist?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#964261] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {user.wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Drawer Toggle */}
            <button
              onClick={onOpenCart}
              className="px-4 py-2 rounded-full bg-[#964261] hover:bg-[#7A324E] text-white text-xs font-bold flex items-center gap-2 shadow-[0_3px_0_0_#6A2B43] transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white/25 text-white text-[11px] px-2 py-0.5 rounded-full font-black">
                {cartItemsCount}
              </span>
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-[#4A3728] border-2 border-white flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition-transform"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#E8E2D6] rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E8E2D6]">
                      <p className="text-xs font-bold text-[#4A3728] leading-tight">{user.name}</p>
                      <p className="text-[10px] text-[#6B5A4E]">{user.email}</p>
                      {user.role === 'CUSTOMER' && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#964261]">
                          <Award className="w-3 h-3 text-[#964261]" />
                          <span>{user.tier} ({user.sweetPoints} pts)</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (user.role === 'ADMIN') onNavigate('admin');
                        else if (user.role === 'KITCHEN_STAFF') onNavigate('kitchen');
                        else if (user.role === 'DELIVERY_STAFF') onNavigate('delivery');
                        else onNavigate('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#4A3728] font-semibold hover:bg-[#F3EFE7] flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#964261]" />
                      My Profile & Dashboard
                    </button>

                    {user.role === 'CUSTOMER' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('orders');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#4A3728] font-semibold hover:bg-[#F3EFE7] flex items-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#964261]" />
                        My Orders & Tracking
                      </button>
                    )}

                    <div className="border-t border-[#E8E2D6] my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        onNavigate('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 font-semibold hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-full border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728] hover:text-white text-xs font-bold transition-all"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#4A3728]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E2D6] bg-[#FDFBF7] px-4 pt-3 pb-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold ${
                activePage === link.id ? 'bg-[#964261] text-white' : 'text-[#4A3728] hover:bg-[#F3EFE7]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
