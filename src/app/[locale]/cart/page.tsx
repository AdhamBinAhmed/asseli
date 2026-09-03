'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/store/useCartStore';
import { Link, useRouter } from '@/i18n/routing';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const governorates = [
  { value: 'cairo', en: 'Cairo', ar: 'القاهرة', cost: 75 },
  { value: 'giza', en: 'Giza', ar: 'الجيزة', cost: 75 },
  { value: 'qalyubia', en: 'Qalyubia', ar: 'القليوبية', cost: 75 },
  { value: 'alexandria', en: 'Alexandria', ar: 'الإسكندرية', cost: 120 },
  { value: 'sharqia', en: 'Sharqia', ar: 'الشرقية', cost: 120 },
  { value: 'dakahlia', en: 'Dakahlia', ar: 'الدقهلية', cost: 120 },
  { value: 'beheira', en: 'Beheira', ar: 'البحيرة', cost: 120 },
  { value: 'minya', en: 'Minya', ar: 'المنيا', cost: 120 },
  { value: 'gharbia', en: 'Gharbia', ar: 'الغربية', cost: 120 },
  { value: 'sohag', en: 'Sohag', ar: 'سوهاج', cost: 120 },
  { value: 'asyut', en: 'Asyut', ar: 'أسيوط', cost: 120 },
  { value: 'monufia', en: 'Monufia', ar: 'المنوفية', cost: 120 },
  { value: 'faiyum', en: 'Faiyum', ar: 'الفيوم', cost: 120 },
  { value: 'kafr_el_sheikh', en: 'Kafr El Sheikh', ar: 'كفر الشيخ', cost: 120 },
  { value: 'qena', en: 'Qena', ar: 'قنا', cost: 120 },
  { value: 'beni_suef', en: 'Beni Suef', ar: 'بني سويف', cost: 120 },
  { value: 'aswan', en: 'Aswan', ar: 'أسوان', cost: 120 },
  { value: 'damietta', en: 'Damietta', ar: 'دمياط', cost: 120 },
  { value: 'ismailia', en: 'Ismailia', ar: 'الإسماعيلية', cost: 120 },
  { value: 'luxor', en: 'Luxor', ar: 'الأقصر', cost: 120 },
  { value: 'port_said', en: 'Port Said', ar: 'بورسعيد', cost: 120 },
  { value: 'suez', en: 'Suez', ar: 'السويس', cost: 120 },
  { value: 'matrouh', en: 'Matrouh', ar: 'مطروح', cost: 120 },
  { value: 'north_sinai', en: 'North Sinai', ar: 'شمال سيناء', cost: 120 },
  { value: 'red_sea', en: 'Red Sea', ar: 'البحر الأحمر', cost: 120 },
  { value: 'new_valley', en: 'New Valley', ar: 'الوادي الجديد', cost: 120 },
  { value: 'south_sinai', en: 'South Sinai', ar: 'جنوب سيناء', cost: 120 },
];

