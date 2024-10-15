import { mockProducts, mockProductDetails } from './mockData';

const PRINTFUL_API_URL = 'https://api.printful.com';

async function fetchFromPrintful(endpoint: string) {
  if (!process.env.PRINTFUL_API_KEY) {
    console.warn('Printful API key is not set. Using mock data.');
    return getMockData(endpoint);
  }

  try {
    const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
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
  return data.result;
}

export async function fetchProductDetails(id: string) {
  const data = await fetchFromPrintful(`/store/products/${id}`);
  return data.result;
}
