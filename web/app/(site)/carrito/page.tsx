"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useCart } from "@/lib/cart-context";
import { formatPrecio } from "@/lib/format";
import { useSitio } from "@/lib/sitio-context";

export default function CarritoPage() {
  const { items, setQty, removeItem, subtotal, getProducto, getCombo } = useCart();
  const { textos: t, ajustes } = useSitio();

  const falta = Math.max(0, ajustes.envioGratisDesde - subtotal);
  const progreso = ajustes.envioGratisDesde > 0 ? Math.min(100, (subtotal / ajustes.envioGratisDesde) * 100) : 100;

  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Carrito" }]} />

      <div className="cart-page">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h1 className="h-section">Tu carrito</h1>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="cart-empty">
              <p>{t["carrito.vacio"]}</p>
              <Link href="/comprar-por-beneficio" className="btn btn-solid">Ir a la tienda</Link>
            </div>
          ) : (
            <div className="cart-grid">
              <div className="cart-list">
                {items.map((item) => {
                  const data = item.tipo === "producto" ? getProducto(item.slug) : getCombo(item.slug);
                  if (!data) return null;
                  const foto = data.imagenes?.[0];
                  return (
                    <div className="cart-item" key={`${item.tipo}-${item.slug}`}>
                      <div className="cart-item-media" style={{ position: "relative" }}>{foto && <Image src={foto.url} alt="" fill sizes="76px" style={{ objectFit: "cover" }} />}</div>
                      <div>
                        <span className="cart-item-tag">{item.tipo === "combo" ? "Combo sinérgico" : "Producto"}</span>
                        <Link
                          href={item.tipo === "producto" ? `/producto/${item.slug}` : `/combos/${item.slug}`}
                          className="cart-item-name"
                        >
                          {data.nombre}
                        </Link>
                      </div>
                      <div className="qty-select">
                        <button type="button" aria-label="Restar" onClick={() => setQty(item.slug, item.tipo, item.cantidad - 1)}>−</button>
                        <span>{item.cantidad}</span>
                        <button type="button" aria-label="Sumar" onClick={() => setQty(item.slug, item.tipo, item.cantidad + 1)}>+</button>
                      </div>
                      <span className="price">{formatPrecio(data.precio * item.cantidad)}</span>
                      <button type="button" className="cart-item-remove" onClick={() => removeItem(item.slug, item.tipo)}>
                        Quitar
                      </button>
                    </div>
                  );
                })}
              </div>

              <aside className="cart-summary">
                <h3>Resumen</h3>
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrecio(subtotal)}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>{formatPrecio(subtotal)}</span>
                </div>

                <div className="shipping-progress">
                  <span>{falta > 0 ? t["carrito.falta"].replaceAll("{falta}", formatPrecio(falta)) : t["carrito.listo"]}</span>
                  <div className="shipping-progress-bar">
                    <div className="shipping-progress-fill" style={{ width: `${progreso}%` }} />
                  </div>
                </div>

                <div className="cart-actions">
                  <Link href="/comprar-por-beneficio" className="btn btn-ghost">Seguir comprando</Link>
                  <Link href="/checkout" className="btn btn-solid" style={{ textAlign: "center" }}>Finalizar compra</Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
