'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { CopyButton } from '@/components/ui/CopyButton';
import { Search, CheckCircle, XCircle, Clock, Loader2, MapPin } from 'lucide-react';

interface Order {
  id: string;
  status?: string;
  customerName?: string;
  customerAddress?: string;
  governorate?: string;
  total?: number;
  items?: { name: string; quantity: number; price: string }[];
}

export default function TrackOrderPage() {
  const t = useTranslations('TrackOrder');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setOrder(null);

    try {
      const docRef = doc(db, 'orders', orderId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        const q = query(collection(db, 'orders'), where('customerPhone', '==', orderId.trim()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          setOrder({ id: firstDoc.id, ...firstDoc.data() });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status?: string) => {
    if (status === 'accepted') {
      return { Icon: CheckCircle, text: t('accepted'), color: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/25' };
    }
    if (status === 'refused') {
      return { Icon: XCircle, text: t('refused'), color: 'text-red-300', bg: 'bg-red-500/10 border-red-500/25' };
    }
    return { Icon: Clock, text: t('pending'), color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/25' };
  };

  const status = order ? getStatusInfo(order.status) : null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-clip bg-[#0b0705] text-amber-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 35% at 18% 0%, rgba(245,158,11,0.16) 0%, transparent 60%), radial-gradient(45% 40% at 90% 12%, rgba(124,45,18,0.26) 0%, transparent 60%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,transparent_55%,#0b0705_100%)]" />

      <div className="relative mx-auto max-w-2xl px-5 py-16 sm:px-6 md:py-24">
        <ScrollFadeIn delay={0.05} className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-amber-100/60 sm:text-lg">{t('description')}</p>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.15}>
          <form onSubmit={handleSearch} className="mb-10 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-100/40" />
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={t('orderIdPlaceholder')}
                className="h-14 w-full rounded-full border border-white/15 bg-white/[0.04] ps-12 pe-5 text-base text-amber-50 placeholder:text-amber-100/40 outline-none transition-colors focus:border-amber-300/50 focus:ring-1 focus:ring-amber-400/40"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !orderId.trim()}
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-8 font-semibold text-[#2a1608] shadow-[0_10px_40px_-10px_rgba(245,158,11,0.7)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="h-5 w-5" /> {t('trackButton')}</>}
            </button>
          </form>
        </ScrollFadeIn>

        {hasSearched && !isLoading && !order && (
          <ScrollFadeIn className="rounded-3xl border border-red-500/25 bg-red-500/10 p-8 text-center">
            <XCircle className="mx-auto mb-3 h-8 w-8 text-red-300" />
            <p className="text-base font-medium text-red-200">{t('notFound')}</p>
          </ScrollFadeIn>
        )}

        {order && status && (
          <ScrollFadeIn className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-8">
            {/* Order ID + copy */}
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-amber-100/40">{t('orderIdLabel')}</p>
                <p className="mt-1 break-all font-mono text-sm font-semibold text-amber-200 sm:text-base">{order.id}</p>
              </div>
              <CopyButton value={order.id} copyLabel={t('copy')} copiedLabel={t('copied')} className="shrink-0 self-start sm:self-auto" />
            </div>

            {/* Status */}
            <div className={`mb-8 flex flex-col items-center justify-center rounded-2xl border p-8 ${status.bg}`}>
              <status.Icon className={`mb-4 h-12 w-12 ${status.color}`} />
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-amber-100/50">{t('status')}</h2>
              <span className={`text-3xl font-bold ${status.color}`}>{status.text}</span>
            </div>

            <h3 className="mb-5 text-lg font-bold text-amber-50">{t('orderDetails')}</h3>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-amber-100/40">
                  <MapPin className="h-3.5 w-3.5" /> {t('shipping')}
                </p>
                <p className="font-semibold text-amber-50">{order.customerName}</p>
                <p className="text-sm text-amber-100/55">{order.customerAddress}, {order.governorate}</p>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-100/40">{t('items')}</p>
                <div className="divide-y divide-white/10">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <span className="text-sm font-medium text-amber-50">
                        <span className="text-amber-300">{item.quantity}×</span> {item.name}
                      </span>
                      <span className="text-sm text-amber-100/55">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-lg font-bold text-amber-50">{t('total')}</span>
                <span className="bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-2xl font-bold text-transparent">
                  EGP {(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </ScrollFadeIn>
        )}
      </div>
    </div>
  );
}
