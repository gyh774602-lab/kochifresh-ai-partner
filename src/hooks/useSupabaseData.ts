import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('created_at');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Hook for fetching products with variants
export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants(*),
            categories(name, icon, color)
          `)
          .eq('is_active', true)
          .order('created_at');
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

// Hook for fetching banners
export const useBanners = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
        
        if (error) throw error;
        setBanners(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch banners');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return { banners, loading, error };
};

// Hook for fetching pincodes
export const usePincodes = () => {
  const [pincodes, setPincodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        const { data, error } = await supabase
          .from('pincodes')
          .select('*')
          .eq('is_active', true)
          .order('code');
        
        if (error) throw error;
        setPincodes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pincodes');
      } finally {
        setLoading(false);
      }
    };

    fetchPincodes();
  }, []);

  return { pincodes, loading, error };
};

// Hook for single product
export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants(*),
            categories(name, icon, color)
          `)
          .eq('id', productId)
          .eq('is_active', true)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};