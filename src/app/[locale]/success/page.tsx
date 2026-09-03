'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { CopyButton } from '@/components/ui/CopyButton';
import { CheckCircle2, Home, Package } from 'lucide-react';

function SuccessContent() {
  const t = useTranslations('SuccessPage');
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-clip bg-[#0b0705] px-5 py-16 text-amber-50 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 40% at 50% 0%, rgba(245,158,11,0.18) 0%, transparent 60%), radial-gradient(45% 40% at 90% 90%, rgba(124,45,18,0.24) 0%, transparent 60%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_50%,#0b0705_100%)]" />

      <ScrollFadeIn className="relative flex w-full max-w-lg flex-col items-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur-xl sm:p-12">
        <div className="relative mb-7">
          <div aria-hidden className="absolute inset-0 rounded-full bg-emerald-400/25 blur-2xl" />
          <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15">
            <CheckCircle2 className="h-11 w-11 text-emerald-300" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
          <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            {t('title')}
          </span>
        </h1>

        <p className="mt-4 text-base text-amber-100/60 sm:text-lg">{t('thanks')}</p>

        {orderId && (
          <div className="mt-8 flex w-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-5">
            <span className="text-xs uppercase tracking-widest text-amber-100/45">{t('orderId')}</span>
            <span className="w-full break-all font-mono text-xl font-bold text-amber-200 sm:text-2xl">{orderId}</span>
            <CopyButton value={orderId} copyLabel={t('copy')} copiedLabel={t('copied')} />
          </div>
        )}

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/track-order"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3.5 font-semibold text-[#2a1608] shadow-[0_10px_40px_-10px_rgba(245,158,11,0.7)] transition-all hover:brightness-105"
          >
            <Package className="h-5 w-5" />
            {t('trackOrder')}
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-200/25 px-6 py-3.5 font-semibold text-amber-50 transition-colors hover:bg-white/5"
          >
            <Home className="h-5 w-5" />
            {t('backHome')}
          </Link>
        </div>
      </ScrollFadeIn>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] bg-[#0b0705]" />}>
      <SuccessContent />
    </Suspense>
  );
}
