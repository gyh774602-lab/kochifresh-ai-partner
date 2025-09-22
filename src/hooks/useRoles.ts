import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setRoles(data?.map(r => r.role) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch roles');
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [user]);

  const isAdmin = roles.includes('admin');
  const isUser = roles.includes('user');

  return {
    roles,
    isAdmin,
    isUser,
    loading,
    error
  };
};