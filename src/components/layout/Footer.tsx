'use client';

import { useTranslations } from 'next-intl';
import { Facebook, Instagram, Phone, MessageCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card/80 backdrop-blur-md border-t border-border/50 py-12 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center gap-8 text-center">
        
        {/* Social Media & Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Phone */}
          <a href="tel:+201000000000" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Phone className="w-5 h-5" />
            <span className="text-sm font-medium">0100 000 0000</span>
          </a>
          
          {/* WhatsApp */}
          <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{t('whatsapp')}</span>
          </a>

          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Facebook className="w-5 h-5" />
          </a>

          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
        </div>

        <div className="w-24 h-px bg-border/80"></div>

        {/* Copyright & Powered By */}
        <div className="flex flex-col gap-2 items-center text-sm text-muted-foreground">
          <p>{t('rights')} &copy; {currentYear}</p>
          <p>
            {t('poweredBy')}{' '}
            <a 
              href="https://megadevs.site" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-bold hover:underline"
            >
              {t('megaDevs')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
