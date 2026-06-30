'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TrackOrderPage() {
  const t = useTranslations('TrackOrder');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any | null>(null);
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
          // We take the first (most recent) matching order if multiple exist
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

  const getStatusInfo = (status: string) => {
    if (status === 'accepted') {
      return { icon: <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />, text: t('accepted'), color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    }
    if (status === 'refused') {
      return { icon: <XCircle className="w-12 h-12 text-destructive mb-4" />, text: t('refused'), color: 'text-destructive', bg: 'bg-destructive/10' };
    }
    return { icon: <Clock className="w-12 h-12 text-amber-500 mb-4" />, text: t('pending'), color: 'text-amber-500', bg: 'bg-amber-500/10' };
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start p-8 md:p-16">
      <ScrollFadeIn delay={0.1} className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('description')}</p>
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.2} className="w-full max-w-xl">
        <form onSubmit={handleSearch} className="flex gap-4 mb-12">
          <Input 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t('orderIdPlaceholder')}
            className="h-14 text-lg rounded-full px-6 shadow-sm bg-card"
          />
          <Button type="submit" disabled={isLoading || !orderId.trim()} className="h-14 rounded-full px-8 shadow-sm">
            {isLoading ? '...' : <><Search className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> {t('trackButton')}</>}
          </Button>
        </form>

        {hasSearched && !isLoading && !order && (
          <div className="text-center p-8 bg-destructive/10 rounded-3xl border border-destructive/20">
            <p className="text-destructive font-medium text-lg">{t('notFound')}</p>
          </div>
        )}

        {order && (
          <ScrollFadeIn className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-lg">
            
            {/* Status Section */}
            <div className={`flex flex-col items-center justify-center p-8 rounded-2xl mb-8 border border-border/50 ${getStatusInfo(order.status).bg}`}>
              {getStatusInfo(order.status).icon}
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{t('status')}</h2>
              <span className={`text-3xl font-bold ${getStatusInfo(order.status).color}`}>
                {getStatusInfo(order.status).text}
              </span>
            </div>

            {/* Details Section */}
            <h3 className="text-xl font-bold mb-6">{t('orderDetails')}</h3>
            
            <div className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">{t('shipping')}:</p>
                <p className="font-medium text-lg">{order.customerName}</p>
                <p className="text-muted-foreground">{order.customerAddress}, {order.governorate}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-4">{t('items')}:</p>
                <div className="space-y-3">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <span className="font-medium">{item.quantity}x {item.name}</span>
                      <span className="text-muted-foreground">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border/50">
                <span className="text-xl font-bold">{t('total')}</span>
                <span className="text-2xl font-bold text-primary">EGP {(order.total || 0).toFixed(2)}</span>
              </div>
            </div>

          </ScrollFadeIn>
        )}
      </ScrollFadeIn>
    </div>
  );
}
