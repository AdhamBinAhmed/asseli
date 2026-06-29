'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/store/useCartStore';
import { Link, useRouter } from '@/i18n/routing';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  { value: 'south_sinai', en: 'South Sinai', ar: 'جنوب سيناء', cost: 120 }
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

  const parsePrice = (priceStr: string) => parseFloat(priceStr.replace('$', ''));
  
  const subtotal = items.reduce((acc, item) => acc + (parsePrice(item.price) * item.quantity), 0);
  
  const selectedGovData = governorates.find(g => g.value === selectedGov);
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
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, id: i.id })),
        total: total,
        status: 'pending',
        date: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'orders'), order);
      clearCart();
      alert(locale === 'ar' ? `تم استلام طلبك بنجاح! رقم تتبع الطلب الخاص بك هو: ${docRef.id}` : `Your order has been received successfully! Your tracking ID is: ${docRef.id}`);
      router.push('/track-order');
    } catch (e) {
      console.error(e);
      alert('Error placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8 min-h-[60vh]">
        <ScrollFadeIn className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground tracking-tight">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mb-8">{t('empty')}</p>
          <Link href="/products">
            <Button className="rounded-full px-8 py-6 text-lg">{t('continueShopping')}</Button>
          </Link>
        </ScrollFadeIn>
      </div>
    );
  }

  const isFormValid = selectedGov && customerName && customerPhone && customerAddress;

  return (
    <div className="flex flex-col flex-1 items-center justify-start p-8 md:p-16">
      <ScrollFadeIn delay={0.1} className="w-full max-w-6xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">{t('title')}</h1>
      </ScrollFadeIn>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map((item, index) => (
            <ScrollFadeIn key={item.id} delay={0.1 + index * 0.1}>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-border/50 rounded-2xl bg-card">
                <div className="w-full sm:w-32 h-32 bg-muted rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col flex-1 justify-between w-full h-full py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Batch {item.batch} • {item.weight}</p>
                    </div>
                    <span className="text-lg font-medium text-primary">{item.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-4 bg-muted/50 rounded-full px-2 py-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-4 text-center font-medium">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 me-2" />
                      <span className="hidden sm:inline">{t('remove')}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <ScrollFadeIn delay={0.3} className="sticky top-24 border border-border/50 rounded-2xl p-8 bg-card flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight">{t('orderSummary')}</h2>
            
            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">{t('subtotal')}</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col gap-4 border-y border-border/50 py-6">
              <Input placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} value={customerName} onChange={e => setCustomerName(e.target.value)} />
              <Input placeholder={locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'} value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              <Input placeholder={locale === 'ar' ? 'العنوان التفصيلي' : 'Detailed Address'} value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
              
              <div className="mt-2">
                <span className="text-sm text-muted-foreground block mb-2">{t('shippingOptions')}</span>
                <Select onValueChange={(val: string | null) => setSelectedGov(val || '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('selectGovernorate')} />
                  </SelectTrigger>
                  <SelectContent>
                    {governorates.map((gov) => (
                      <SelectItem key={gov.value} value={gov.value}>
                        {locale === 'ar' ? gov.ar : gov.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedGov && (
                <div className="flex justify-between text-sm font-medium mt-2">
                  <span>{t('shipping')}</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between text-xl font-bold mt-2">
              <span>{t('total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <Button 
              onClick={handleCheckout} 
              disabled={!isFormValid || isSubmitting}
              className="w-full py-6 mt-4 text-lg rounded-full shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
            >
              {isSubmitting ? '...' : t('checkout')}
            </Button>
          </ScrollFadeIn>
        </div>
      </div>
    </div>
  );
}
