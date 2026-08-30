"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButtonProducto({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  function handleAdd() {
    addItem(slug, "producto", cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1800);
  }

  return (
    <>
      <div className="qty-row">
        <div className="qty-select">
          <button type="button" aria-label="Restar" onClick={() => setCantidad((q) => Math.max(1, q - 1))}>−</button>
          <span>{cantidad}</span>
          <button type="button" aria-label="Sumar" onClick={() => setCantidad((q) => q + 1)}>+</button>
        </div>
      </div>
      <button type="button" className="btn btn-solid" onClick={handleAdd}>
        {agregado ? "Agregado ✓" : "Agregar al carrito"}
      </button>
    </>
  );
}

export function AddToCartButtonCombo({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [agregado, setAgregado] = useState(false);

  function handleAdd() {
    addItem(slug, "combo", 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1800);
  }

  return (
    <button type="button" className="btn btn-solid" onClick={handleAdd}>
      {agregado ? "Agregado ✓" : "Agregar el combo al carrito"}
    </button>
  );
}
