"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Icon from "@/components/Icons";
import { useCart } from "@/lib/cart-context";
import { formatPrecio } from "@/lib/format";
import { ENVIO_GRATIS_ZONA_MOCK } from "@/lib/mock-data";

/**
 * Carrito como panel lateral que se desliza desde la derecha (no es una página aparte).
 * Se abre al tocar el ícono del header o al agregar un producto.
 */
export default function CartDrawer() {
  const { abierto, cerrar, items, setQty, removeItem, addItem, subtotal, productos, getProducto, getCombo } = useCart();
  const botonCerrar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    document.addEventListener("keydown", alTeclear);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    botonCerrar.current?.focus();
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = overflowPrevio;
    };
  }, [abierto, cerrar]);

  if (!abierto) return null;

  const falta = Math.max(0, ENVIO_GRATIS_ZONA_MOCK - subtotal);
  const progreso = Math.min(100, (subtotal / ENVIO_GRATIS_ZONA_MOCK) * 100);
  const enCarrito = new Set(items.filter((i) => i.tipo === "producto").map((i) => i.slug));
  const sugeridos = productos
    .filter((p) => !enCarrito.has(p.slug))
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 2);

  return (
    <div className="drawer-root">
      <div className="drawer-overlay" onClick={cerrar} aria-hidden="true"></div>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Carrito">
        <div className="drawer-head">
          <h2>Tu carrito</h2>
          <button type="button" className="drawer-close" ref={botonCerrar} onClick={cerrar} aria-label="Cerrar carrito">
            <Icon name="close" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Todavía no agregaste nada. Es un buen momento para armar tu ritual.</p>
            <Link href="/comprar-por-beneficio" className="btn btn-solid" onClick={cerrar}>Ir a la tienda</Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              <div className="shipping-progress">
                <span>
                  {falta > 0
                    ? `Te faltan ${formatPrecio(falta)} para el envío sin cargo en tu zona.`
                    : "Listo: tu envío en zona es sin cargo."}
                </span>
                <div className="shipping-progress-bar">
                  <div className="shipping-progress-fill" style={{ width: `${progreso}%` }} />
                </div>
              </div>

              <ul className="drawer-items">
                {items.map((item) => {
                  const data = item.tipo === "producto" ? getProducto(item.slug) : getCombo(item.slug);
                  if (!data) return null;
                  const foto = data.imagenes?.[0];
                  const href = item.tipo === "producto" ? `/producto/${item.slug}` : `/combos/${item.slug}`;
                  return (
                    <li className="drawer-item" key={`${item.tipo}-${item.slug}`}>
                      <Link href={href} className="drawer-item-media" onClick={cerrar} tabIndex={-1} aria-hidden="true">
                        {foto && <Image src={foto.url} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />}
                      </Link>
                      <div className="drawer-item-info">
                        <Link href={href} className="drawer-item-name" onClick={cerrar}>{data.nombre}</Link>
                        <span className="price">{formatPrecio(data.precio * item.cantidad)}</span>
                        <div className="drawer-item-actions">
                          <div className="qty-select qty-small">
                            <button type="button" aria-label="Restar" onClick={() => setQty(item.slug, item.tipo, item.cantidad - 1)}>
                              <Icon name="minus" size={14} />
                            </button>
                            <span>{item.cantidad}</span>
                            <button type="button" aria-label="Sumar" onClick={() => setQty(item.slug, item.tipo, item.cantidad + 1)}>
                              <Icon name="plus" size={14} />
                            </button>
                          </div>
                          <button type="button" className="cart-item-remove" onClick={() => removeItem(item.slug, item.tipo)}>
                            Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {sugeridos.length > 0 && (
                <div className="drawer-suggest">
                  <h3>Completalo con</h3>
                  <ul>
                    {sugeridos.map((p) => {
                      const foto = p.imagenes?.[0];
                      return (
                        <li className="drawer-item" key={p.slug}>
                          <Link href={`/producto/${p.slug}`} className="drawer-item-media" onClick={cerrar} tabIndex={-1} aria-hidden="true">
                            {foto && <Image src={foto.url} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />}
                          </Link>
                          <div className="drawer-item-info">
                            <Link href={`/producto/${p.slug}`} className="drawer-item-name" onClick={cerrar}>{p.nombre}</Link>
                            <span className="price">{formatPrecio(p.precio)}</span>
                            <button type="button" className="btn btn-ghost btn-small" onClick={() => addItem(p.slug, "producto", 1)}>
                              Agregar
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="drawer-foot">
              <div className="drawer-total">
                <span>Subtotal</span>
                <span>{formatPrecio(subtotal)}</span>
              </div>
              <Link href="/checkout" className="btn btn-solid" onClick={cerrar}>Finalizar compra</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
