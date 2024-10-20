"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/checkout-session?session_id=${sessionId}`);
          if (response.ok) {
            setStatus('success');
            clearCart(); // Clear the cart after successful checkout
          } else {
            setStatus('error');
          }
        } catch (error) {
          console.error('Error fetching checkout session:', error);
          setStatus('error');
        }
      }
    };

    fetchCheckoutSession();
  }, [sessionId, clearCart]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>There was an error processing your order. Please contact support.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your purchase!</h1>
      <p className="mb-8">Your order has been successfully processed.</p>
      <Link href="/">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}
