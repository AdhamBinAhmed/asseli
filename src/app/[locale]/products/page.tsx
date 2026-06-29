import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { ProductGrid } from '@/components/features/product/ProductGrid';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductsPage' });

  return {
    title: t('title'),
    description: t('description')
  };
}

export default function ProductsPage() {
  const t = useTranslations('ProductsPage');

  return (
    <div className="flex flex-col flex-1 items-center justify-start p-8 md:p-16">
      <ScrollFadeIn delay={0.1} className="max-w-3xl w-full text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">{t('title')}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {t('description')}
        </p>
      </ScrollFadeIn>

      <div className="container mx-auto max-w-6xl">
        <ProductGrid />
      </div>
    </div>
  );
}
