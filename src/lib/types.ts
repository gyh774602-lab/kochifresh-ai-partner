// ECFresh Types - Ready-to-cook vegetables delivery app

export interface Pincode {
  id: string;
  code: string;
  area: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  weight: string; // "300g", "500g", "1kg"
  price: number;
  originalPrice?: number;
  isInStock: boolean;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
  tags: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  preparationTime?: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  isSelected: boolean;
  product: Product;
  variant: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  walletDiscount: number;
  total: number;
}

export interface DeliverySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isSelected: boolean;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  addresses: Address[];
  walletBalance: number;
  totalOrders: number;
  isFirstOrder: boolean;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  area: string;
  landmark?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  walletDiscount: number;
  cashbackEarned: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  deliverySlot: DeliverySlot;
  deliveryAddress: Address;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  product: Product;
  variant: ProductVariant;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  orderId?: string;
  balanceAfter: number;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
}

// Kochi Pincodes
export const KOCHI_PINCODES: Pincode[] = [
  { id: "1", code: "682001", area: "Fort Kochi", isActive: true },
  { id: "2", code: "682002", area: "Mattancherry", isActive: true },
  { id: "3", code: "682003", area: "Ernakulam South", isActive: true },
  { id: "4", code: "682004", area: "Ernakulam North", isActive: true },
  { id: "5", code: "682005", area: "Kadavanthra", isActive: true },
  { id: "6", code: "682006", area: "Ernakulam Junction", isActive: true },
  { id: "7", code: "682011", area: "Panampilly Nagar", isActive: true },
  { id: "8", code: "682012", area: "Kaloor", isActive: true },
  { id: "9", code: "682013", area: "Palarivattom", isActive: true },
  { id: "10", code: "682014", area: "Vaduthala", isActive: true },
  { id: "11", code: "682015", area: "Thevara", isActive: true },
  { id: "12", code: "682016", area: "Kakkanad", isActive: true },
  { id: "13", code: "682017", area: "Edappally", isActive: true },
  { id: "14", code: "682018", area: "Cheranalloor", isActive: true },
  { id: "15", code: "682019", area: "Tripunithura", isActive: true },
  { id: "16", code: "682020", area: "Maradu", isActive: true },
  { id: "17", code: "682021", area: "Brahmapuram", isActive: true },
  { id: "18", code: "682022", area: "Kumbalam", isActive: true },
  { id: "19", code: "682024", area: "Vyttila", isActive: true },
  { id: "20", code: "682025", area: "Pettah", isActive: true },
  { id: "21", code: "682026", area: "Kochi Airport", isActive: true },
  { id: "22", code: "682027", area: "Aroor", isActive: true },
  { id: "23", code: "682028", area: "Kumbakonam", isActive: true },
  { id: "24", code: "682029", area: "Chellanam", isActive: true },
  { id: "25", code: "682030", area: "Willingdon Island", isActive: true },
  { id: "26", code: "682031", area: "Kacheripady", isActive: true },
  { id: "27", code: "682032", area: "Kochi Port", isActive: true },
  { id: "28", code: "682033", area: "Marine Drive", isActive: true },
  { id: "29", code: "682034", area: "Kundannoor", isActive: true },
  { id: "30", code: "682035", area: "Thripunithura", isActive: true },
];