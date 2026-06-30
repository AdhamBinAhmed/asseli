'use client';

import { useTranslations } from 'next-intl';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { Button } from '@/components/ui/button';
import { useCartStore, Product } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const t = useTranslations('ProductsPage');
  const addItem = useCartStore((state) => state.addItem);

  return (
    <ScrollFadeIn delay={0.2 + index * 0.1} className="flex">
      <div className="group flex flex-col w-full border border-border/50 rounded-2xl overflow-hidden bg-card transition-all hover:shadow-xl hover:border-border">
        <div className="relative w-full aspect-square overflow-hidden bg-muted">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-border">
            Batch {product.batch}
          </div>
        </div>
        
        <div className="flex flex-col flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-foreground tracking-tight">{product.name}</h3>
          </div>
          <div className="flex justify-between items-center mb-6 text-muted-foreground text-sm">
            <span>{product.weight}</span>
            <span className="text-lg font-medium text-primary">{product.price}</span>
          </div>
          
          <div className="mt-auto flex flex-col gap-3">
            <Button 
              className="w-full rounded-full transition-all hover:shadow-md"
              onClick={() => addItem(product)}
            >
              {t('addToCart')}
            </Button>
            <Button variant="outline" className="w-full rounded-full">
              {t('viewDetails')}
            </Button>
          </div>
        </div>
      </div>
    </ScrollFadeIn>
  );
}
