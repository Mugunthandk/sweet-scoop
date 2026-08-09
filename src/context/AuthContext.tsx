import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string) => Promise<boolean>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  toggleWishlist: (productId: string) => void;
  addAddress: (address: any) => void;
  removeAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset demo users matching server DB
const DEMO_USERS: Record<UserRole, User> = {
  CUSTOMER: {
    id: 'usr-customer',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    mobile: '+91 98765 43210',
    role: 'CUSTOMER',
    sweetPoints: 340,
    tier: 'Scoop Lover',
    addresses: [
      {
        id: 'addr-1',
        type: 'Home',
        name: 'Ananya Sharma',
        phone: '+91 98765 43210',
        house: 'Flat 402, Rosewood Heights',
        street: 'MG Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        landmark: 'Near Metro Station',
        isDefault: true
      }
    ],
    wishlist: ['prod-2', 'prod-4', 'prod-9'],
    createdAt: new Date().toISOString()
  },
  ADMIN: {
    id: 'usr-admin',
    name: 'Chief Scoop Officer (Admin)',
    email: 'admin@sweetscoop.com',
    mobile: '+91 90000 00000',
    role: 'ADMIN',
    sweetPoints: 1000,
    tier: 'Scoop VIP',
    addresses: [],
    wishlist: [],
    createdAt: new Date().toISOString()
  },
  MANAGER: {
    id: 'usr-manager',
    name: 'Meera Rao (Store Manager)',
    email: 'meera@sweetscoop.com',
    mobile: '+91 93333 33333',
    role: 'MANAGER',
    sweetPoints: 500,
    tier: 'Scoop Lover',
    addresses: [],
    wishlist: [],
    createdAt: new Date().toISOString()
  },
  KITCHEN_STAFF: {
    id: 'usr-kitchen',
    name: 'Chef Ramesh (Kitchen Lead)',
    email: 'kitchen@sweetscoop.com',
    mobile: '+91 91111 11111',
    role: 'KITCHEN_STAFF',
    sweetPoints: 0,
    tier: 'Scoop Starter',
    addresses: [],
    wishlist: [],
    createdAt: new Date().toISOString()
  },
  DELIVERY_STAFF: {
    id: 'usr-delivery',
    name: 'Vikram Singh (Express Delivery)',
    email: 'delivery@sweetscoop.com',
    mobile: '+91 92222 22222',
    role: 'DELIVERY_STAFF',
    sweetPoints: 0,
    tier: 'Scoop Starter',
    addresses: [],
    wishlist: [],
    createdAt: new Date().toISOString()
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sweet_scoop_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.CUSTOMER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sweet_scoop_token') || 'demo-jwt-token-usr-customer';
  });

  useEffect(() => {
    if (user) localStorage.setItem('sweet_scoop_user', JSON.stringify(user));
    else localStorage.removeItem('sweet_scoop_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('sweet_scoop_token', token);
    else localStorage.removeItem('sweet_scoop_token');
  }, [token]);

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const loginAsRole = (role: UserRole) => {
    const preset = DEMO_USERS[role] || DEMO_USERS.CUSTOMER;
    setUser(preset);
    setToken(`demo-jwt-token-${preset.id}`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const toggleWishlist = (productId: string) => {
    if (!user) return;
    const exists = user.wishlist.includes(productId);
    const updated = exists
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];
    setUser({ ...user, wishlist: updated });
  };

  const addAddress = (addrData: any) => {
    if (!user) return;
    const newAddr = { ...addrData, id: `addr-${Date.now()}` };
    setUser({ ...user, addresses: [newAddr, ...user.addresses] });
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    setUser({ ...user, addresses: user.addresses.filter(a => a.id !== id) });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginAsRole, logout, updateUser, toggleWishlist, addAddress, removeAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
