export const mockProducts = [
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
  ];
  
  export const mockProductDetails = {
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