"use client";

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {
  const { cart } = useCart();

  return (
    <header className="bg-background shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Print On Demand Store
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/cart">
                <Button variant="ghost">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart ({cart.length})
                </Button>
              </Link>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}