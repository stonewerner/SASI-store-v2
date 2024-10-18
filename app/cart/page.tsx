"use client";

import { useCart } from '@/components/CartProvider';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { id: sessionId } = await response.json();

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "There was a problem initiating the checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <Image
                  src={item.thumbnail || '/placeholder-image.jpg'}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-md mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p>Price: ${item.price}</p>
                  <p>Variant: {item.variant}</p>
                  <div className="flex items-center mt-2">
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                  </div>
                </div>
              </div>
              <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                Remove
              </Button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-xl font-bold mb-4">
              Total: ${cart.reduce((total: number, item: any) => total + item.price * item.quantity, 0).toFixed(2)}
            </p>
            <Button onClick={handleCheckout}>Proceed to Checkout</Button>
          </div>
        </>
      )}
    </div>
  );
}
