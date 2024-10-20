import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createPrintfulOrder } from '@/lib/printful';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-09-30.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log('Received event:', event.type);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      await createPrintfulOrder(session);
      return NextResponse.json({ received: true });
    } catch (error: any) {
      console.error('Error creating Printful order:', error.message, error.stack);
      // Log the full error object
      console.error('Full error:', JSON.stringify(error, null, 2));
      if (error.message === 'Missing required shipping information') {
        return NextResponse.json({ error: 'Missing shipping information' }, { status: 400 });
      }
      // For other errors, return 500
      return NextResponse.json({ error: 'Error creating Printful order' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
