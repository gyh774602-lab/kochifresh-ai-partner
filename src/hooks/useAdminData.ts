import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook for managing products (admin only)
export const useAdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_variants(*),
          categories(name, icon, color)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (productData: any) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchProducts(); // Refresh the list
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateProduct = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchProducts(); // Refresh the list
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProducts(); // Refresh the list
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};

// Hook for managing categories (admin only)
export const useAdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (categoryData: any) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateCategory = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};

// Hook for managing banners (admin only)
export const useAdminBanners = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setBanners(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const createBanner = async (bannerData: any) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([bannerData])
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchBanners(); // Refresh the list
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateBanner = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchBanners(); // Refresh the list
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchBanners(); // Refresh the list
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    banners,
    loading,
    error,
    createBanner,
    updateBanner,
    deleteBanner,
    refetch: fetchBanners
  };
};

// Hook for viewing all orders (admin only)
export const useAdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image),
            product_variants (weight, price)
          ),
          profiles (name, email, phone)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  };
};