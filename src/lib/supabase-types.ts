// Supabase-compatible types
export interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  mrp: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  product_variants?: ProductVariant[];
  rating: number;
  reviews_count: number;
  is_featured?: boolean;
  is_active: boolean;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  wallet_balance: number;
}