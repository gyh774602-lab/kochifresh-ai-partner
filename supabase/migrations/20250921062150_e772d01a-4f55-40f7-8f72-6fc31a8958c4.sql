-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('earned', 'used');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product variants table
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  weight TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pincodes table
CREATE TABLE public.pincodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  area TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create addresses table
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  street TEXT NOT NULL,
  landmark TEXT,
  pincode_id UUID NOT NULL REFERENCES public.pincodes(id),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery slots table
CREATE TABLE public.delivery_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  address_id UUID NOT NULL REFERENCES public.addresses(id),
  delivery_slot_id UUID REFERENCES public.delivery_slots(id),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 50,
  wallet_discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlists table
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  image TEXT NOT NULL,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pincodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for public data (categories, products, variants, pincodes, banners)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Active pincodes are viewable by everyone" ON public.pincodes FOR SELECT USING (is_active = true);
CREATE POLICY "Active banners are viewable by everyone" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Delivery slots are viewable by everyone" ON public.delivery_slots FOR SELECT USING (is_available = true);

-- Create RLS policies for user-specific data
CREATE POLICY "Users can view their own addresses" ON public.addresses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own addresses" ON public.addresses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own addresses" ON public.addresses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own addresses" ON public.addresses FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can view their own wallet transactions" ON public.wallet_transactions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own wishlist" ON public.wishlists FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own wishlist items" ON public.wishlists FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete their own wishlist items" ON public.wishlists FOR DELETE USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for categories
INSERT INTO public.categories (name, icon, color) VALUES
  ('Leafy Greens', '🥬', '#22c55e'),
  ('Root Vegetables', '🥕', '#f97316'),
  ('Herbs', '🌿', '#10b981'),
  ('Exotic', '🥒', '#8b5cf6');

-- Insert sample pincodes for Kochi
INSERT INTO public.pincodes (code, area) VALUES
  ('682001', 'Fort Kochi'),
  ('682002', 'Mattancherry'),
  ('682011', 'Ernakulam South'),
  ('682016', 'Kadavanthra'),
  ('682020', 'Ravipuram'),
  ('682024', 'Palarivattom'),
  ('682025', 'Vyttila'),
  ('682026', 'Aroor'),
  ('682027', 'Alangad'),
  ('682028', 'Angamaly'),
  ('682030', 'Eloor'),
  ('682031', 'Aluva');

-- Insert sample products and variants
INSERT INTO public.products (name, description, image, category_id, rating, reviews_count) 
SELECT 
  'Fresh Spinach',
  'Farm-fresh organic spinach leaves, rich in iron and vitamins',
  'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
  c.id,
  4.5,
  23
FROM public.categories c WHERE c.name = 'Leafy Greens';

INSERT INTO public.product_variants (product_id, weight, price, mrp, stock)
SELECT p.id, '250g', 25.00, 30.00, 100 FROM public.products p WHERE p.name = 'Fresh Spinach'
UNION ALL
SELECT p.id, '500g', 45.00, 55.00, 50 FROM public.products p WHERE p.name = 'Fresh Spinach';

-- Insert sample banners
INSERT INTO public.banners (title, subtitle, image, sort_order) VALUES
  ('Fresh Vegetables Daily', 'Farm to your doorstep in 24 hours', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 1),
  ('Organic & Fresh', 'Quality assured vegetables', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800', 2);