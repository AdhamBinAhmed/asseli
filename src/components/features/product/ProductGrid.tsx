'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ProductCard } from '@/components/features/product/ProductCard';
import { Product } from '@/store/useCartStore';
import { PackageOpen } from 'lucide-react';

export function ProductGrid() {
  const t = useTranslations('ProductsPage');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const data: Product[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]"
          >
            <div className="aspect-square w-full animate-pulse bg-gradient-to-br from-white/[0.06] to-transparent" />
            <div className="space-y-3 p-6">
              <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-1/3 animate-pulse rounded-full bg-white/10" />
              <div className="mt-4 h-11 w-full animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        ))}
        <p className="sr-only">{t('loading')}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] py-20 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
          <PackageOpen className="h-8 w-8" />
        </span>
        <p className="text-amber-100/60">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
