import { mockProducts, mockProductDetails } from './mockData';
import { Stripe } from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});


async function fetchFromPrintful(endpoint: string) {
  if (!process.env.PRINTFUL_API_KEY) {
    console.warn('Printful API key is not set. Using mock data.');
    return getMockData(endpoint);
  }

  try {
    const response = await fetch(`${process.env.PRINTFUL_API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching from Printful:', error);
    return getMockData(endpoint);
  }
}

function getMockData(endpoint: string) {
  if (endpoint === '/store/products') {
    return { result: mockProducts };
  } else if (endpoint.startsWith('/store/products/')) {
    const productId = endpoint.split('/').pop();
    return { result: mockProductDetails[productId as keyof typeof mockProductDetails] || null };
  }
  return { result: null };
}

export async function fetchProducts() {
  const data = await fetchFromPrintful('/store/products');
  return data.result.map((product: any) => ({
    id: product.id,
    name: product.name,
    thumbnail_url: product.thumbnail_url,
    variants: product.variants,
    synced: product.synced
  }));
}

export async function fetchProductDetails(id: string) {
  const data = await fetchFromPrintful(`/store/products/${id}`);
  const product = data.result.sync_product;
  const variants = data.result.sync_variants;
  return {
    id: product.id,
    name: product.name,
    thumbnail_url: product.thumbnail_url,
    variants: variants.map((variant: any) => ({
      id: variant.id,
      name: variant.name,
      retail_price: variant.retail_price,
      size: variant.size,
      color: variant.color,
      preview_url: variant.files[0]?.preview_url
    }))
  };
}



export async function createPrintfulOrder(session: Stripe.Checkout.Session) {
  console.log('Creating Printful order for session:', session.id);
  console.log('Full session object:', JSON.stringify(session, null, 2));

  try {
    // Extract shipping details
    const shippingDetails = session.shipping_details;
    if (!shippingDetails) {
      throw new Error('Missing shipping details in the session');
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });
    console.log('Line items:', JSON.stringify(lineItems, null, 2));

    const orderItems = lineItems.data.map(item => {
      const product = item.price?.product as Stripe.Product | null;
      const printfulVariantId = product?.metadata?.printful_variant_id;
      if (!printfulVariantId) {
        throw new Error(`Missing Printful variant ID for item: ${item.description}`);
      }
      return {
        sync_variant_id: parseInt(printfulVariantId),
        quantity: item.quantity,
        retail_price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
      };
    });

    const order = {
      recipient: {
        name: shippingDetails.name,
        address1: shippingDetails.address?.line1,
        address2: shippingDetails.address?.line2,
        city: shippingDetails.address?.city,
        state_code: shippingDetails.address?.state,
        country_code: shippingDetails.address?.country,
        zip: shippingDetails.address?.postal_code,
      },
      items: orderItems,
    };

    console.log('Sending order to Printful:', JSON.stringify(order, null, 2));

    if (!order.recipient.name || !order.recipient.address1 || !order.recipient.city || !order.recipient.country_code || !order.recipient.zip) {
      console.error('Missing required shipping information:', order.recipient);
      throw new Error('Missing required shipping information');
    }

    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create Printful order: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Printful order created:', result);
    return result;
  } catch (error: any) {
    console.error('Error in createPrintfulOrder:', error.message, error.stack);
    throw error;
  }
}
