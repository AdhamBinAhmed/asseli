import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: string;
  weight: string;
  batch: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  showPopup: boolean;
  popupProduct: Product | null;
  setShowPopup: (show: boolean, product?: Product) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  showPopup: false,
  popupProduct: null,
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { 
        items: [...state.items, { ...product, quantity: 1 }] 
      };
    });
    set({ showPopup: true, popupProduct: product });
    
    // Auto-hide popup after 5 seconds
    setTimeout(() => {
      set((state) => {
        if (state.popupProduct?.id === product.id) {
          return { showPopup: false };
        }
        return state;
      });
    }, 5000);
  },
  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  setShowPopup: (show, product) => set({ showPopup: show, ...(product ? { popupProduct: product } : {}) }),
}));
