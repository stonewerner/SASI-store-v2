import { fetchProductDetails } from '@/lib/printful';
import ProductDetails from '@/components/ProductDetails';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProductDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  );
}