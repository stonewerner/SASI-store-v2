import ProductGrid from '@/components/ProductGrid';
import { fetchProducts } from '@/lib/printful';

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Our Print On Demand Store</h1>
      <ProductGrid products={products} />
    </div>
  );
}