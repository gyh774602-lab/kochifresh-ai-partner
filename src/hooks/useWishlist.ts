import { useState, useEffect } from "react";

const WISHLIST_STORAGE_KEY = "ecfresh_wishlist";

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlistItems(new Set(parsedWishlist));
      } catch (error) {
        console.error("Error loading wishlist from storage:", error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(Array.from(wishlistItems)));
  }, [wishlistItems]);

  const addToWishlist = (productId: string) => {
    setWishlistItems(prev => new Set([...prev, productId]));
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.has(productId);
  };

  const clearWishlist = () => {
    setWishlistItems(new Set());
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  };

  return {
    wishlistItems: Array.from(wishlistItems),
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
};