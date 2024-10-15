import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function ProductGrid({ products }: { products: any }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product: any) => (
          <Link href={`/product/${product.id}`} key={product.id}>
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-2 flex-grow">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={product.thumbnail_url}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover object-center hover:opacity-75 transition-opacity duration-300"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium text-foreground truncate">{product.name}</h3>
              </CardContent>
              <CardFooter className="p-2">
                <p className="text-lg font-semibold text-foreground">${product.retail_price}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
