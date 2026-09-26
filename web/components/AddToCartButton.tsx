"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icons";
import { useCart } from "@/lib/cart-context";
import { formatPrecio } from "@/lib/format";

/**
 * Selector de cantidad + botón negro a ancho completo. En mobile, cuando el botón
 * sale de pantalla al hacer scroll, aparece una barra fija abajo con el mismo botón.
 */
export function AddToCartButtonProducto({ slug, nombre, precio }: { slug: string; nombre: string; precio: number }) {
  const { addItem } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [barra, setBarra] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = boton.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setBarra(!e.isIntersecting && e.boundingClientRect.top < 0));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const agregar = () => addItem(slug, "producto", cantidad);

  return (
    <>
      <div className="buy-row">
        <div className="qty-select">
          <button type="button" aria-label="Restar" onClick={() => setCantidad((q) => Math.max(1, q - 1))}>
            <Icon name="minus" size={16} />
          </button>
          <span>{cantidad}</span>
          <button type="button" aria-label="Sumar" onClick={() => setCantidad((q) => q + 1)}>
            <Icon name="plus" size={16} />
          </button>
        </div>
        <button type="button" className="btn btn-solid" ref={boton} onClick={agregar}>
          Agregar al carrito
        </button>
      </div>

      <div className={`pdp-sticky-bar${barra ? " on" : ""}`} aria-hidden={!barra}>
        <div>
          <strong>{nombre}</strong>
          <span>{formatPrecio(precio)}</span>
        </div>
        <button type="button" className="btn btn-solid" tabIndex={barra ? 0 : -1} onClick={agregar}>
          Agregar al carrito
        </button>
      </div>
    </>
  );
}

export function AddToCartButtonCombo({ slug }: { slug: string }) {
  const { addItem } = useCart();
  return (
    <button type="button" className="btn btn-solid" onClick={() => addItem(slug, "combo", 1)}>
      Agregar el combo al carrito
    </button>
  );
}

/** Botón chico "Agregar" de las filas "Combinalo con" de la ficha. */
export function AgregarMini({ slug, tipo }: { slug: string; tipo: "producto" | "combo" }) {
  const { addItem } = useCart();
  return (
    <button type="button" className="btn btn-solid btn-small" onClick={() => addItem(slug, tipo, 1)}>
      Agregar
    </button>
  );
}
