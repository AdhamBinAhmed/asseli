'use client';

import { useTranslations } from 'next-intl';
import { Phone } from 'lucide-react';
import { Link } from '@/i18n/routing';

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
            <WhatsappIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('whatsapp')}</span>
          </a>

          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <FacebookIcon className="w-5 h-5" />
          </a>

          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <InstagramIcon className="w-5 h-5" />
          </a>
        </div>

        <div className="w-24 h-px bg-border/80"></div>

        {/* Copyright & Powered By */}
        <div className="flex flex-col gap-2 items-center text-sm text-muted-foreground" dir="ltr">
          <p>All rights reserved to Asseli & Mega Devs &copy; {currentYear}</p>
          <p>
            Powered by{' '}
            <a 
              href="https://megadevs.site" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-bold hover:underline"
            >
              Mega Devs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
