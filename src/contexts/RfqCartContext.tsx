import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

const STORAGE_KEY = "mddma:rfq:cart:v1";

export interface RfqCartItem {
  cartId: string;
  productName: string;
  productId: string | null;
  companyId: string | null;
  sellerSlug: string | null;
  sellerName: string;
  origin?: string | null;
  moq?: string | null;
  variant?: string | null;
  addedAt: string;
}

interface RfqCartValue {
  items: RfqCartItem[];
  add: (item: Omit<RfqCartItem, "cartId" | "addedAt">) => void;
  remove: (cartId: string) => void;
  clear: () => void;
  // True if a matching product (by productId, falling back to productName+sellerName) is present
  isInCart: (productId: string | null | undefined, productName: string, sellerName: string) => boolean;
  // Returns matching cartId if present, else null
  findCartId: (productId: string | null | undefined, productName: string, sellerName: string) => string | null;
}

const RfqCartContext = createContext<RfqCartValue | undefined>(undefined);

const sameItem = (a: { productId?: string | null; productName: string; sellerName: string }, b: RfqCartItem) => {
  if (a.productId && b.productId && a.productId === b.productId) return true;
  return !a.productId && !b.productId && a.productName === b.productName && a.sellerName === b.sellerName;
};

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function RfqCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RfqCartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as RfqCartItem[];
      }
    } catch { /* ignore */ }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  const add = useCallback((item: Omit<RfqCartItem, "cartId" | "addedAt">) => {
    setItems((prev) => {
      if (prev.some((p) => sameItem(item, p))) return prev;
      const next: RfqCartItem = { ...item, cartId: uid(), addedAt: new Date().toISOString() };
      return [...prev, next];
    });
  }, []);

  const remove = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((p) => p.cartId !== cartId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (productId: string | null | undefined, productName: string, sellerName: string) =>
      items.some((p) => sameItem({ productId: productId ?? null, productName, sellerName }, p)),
    [items],
  );

  const findCartId = useCallback(
    (productId: string | null | undefined, productName: string, sellerName: string) => {
      const found = items.find((p) => sameItem({ productId: productId ?? null, productName, sellerName }, p));
      return found?.cartId ?? null;
    },
    [items],
  );

  const value = useMemo<RfqCartValue>(
    () => ({ items, add, remove, clear, isInCart, findCartId }),
    [items, add, remove, clear, isInCart, findCartId],
  );

  return <RfqCartContext.Provider value={value}>{children}</RfqCartContext.Provider>;
}

export function useRfqCart() {
  const ctx = useContext(RfqCartContext);
  if (!ctx) throw new Error("useRfqCart must be used within RfqCartProvider");
  return ctx;
}
