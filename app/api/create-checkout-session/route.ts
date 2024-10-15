import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fetchProductDetails } from '@/lib/printful';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Keep the newer API version
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    // Validate and get accurate product details
    const lineItems = await Promise.all(items.map(async (item: any) => {
      const product = await fetchProductDetails(item.id);
      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.thumbnail_url],
            description: item.variant, // Added from bolt suggestion
          },
          unit_amount: Math.round(product.retail_price * 100),
        },
        quantity: item.quantity,
      };
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/cart`,
    });

    return NextResponse.json({ id: session.id }); // Changed to match bolt suggestion
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}