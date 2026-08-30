"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Combo, Producto } from "./types";

export interface CartItem {
  slug: string;
  tipo: "producto" | "combo";
  cantidad: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (slug: string, tipo: "producto" | "combo", cantidad?: number) => void;
  removeItem: (slug: string, tipo: "producto" | "combo") => void;
  setQty: (slug: string, tipo: "producto" | "combo", cantidad: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
  getProducto: (slug: string) => Producto | undefined;
  getCombo: (slug: string) => Combo | undefined;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sacred-cart-mock";

export function CartProvider({
  children,
  productos,
  combos,
}: {
  children: ReactNode;
  /** Catálogo cargado server-side (ver app/layout.tsx) — evita que este componente cliente tenga que pegarle a la base directo. */
  productos: Producto[];
  combos: Combo[];
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage doesn't exist during SSR; this mount-only effect hydrates client state from it without a hydration mismatch (SSR/first paint render an empty cart on purpose)
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage puede fallar (modo privado, etc.) — arrancamos con carrito vacío
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // idem
    }
  }, [items, hydrated]);

  const addItem = useCallback((slug: string, tipo: "producto" | "combo", cantidad = 1) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.slug === slug && i.tipo === tipo);
      if (existe) {
        return prev.map((i) => (i.slug === slug && i.tipo === tipo ? { ...i, cantidad: i.cantidad + cantidad } : i));
      }
      return [...prev, { slug, tipo, cantidad }];
    });
  }, []);

  const removeItem = useCallback((slug: string, tipo: "producto" | "combo") => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.tipo === tipo)));
  }, []);

  const setQty = useCallback((slug: string, tipo: "producto" | "combo", cantidad: number) => {
    setItems((prev) => {
      if (cantidad <= 0) return prev.filter((i) => !(i.slug === slug && i.tipo === tipo));
      return prev.map((i) => (i.slug === slug && i.tipo === tipo ? { ...i, cantidad } : i));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const getProducto = useCallback((slug: string) => productos.find((p) => p.slug === slug), [productos]);
  const getCombo = useCallback((slug: string) => combos.find((c) => c.slug === slug), [combos]);

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, i) => {
      const precio = i.tipo === "producto" ? getProducto(i.slug)?.precio : getCombo(i.slug)?.precio;
      return acc + (precio ?? 0) * i.cantidad;
    }, 0);
  }, [items, getProducto, getCombo]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQty, clear, totalItems, subtotal, getProducto, getCombo }),
    [items, addItem, removeItem, setQty, clear, totalItems, subtotal, getProducto, getCombo]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