export default function CartPage() {
  const t = useTranslations('CartPage');
  const locale = useLocale();
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [selectedGov, setSelectedGov] = useState<string>('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsePrice = (priceStr: string) => parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;

  const subtotal = items.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const selectedGovData = governorates.find((g) => g.value === selectedGov);
  const shippingCost = selectedGovData ? selectedGovData.cost : 0;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (!selectedGov || !customerName || !customerPhone || !customerAddress) return;
    setIsSubmitting(true);

    try {
      const order = {
        customerName,
        customerPhone,
        customerAddress,
        governorate: selectedGovData?.en || selectedGov,
        items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price, id: i.id })),
        total: total,
        status: 'pending',
        date: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'orders'), order);
      clearCart();
      router.push(`/success?orderId=${docRef.id}`);
    } catch (e) {
      console.error(e);
      alert('Error placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'border-white/15 bg-white/[0.04] text-amber-50 placeholder:text-amber-100/40 focus-visible:ring-amber-400/40 focus-visible:border-amber-300/50';

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-clip bg-[#0b0705] text-amber-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 35% at 15% 0%, rgba(245,158,11,0.16) 0%, transparent 60%), radial-gradient(45% 40% at 92% 12%, rgba(124,45,18,0.26) 0%, transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,transparent_55%,#0b0705_100%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );

  if (items.length === 0) {
    return (
      <Shell>
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 text-center">
          <ScrollFadeIn className="flex flex-col items-center">
            <span className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/10 text-amber-300">
              <ShoppingBag className="h-9 w-9" />
            </span>
            <h1 className="mb-3 text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
            <p className="mb-8 text-lg text-amber-100/55">{t('empty')}</p>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-4 font-semibold text-[#2a1608] shadow-[0_10px_40px_-8px_rgba(245,158,11,0.6)] transition-all hover:brightness-105"
            >
              {t('continueShopping')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </ScrollFadeIn>
        </div>
      </Shell>
    );
  }

  const isFormValid = selectedGov && customerName && customerPhone && customerAddress;

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
        <ScrollFadeIn delay={0.05} className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            {t('itemsTitle')}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
            <span className="ms-3 align-middle text-lg font-medium text-amber-100/40">
              ({itemCount})
            </span>
          </h1>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Items */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {items.map((item, index) => (
              <ScrollFadeIn key={item.id} delay={0.08 + index * 0.06}>
                <div className="flex flex-col items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-colors hover:border-amber-300/25 sm:flex-row">
                  <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black/30 md:h-32 md:w-32">
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-60 blur-2xl"
                      style={{ background: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.3), transparent 70%)' }}
                    />
                    <img src={item.image} alt={item.name} className="relative h-full w-full object-contain p-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                  </div>

                  <div className="flex h-full w-full flex-1 flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-amber-50">{item.name}</h3>
                        <p className="mt-1 text-xs text-amber-100/45">
                          {item.batch ? `${item.batch} • ` : ''}
                          {item.weight}
                        </p>
                      </div>
                      <span className="bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-lg font-bold text-transparent">
                        {item.price}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-amber-100/70 transition-colors hover:bg-white/10 hover:text-amber-100"
                          aria-label="Decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-amber-50">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-amber-100/70 transition-colors hover:bg-white/10 hover:text-amber-100"
                          aria-label="Increase"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-amber-100/50 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('remove')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <ScrollFadeIn delay={0.2} className="sticky top-24 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
              <h2 className="text-xl font-bold tracking-tight text-amber-50">{t('orderSummary')}</h2>

              <div className="flex justify-between text-sm">
                <span className="text-amber-100/55">{t('subtotal')}</span>
                <span className="font-semibold text-amber-50">EGP {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-3 border-y border-white/10 py-5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                  {t('deliveryDetails')}
                </span>
                <Input className={inputClass} placeholder={t('fullName')} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <Input className={inputClass} placeholder={t('phone')} value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                <Input className={inputClass} placeholder={t('address')} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />

                <Select onValueChange={(val: string | null) => setSelectedGov(val || '')}>
                  <SelectTrigger className={`w-full ${inputClass}`}>
                    <SelectValue placeholder={t('selectGovernorate')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 border-amber-200/15 bg-[#141009]/95 text-amber-50 backdrop-blur-xl">
                    {governorates.map((gov) => (
                      <SelectItem key={gov.value} value={gov.value} className="focus:bg-amber-400/15 focus:text-amber-100">
                        {locale === 'ar' ? gov.ar : gov.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedGov && (
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-amber-100/55">{t('shipping')}</span>
                    <span className="font-semibold text-amber-50">EGP {shippingCost.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-amber-50">{t('total')}</span>
                <span className="bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-2xl font-bold text-transparent">
                  EGP {total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!isFormValid || isSubmitting}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-4 font-semibold text-[#2a1608] shadow-[0_10px_40px_-10px_rgba(245,158,11,0.7)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {t('checkout')}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </ScrollFadeIn>
          </div>
        </div>
      </div>
    </Shell>
  );
}
