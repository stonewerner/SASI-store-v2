const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';

async function fetchFromPrintful(endpoint: string) {
  if (!PRINTFUL_API_KEY) {
    console.warn('Printful API key is not set. Using mock data.');
    return getMockData(endpoint);
  }

  try {
    const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
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
    return {
      result: [
        {
          id: 1,
          name: 'Mock T-Shirt',
          thumbnail_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
          retail_price: 29.99,
        },
        {
          id: 2,
          name: 'Mock Hoodie',
          thumbnail_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
          retail_price: 49.99,
        },
      ],
    };
  } else if (endpoint.startsWith('/store/products/')) {
    const productId = endpoint.split('/').pop();
    const products = {
      '1': {
        id: 1,
        name: 'Mock T-Shirt',
        description: 'A comfortable and stylish t-shirt.',
        thumbnail_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        retail_price: 29.99,
        variants: [
          {
            id: 1,
            name: 'Small',
            retail_price: 29.99,
            files: [{ preview_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' }],
          },
          {
            id: 2,
            name: 'Medium',
            retail_price: 29.99,
            files: [{ preview_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' }],
          },
        ],
      },
      '2': {
        id: 2,
        name: 'Mock Hoodie',
        description: 'A warm and cozy hoodie.',
        thumbnail_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        retail_price: 49.99,
        variants: [
          {
            id: 3,
            name: 'Small',
            retail_price: 49.99,
            files: [{ preview_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' }],
          },
          {
            id: 4,
            name: 'Medium',
            retail_price: 49.99,
            files: [{ preview_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' }],
          },
        ],
      },
    };
    return { result: products[productId as keyof typeof products] || null };
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
