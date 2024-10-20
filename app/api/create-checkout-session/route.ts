import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fetchProductDetails } from '@/lib/printful';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const lineItems = await Promise.all(items.map(async (item: any) => {
      const product = await fetchProductDetails(item.id);
      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }
      const variant = product.variants.find((v: any) => v.id === item.variantId);
      if (!variant) {
        throw new Error(`Variant not found: ${item.variantId}`);
      }
      if (parseFloat(variant.retail_price) !== item.price) {
        throw new Error(`Price mismatch for ${product.name}`);
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.name} - ${variant.name}`,
            images: [variant.preview_url || product.thumbnail_url],
            metadata: {
              printful_variant_id: variant.id.toString(),
            },
          },
          unit_amount: Math.round(parseFloat(variant.retail_price) * 100),
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
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add countries you want to ship to
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
