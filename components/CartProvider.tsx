"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: any) => {
    setCart((prevCart: any) => {
      const existingItem = prevCart.find((i: any) => i.id === item.id && i.variantId === item.variantId);
      if (existingItem) {
        return prevCart.map((i: any) =>
          i.id === item.id && i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: any) => {
    setCart((prevCart: any) => {
      const removedItem = prevCart.find((item: any) => item.id === id);
      if (removedItem) {
        toast({
          title: "Product removed from cart",
          description: `${removedItem.name} has been removed from your cart.`,
        });
      }
      return prevCart.filter((item: any) => item.id !== id);
    });
  };

  const updateQuantity = (id: any, quantity: any) => {
    setCart((prevCart: any) =>
      prevCart.map((item: any) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, quantity);
          if (newQuantity !== item.quantity) {
            toast({
              title: "Cart updated",
              description: `Quantity of ${item.name} updated to ${newQuantity}.`,
            });
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
