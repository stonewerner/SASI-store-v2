"use client";

import { useState, useEffect } from 'react';

export function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: any) => {
    setCart((prevCart: any) => {
      const existingItem = prevCart.find((i: any) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i: any) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (id: any) => {
    setCart((prevCart: any) => prevCart.filter((item: any) => item.id !== id));
  };

  const updateQuantity = (id: any, quantity: any) => {
    setCart((prevCart: any) =>
      prevCart.map((item: any) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return { cart, addToCart, removeFromCart, updateQuantity };
}