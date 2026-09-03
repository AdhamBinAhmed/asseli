import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { CertificateViewer } from '@/components/features/lab-viewer/CertificateViewer';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';
import { Droplets, ShieldCheck, QrCode } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LabAnalysis' });
  return { title: t('title'), description: t('description') };
}

export default function LabAnalysisPage() {
  const t = useTranslations('LabAnalysis');

  const features = [
    { icon: Droplets, title: t('feat1Title'), desc: t('feat1Desc') },
    { icon: ShieldCheck, title: t('feat2Title'), desc: t('feat2Desc') },
    { icon: QrCode, title: t('feat3Title'), desc: t('feat3Desc') },
  ];

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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,transparent_55%,#0b0705_100%)]"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-20 md:px-12 md:py-28">
        <ScrollFadeIn delay={0.05} className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">{t('kicker')}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-amber-100/60">{t('description')}</p>
        </ScrollFadeIn>

        {/* Feature strip */}
        <ScrollFadeIn delay={0.15} className="mb-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-amber-50">{f.title}</h3>
                  <p className="mt-1 text-xs leading-snug text-amber-100/55">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.25} className="w-full">
          <CertificateViewer batchUrl="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" />
        </ScrollFadeIn>
      </div>
    </div>
  );
}
