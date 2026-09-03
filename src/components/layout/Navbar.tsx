'use client';

import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingCart, Globe, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from './Logo';

export function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navbar');
  const items = useCartStore((state) => state.items);

  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const switchLocale = (newLocale: string) => {
    router.replace({ pathname }, { locale: newLocale });
  };

  const links = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('shop') },
    { href: '/lab-analysis', label: t('provenance') },
    { href: '/track-order', label: t('track') },
  ] as const;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-500 ${
          scrolled
            ? 'border-b border-amber-200/10 bg-[#0b0705]/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl'
            : 'border-b border-transparent bg-[#0b0705]/40 backdrop-blur-md'
        }`}
      >
        {/* hairline gold glow */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-10">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-amber-100/80 transition-colors hover:bg-white/10 hover:text-amber-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
            <Logo className="h-14 w-44 drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                    active ? 'text-amber-200' : 'text-amber-100/60 hover:text-amber-100'
                  }`}
                >
                  {l.label}
                  <span
                    className={`pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-center bg-gradient-to-r from-amber-400 to-amber-600 transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Language"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-amber-100/80 transition-colors hover:bg-white/10 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50"
              >
                <Globe className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-amber-200/15 bg-[#141009]/95 text-amber-50 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => switchLocale('en')} disabled={locale === 'en'} className="focus:bg-amber-400/15 focus:text-amber-100">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale('ar')} disabled={locale === 'ar'} className="focus:bg-amber-400/15 focus:text-amber-100">
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-amber-100/80 transition-colors hover:bg-white/10 hover:text-amber-100"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[10px] font-bold text-[#2a1608] shadow-[0_0_10px_2px_rgba(245,158,11,0.5)]">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed bottom-0 top-0 z-50 flex w-[78%] max-w-sm flex-col bg-[#0b0705]/95 text-amber-50 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out md:hidden ${
          locale === 'ar' ? 'right-0 border-l border-amber-200/10' : 'left-0 border-r border-amber-200/10'
        } ${isMobileMenuOpen ? 'translate-x-0' : locale === 'ar' ? 'translate-x-full' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-amber-200/10 p-5">
          <Logo className="h-12 w-36" />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-amber-100/70 transition-colors hover:bg-white/10 hover:text-amber-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-6 text-lg font-medium">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  active ? 'bg-amber-400/10 text-amber-200' : 'text-amber-100/70 hover:bg-white/5 hover:text-amber-100'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-amber-400' : 'bg-amber-200/30'}`} />
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 font-semibold text-[#2a1608]"
          >
            <ShoppingCart className="h-5 w-5" />
            {t('cartTitle')}
            {mounted && cartItemCount > 0 && <span className="opacity-80">({cartItemCount})</span>}
          </Link>
        </nav>
      </div>
    </>
  );
}
