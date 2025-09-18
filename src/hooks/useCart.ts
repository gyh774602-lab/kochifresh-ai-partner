import { useState, useEffect } from "react";
import { Cart, CartItem, Product, ProductVariant } from "@/lib/types";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, MIN_WALLET_USAGE } from "@/lib/mock-data";

const CART_STORAGE_KEY = "ecfresh_cart";

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  deliveryFee: 0,
  walletDiscount: 0,
  total: 0,
};

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(initialCart);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(calculateCartTotals(parsedCart));
      } catch (error) {
        console.error("Error loading cart from storage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const calculateCartTotals = (cartData: Cart): Cart => {
    const selectedItems = cartData.items.filter(item => item.isSelected);
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    let walletDiscount = cartData.walletDiscount || 0;
    
    // Ensure wallet discount doesn't exceed subtotal
    walletDiscount = Math.min(walletDiscount, subtotal);
    
    const total = subtotal + deliveryFee - walletDiscount;

    return {
      ...cartData,
      subtotal,
      deliveryFee,
      walletDiscount,
      total,
    };
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product.id && item.variantId === variant.id
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = prevCart.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          variantId: variant.id,
          quantity,
          isSelected: true,
          product,
          variant,
        };
        newItems = [...prevCart.items, newItem];
      }

      return calculateCartTotals({ ...prevCart, items: newItems });
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      return calculateCartTotals({ ...prevCart, items: newItems });
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      return calculateCartTotals({ ...prevCart, items: newItems });
    });
  };

  const toggleItemSelection = (itemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
      );
      return calculateCartTotals({ ...prevCart, items: newItems });
    });
  };

  const selectAllItems = (selected: boolean) => {
    setCart(prevCart => {
      const newItems = prevCart.items.map(item => ({ ...item, isSelected: selected }));
      return calculateCartTotals({ ...prevCart, items: newItems });
    });
  };

  const applyWalletDiscount = (amount: number) => {
    setCart(prevCart => {
      const maxDiscount = Math.min(amount, prevCart.subtotal);
      return calculateCartTotals({ ...prevCart, walletDiscount: maxDiscount });
    });
  };

  const removeWalletDiscount = () => {
    setCart(prevCart => calculateCartTotals({ ...prevCart, walletDiscount: 0 }));
  };

  const clearCart = () => {
    setCart(initialCart);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getCartItemCount = () => {
    return cart.items.reduce((sum, item) => sum + (item.isSelected ? item.quantity : 0), 0);
  };

  const hasSelectedItems = () => {
    return cart.items.some(item => item.isSelected && item.quantity > 0);
  };

  const canUseWallet = (walletBalance: number) => {
    return walletBalance >= MIN_WALLET_USAGE && cart.subtotal > 0;
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    applyWalletDiscount,
    removeWalletDiscount,
    clearCart,
    getCartItemCount,
    hasSelectedItems,
    canUseWallet,
  };
};