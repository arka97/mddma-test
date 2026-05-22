import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  companyId: string;
  companySlug?: string;
  companyName: string;
  variantId?: string | null;
  variantName?: string | null;
  imageUrl?: string | null;
  quantity: string; // freeform e.g. "500 kg"
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: string) => void;
  clear: () => void;
  clearCompany: (companyId: string) => void;
  count: number;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mddma:cart:v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.productId === item.productId && (p.variantId ?? null) === (item.variantId ?? null));
      if (exists) return prev.map((p) => p === exists ? { ...p, quantity: item.quantity || p.quantity } : p);
      return [...prev, item];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string | null) => {
    setItems((prev) => prev.filter((p) => !(p.productId === productId && (p.variantId ?? null) === (variantId ?? null))));
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string | null | undefined, quantity: string) => {
    setItems((prev) => prev.map((p) => p.productId === productId && (p.variantId ?? null) === (variantId ?? null) ? { ...p, quantity } : p));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const clearCompany = useCallback((companyId: string) => setItems((prev) => prev.filter((p) => p.companyId !== companyId)), []);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, clearCompany, count: items.length, isOpen, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
