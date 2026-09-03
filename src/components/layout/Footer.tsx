'use client';

import { useTranslations } from 'next-intl';
import { Phone } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useGlobalSettings } from './GlobalSettingsProvider';
import { Logo } from './Logo';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.031 2c5.466 0 9.907 4.44 9.907 9.907 0 2.164-.7 4.168-1.874 5.79l1.242 4.54-4.654-1.22a9.855 9.855 0 01-4.62 1.133h-.005C6.562 22.15 2.12 17.71 2.12 12.245 2.12 6.78 6.563 2 12.03 2zm0 1.688c-4.536 0-8.22 3.684-8.22 8.219 0 1.45.38 2.864 1.1 4.114l.115.183-.733 2.68 2.74-.718.176.104a8.172 8.172 0 003.953 1.01h.003c4.535 0 8.219-3.684 8.219-8.218 0-4.535-3.684-8.219-8.219-8.219zm4.5 10.985c-.247-.124-1.46-.72-1.688-.802-.228-.083-.395-.124-.56.124-.167.248-.636.802-.782.967-.145.165-.29.186-.536.062-.248-.124-1.04-.383-1.983-1.222-.733-.653-1.226-1.46-1.372-1.707-.146-.248-.016-.381.108-.504.112-.111.247-.29.371-.433.123-.145.165-.248.247-.413.083-.165.042-.31-.02-.434-.063-.124-.56-1.35-.768-1.85-.202-.483-.408-.418-.56-.425-.145-.007-.31-.01-.476-.01-.165 0-.433.062-.66.31-.227.248-.866.845-.866 2.062s.887 2.392 1.01 2.557c.125.165 1.745 2.66 4.225 3.731.59.255 1.05.408 1.41.522.592.188 1.13.161 1.554.098.473-.07 1.46-.597 1.666-1.173.206-.576.206-1.07.145-1.173-.062-.103-.227-.165-.475-.289z" clipRule="evenodd" />
  </svg>
);

export function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navbar');
  const tHome = useTranslations('HomePage');
  const currentYear = new Date().getFullYear();
  const { phoneNumber, whatsappLink, facebookLink, instagramLink } = useGlobalSettings();

  const phone = phoneNumber || '0100 000 0000';
  const whatsapp = whatsappLink || 'https://wa.me/201000000000';
  const facebook = facebookLink || 'https://facebook.com';
  const instagram = instagramLink || 'https://instagram.com';

  const quickLinks = [
    { href: '/', label: tNav('home') },
    { href: '/products', label: tNav('shop') },
    { href: '/lab-analysis', label: tNav('provenance') },
    { href: '/track-order', label: tNav('track') },
    { href: '/cart', label: tNav('cartTitle') },
  ] as const;

  return (
    <footer className="relative z-10 mt-auto w-full overflow-hidden border-t border-amber-200/10 bg-[#0b0705] text-amber-50">
      {/* top gold hairline */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 md:px-12">
        <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col items-center gap-6 md:items-start">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <Logo className="h-24 w-72 drop-shadow-[0_2px_10px_rgba(245,158,11,0.35)]" />
            </Link>
            <p className="max-w-sm text-center text-base leading-relaxed text-amber-100/55 md:text-start">
              {tHome('description')}
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center gap-6 md:items-start">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">Quick Links</h3>
            <div className="flex flex-col gap-3.5 text-base font-medium">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group flex items-center gap-2.5 text-amber-100/60 transition-colors duration-300 hover:text-amber-200"
                >
                  <span className="h-0.5 w-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-5" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & socials */}
          <div className="flex flex-col items-center gap-6 md:items-start">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">{t('contact') || 'Contact Us'}</h3>
            <div className="flex flex-col gap-4">
              <a href={`tel:${phone}`} className="group flex items-center gap-3 text-amber-100/60 transition-colors duration-300 hover:text-amber-200">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 transition-colors group-hover:bg-amber-400/20">
                  <Phone className="h-4.5 w-4.5" />
                </span>
                <span className="text-base font-medium" dir="ltr">{phone}</span>
              </a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-amber-100/60 transition-colors duration-300 hover:text-amber-200">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 transition-colors group-hover:bg-amber-400/20">
                  <WhatsappIcon className="h-4.5 w-4.5" />
                </span>
                <span className="text-base font-medium">{t('whatsapp')}</span>
              </a>
            </div>

            <div className="mt-1 flex items-center gap-3">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/15 bg-white/[0.03] text-amber-100/70 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:text-amber-200">
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/15 bg-white/[0.03] text-amber-100/70 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:text-amber-200">
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Oversized brand watermark */}
        <div aria-hidden className="pointer-events-none select-none overflow-hidden">
          <span className="block bg-gradient-to-b from-amber-200/[0.07] to-transparent bg-clip-text text-center text-[22vw] font-bold leading-none tracking-tighter text-transparent md:text-[16rem]">
            ASSELI
          </span>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-200/15 to-transparent" />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-sm text-amber-100/45 md:flex-row" dir="ltr">
          <p className="font-medium">{t('rights') || 'All rights reserved to Asseli'} &copy; {currentYear}</p>
          <p className="flex items-center gap-1.5">
            {t('poweredBy') || 'Powered by'}
            <a href="https://megadevs.site" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300 transition-colors duration-300 hover:text-amber-200 hover:underline">
              {t('megaDevs') || 'Mega Devs'}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
