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
  /** Panel lateral del carrito (se abre solo al agregar algo). */
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
  /** Catálogo completo, para las sugerencias "Completalo con". */
  productos: Producto[];
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
  const [abierto, setAbierto] = useState(false);
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // Carritos viejos pueden tener combos como ítem propio: los abrimos en sus productos.
        const guardados: CartItem[] = JSON.parse(raw);
        const abiertos = guardados.flatMap((i) =>
          i.tipo === "combo"
            ? (combos.find((c) => c.slug === i.slug)?.productos ?? []).map((s) => ({ slug: s, tipo: "producto" as const, cantidad: i.cantidad }))
            : [i]
        );
        const unidos = abiertos.reduce<CartItem[]>((acc, i) => {
          const e = acc.find((x) => x.slug === i.slug);
          if (e) e.cantidad += i.cantidad;
          else acc.push({ ...i });
          return acc;
        }, []);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage doesn't exist during SSR; this mount-only effect hydrates client state from it without a hydration mismatch (SSR/first paint render an empty cart on purpose)
        setItems(unidos);
      }
    } catch {
      // localStorage puede fallar (modo privado, etc.) — arrancamos con carrito vacío
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar; `combos` viene del server y no cambia
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // idem
    }
  }, [items, hydrated]);

  /** Slugs de los productos del combo que hoy tienen stock (los faltantes se omiten). */
  const productosDisponibles = useCallback(
    (comboSlug: string) =>
      (combos.find((c) => c.slug === comboSlug)?.productos ?? []).filter((s) => (productos.find((p) => p.slug === s)?.stock ?? 0) > 0),
    [combos, productos]
  );

  const addItem = useCallback(
    (slug: string, tipo: "producto" | "combo", cantidad = 1) => {
      // Un combo no entra como ítem propio: se agregan sus productos con stock, cada uno suelto.
      const aAgregar = tipo === "combo" ? productosDisponibles(slug) : [slug];
      if (aAgregar.length === 0) return;
      setAbierto(true);
      setItems((prev) => {
        let next = prev;
        for (const s of aAgregar) {
          const existe = next.some((i) => i.slug === s && i.tipo === "producto");
          next = existe
            ? next.map((i) => (i.slug === s && i.tipo === "producto" ? { ...i, cantidad: i.cantidad + cantidad } : i))
            : [...next, { slug: s, tipo: "producto", cantidad }];
        }
        return next;
      });
    },
    [productosDisponibles]
  );

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
    () => ({ items, addItem, removeItem, setQty, clear, abierto, abrir, cerrar, productos, totalItems, subtotal, getProducto, getCombo }),
    [items, addItem, removeItem, setQty, clear, abierto, abrir, cerrar, productos, totalItems, subtotal, getProducto, getCombo]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
