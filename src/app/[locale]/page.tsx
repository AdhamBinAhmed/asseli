import { useTranslations } from 'next-intl';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { Link } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center p-8">
      <ScrollFadeIn delay={0.1} className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary tracking-tight drop-shadow-lg">
          {t('title')}
        </h1>
        <p className="text-xl text-center max-w-2xl mb-10 text-white leading-relaxed drop-shadow-md">
          {t('description')}
        </p>
        <Link href="/products">
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-lg tracking-wide shadow-xl shadow-primary/20">
            {t('cta')}
          </button>
        </Link>
      </ScrollFadeIn>
    </div>
  );
}
