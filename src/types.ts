export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'KITCHEN_STAFF' | 'DELIVERY_STAFF';

export type UserTier = 'Scoop Starter' | 'Scoop Lover' | 'Scoop VIP';

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  sweetPoints: number;
  tier: UserTier;
  addresses: Address[];
  wishlist: string[]; // Product IDs
  createdAt: string;
}

export interface ProductVariant {
  name: string;
  priceExtra: number;
}

export interface ProductNutrition {
  calories: number;
  fat: string;
  carbs: string;
  protein: string;
  sugar: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number; // percentage e.g. 10
  images: string[];
  rating: number;
  reviewsCount: number;
  category: string; // e.g. 'Classic', 'Chocolate', 'Fruit', 'Premium', 'Sundaes', 'Cookies & Cream', 'Vegan', 'Sugar-Free', 'Seasonal', 'Combos'
  stock: number;
  sizes: string[]; // e.g. ['Single Scoop', 'Double Scoop', 'Pint (500ml)', 'Party Tub (1L)']
  ingredients: string[];
  nutrition: ProductNutrition;
  allergens: string[];
  variants?: ProductVariant[];
  recommendedToppings?: string[];
  isVegan?: boolean;
  isSugarFree?: boolean;
  isDairyFree?: boolean;
  isBestseller?: boolean;
  isSeasonal?: boolean;
  isNew?: boolean;
  isAvailable?: boolean;
}

export interface CustomBuild {
  base: 'Waffle Cone' | 'Classic Cup' | 'Chocolate Cone' | 'Sundae Bowl';
  flavors: string[]; // e.g. ['Madagascar Vanilla', 'Double Dark Chocolate']
  size: 'Small (1 Scoop)' | 'Medium (2 Scoops)' | 'Large (3 Scoops)';
  toppings: string[]; // e.g. ['Hot Fudge', 'Rainbow Sprinkles', 'Oreo Crumbles']
  addOns: string[]; // e.g. ['Extra Scoop', 'Fresh Waffle', 'Whipped Cream', 'Brownie']
}

export interface CartItem {
  id: string;
  productId?: string;
  product?: Product;
  customBuild?: CustomBuild;
  quantity: number;
  size: string;
  container?: string;
  toppings: string[];
  addOns: string[];
  unitPrice: number;
  totalPrice: number;
  instructions?: string;
}

export interface GiftOptions {
  isGift: boolean;
  recipientName?: string;
  recipientPhone?: string;
  giftMessage?: string;
  giftWrap?: boolean;
  isAnonymous?: boolean;
  deliveryDate?: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentMethod =
  | 'UPI'
  | 'QR Code'
  | 'Credit/Debit Card'
  | 'Net Banking'
  | 'Wallet'
  | 'Cash on Delivery';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  details?: string;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  pointsDiscount: number;
  total: number;
  deliveryAddress: Address;
  deliveryType: 'Standard' | 'Express' | 'Scheduled' | 'Store Pickup';
  storeId?: string;
  storeName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  giftOptions?: GiftOptions;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'PERCENT' | 'FLAT';
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  expiryDate: string;
  usageLimit: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  date: string;
  verifiedPurchase: boolean;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: string;
  phone: string;
  openingHours: string;
  lat: number;
  lng: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Ice Cream Tubs' | 'Toppings' | 'Cones & Cups' | 'Packaging' | 'Ingredients';
  stockQuantity: number;
  unit: string;
  reorderLevel: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  lastRestocked: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planName: 'Weekly Delight (2 Tubs/wk)' | 'Monthly Scoop Pass (8 Tubs/mo)' | 'Family Party Pack (4 Tubs + Cones/wk)';
  type: 'Weekly' | 'Monthly' | 'Family';
  price: number;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  startDate: string;
  nextDeliveryDate: string;
  deliveriesCompleted: number;
  favoriteFlavors: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'coupon' | 'point' | 'system' | 'wishlist';
  read: boolean;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'MANAGER' | 'KITCHEN_STAFF' | 'DELIVERY_STAFF';
  status: 'ACTIVE' | 'INACTIVE';
  assignedZone?: string;
  joinedDate: string;
}
