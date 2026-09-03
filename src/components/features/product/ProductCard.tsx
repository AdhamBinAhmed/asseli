'use client';

import { useTranslations } from 'next-intl';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { useCartStore, Product } from '@/store/useCartStore';
import { ShoppingCart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const t = useTranslations('ProductsPage');
  const addItem = useCartStore((state) => state.addItem);

  return (
    <ScrollFadeIn delay={0.15 + index * 0.08} className="flex">
      <div className="group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-300/40 hover:shadow-[0_30px_60px_-25px_rgba(245,158,11,0.35)]">
        {/* glow on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(50% 100% at 50% 0%, rgba(245,158,11,0.4), transparent)' }}
        />

        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="relative h-full w-full object-contain p-6 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:-translate-y-1 group-hover:scale-105"
            loading="lazy"
            draggable={false}
          />
          {product.batch && (
            <span className="absolute start-4 top-4 rounded-full border border-amber-300/30 bg-black/40 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-200 backdrop-blur-md">
              {t('batch')} {product.batch}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6 pt-2">
          <h3 className="text-xl font-bold tracking-tight text-amber-50">{product.name}</h3>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-amber-100/50">{product.weight}</span>
            <span className="bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-2xl font-bold text-transparent">
              {product.price}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => addItem(product)}
              className="group/btn inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-5 py-3 font-semibold text-[#2a1608] shadow-[0_8px_24px_-8px_rgba(245,158,11,0.6)] transition-all hover:shadow-[0_12px_30px_-6px_rgba(245,158,11,0.85)] hover:brightness-105"
            >
              <ShoppingCart className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" />
              {t('addToCart')}
            </button>
            <button
              onClick={() => addItem(product)}
              aria-label={t('addToCart')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200/25 text-amber-200 transition-colors hover:border-amber-300/60 hover:bg-white/5"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </ScrollFadeIn>
  );
}
