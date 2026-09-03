import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { ProductGrid } from '@/components/features/product/ProductGrid';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductsPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ProductsPage() {
  const t = useTranslations('ProductsPage');

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-clip bg-[#0b0705] text-amber-50">
      {/* Ambient honey glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 35% at 20% 0%, rgba(245,158,11,0.18) 0%, transparent 60%), radial-gradient(45% 40% at 90% 15%, rgba(124,45,18,0.28) 0%, transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,transparent_50%,#0b0705_100%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
        <ScrollFadeIn delay={0.05} className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            {t('kicker')}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-amber-100/60">
            {t('description')}
          </p>
          <span className="mx-auto mt-8 block h-px w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        </ScrollFadeIn>

        <ProductGrid />
      </div>
    </div>
  );
}
