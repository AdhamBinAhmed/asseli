'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function CartPopup() {
  const { showPopup, popupProduct, setShowPopup } = useCartStore();

  return (
    <AnimatePresence>
      {showPopup && popupProduct && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] max-w-sm w-[calc(100vw-3rem)] bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden"
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Added to Cart</h4>
                  <p className="text-xs text-muted-foreground">{popupProduct.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <img 
                src={popupProduct.image} 
                alt={popupProduct.name} 
                className="w-12 h-12 object-cover rounded-md bg-muted" 
              />
              <Link href="/cart" className="flex-1">
                <Button 
                  className="w-full text-xs h-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setShowPopup(false)}
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
