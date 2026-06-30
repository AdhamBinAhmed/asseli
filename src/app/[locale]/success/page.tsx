'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { CheckCircle2, Home, Package } from 'lucide-react';

export default function SuccessPage() {
  const t = useTranslations('SuccessPage');
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8 min-h-[70vh]">
      <ScrollFadeIn className="flex flex-col items-center max-w-lg text-center bg-card p-10 md:p-16 rounded-3xl border border-border/50 shadow-2xl">
        <div className="bg-emerald-500/10 p-4 rounded-full mb-8">
          <CheckCircle2 className="w-20 h-20 text-emerald-500" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
          {t('title')}
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          {t('thanks')}
        </p>
        
        {orderId && (
          <div className="bg-muted w-full p-6 rounded-2xl border border-border/50 mb-8 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-2 uppercase tracking-widest">{t('orderId')}</span>
            <span className="text-3xl font-mono font-bold text-primary">{orderId}</span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link href="/track-order" className="w-full">
            <Button className="w-full py-6 text-lg rounded-full" variant="default">
              <Package className="w-5 h-5 me-2" />
              {t('trackOrder')}
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button className="w-full py-6 text-lg rounded-full" variant="outline">
              <Home className="w-5 h-5 me-2" />
              {t('backHome')}
            </Button>
          </Link>
        </div>
      </ScrollFadeIn>
    </div>
  );
}
