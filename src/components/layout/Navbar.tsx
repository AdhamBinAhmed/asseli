'use client';

import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingCart, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navbar');
  const items = useCartStore((state) => state.items);
  
  // Prevent hydration mismatch for zustand store
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const switchLocale = (newLocale: string) => {
    router.replace({ pathname }, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/40 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-widest text-primary uppercase">Asseli</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">{t('home')}</Link>
          <Link href="/products" className="transition-colors hover:text-foreground">{t('shop')}</Link>
          <Link href="/lab-analysis" className="transition-colors hover:text-foreground">{t('provenance')}</Link>
          <Link href="/track-order" className="transition-colors hover:text-foreground">{t('track')}</Link>
        </nav>

        {/* Right Section (Lang & Cart) */}
        <div className="flex items-center gap-2">
          
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label="Language Switcher">
              <Globe className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLocale('en')} disabled={locale === 'en'}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale('ar')} disabled={locale === 'ar'}>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label="Open Cart">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-md transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[75%] max-w-sm bg-white/95 backdrop-blur-xl text-black border-r border-black/10 shadow-[20px_0_40px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-black/10">
          <span className="text-2xl font-bold tracking-widest text-amber-500 uppercase">Asseli</span>
          <Button variant="ghost" size="icon" className="text-black hover:bg-black/5 hover:text-black rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col gap-6 p-8 text-xl font-medium">
          <Link href="/" className="transition-colors text-black/70 hover:text-amber-500">{t('home')}</Link>
          <Link href="/products" className="transition-colors text-black/70 hover:text-amber-500">{t('shop')}</Link>
          <Link href="/lab-analysis" className="transition-colors text-black/70 hover:text-amber-500">{t('provenance')}</Link>
          <Link href="/track-order" className="transition-colors text-black/70 hover:text-amber-500">{t('track')}</Link>
        </div>
      </div>
    </header>
  );
}
