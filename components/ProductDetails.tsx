"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetails({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      name: `${product.name} - ${selectedVariant.name}`,
      price: parseFloat(selectedVariant.retail_price),
      variant: selectedVariant.name,
      quantity: 1,
      thumbnail: product.thumbnail_url || selectedVariant.preview_url,
    });
    //TODO: ^ change to use variant specific image

    toast({
      title: "Product added to cart",
      description: `${product.name} (${selectedVariant.name}) has been added to your cart.`,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        {/*TODO: change Image src to be the variant specific image on product page*/}
        <Image
          src={product.thumbnail_url || selectedVariant.preview_url}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-lg"
        />
      </div>
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl mb-4">${selectedVariant.retail_price}</p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Variant</label>
          <Select
            value={selectedVariant.id.toString()}
            onValueChange={(value) => setSelectedVariant(product.variants.find((v: any) => v.id.toString() === value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map((variant: any) => (
                <SelectItem key={variant.id} value={variant.id.toString()}>
                  {variant.name} - ${variant.retail_price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
      </div>
    </div>
  );
}
