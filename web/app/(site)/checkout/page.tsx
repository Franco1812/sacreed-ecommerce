"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useCart } from "@/lib/cart-context";
import { formatPrecio } from "@/lib/format";
import { useSitio } from "@/lib/sitio-context";
import { crearPedido } from "./actions";

// Única opción habilitada hoy en el checkout (§ decisión 2026-09-19: se sacaron
// retiro personal y pago en efectivo — quedan solo en pedidos históricos, ver
// app/(site)/pedido/[numero]/page.tsx, que todavía los sabe mostrar).
const METODO_ENTREGA = "ENVIO_DOMICILIO" as const;
const METODO_PAGO = "TRANSFERENCIA" as const;

const CAMPOS_INICIALES = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  dni: "",
  calle: "",
  numeroDom: "",
  piso: "",
  localidad: "",
  provincia: "",
  codigoPostal: "",
  barrioZona: "",
  notas: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, getProducto, getCombo, clear } = useCart();
  const { textos: t, ajustes } = useSitio();
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lineas = useMemo(
    () =>
      items
        .map((item) => {
          const data = item.tipo === "producto" ? getProducto(item.slug) : getCombo(item.slug);
          if (!data) return null;
          return { ...item, nombre: data.nombre, precio: data.precio };
        })
        .filter((l): l is NonNullable<typeof l> => Boolean(l)),
    [items, getProducto, getCombo]
  );

  // Mismo cálculo que hace el servidor al crear el pedido (api/ PedidosService), con los valores que edita Cintia.
  const enZona = ajustes.barriosZona.includes(campos.barrioZona);
  const costoEnvio = subtotal >= ajustes.envioGratisDesde ? 0 : enZona ? ajustes.costoEnvioZona : 0;
  const fueraDeZona = campos.barrioZona !== "" && !enZona;
  const total = subtotal + costoEnvio;

  function campo(nombre: keyof typeof CAMPOS_INICIALES) {
    return {
      value: campos[nombre],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setCampos((c) => ({ ...c, [nombre]: e.target.value })),
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (lineas.length === 0) return;
    setEnviando(true);
    setError(null);

    const resultado = await crearPedido({
      items: items.map(({ slug, tipo, cantidad }) => ({ slug, tipo, cantidad })),
      ...campos,
      barrioZona: campos.barrioZona === "fuera-de-zona" ? "" : campos.barrioZona,
      metodoEntrega: METODO_ENTREGA,
      metodoPago: METODO_PAGO,
    });

    if (!resultado.ok) {
      setError(resultado.error);
      setEnviando(false);
      return;
    }

    clear();
    router.push(`/pedido/${resultado.numero}`);
  }

  if (lineas.length === 0) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Carrito", href: "/carrito" }, { label: "Checkout" }]} />
        <div className="checkout-page">
          <div className="wrap">
            <p>Tu carrito está vacío. <Link href="/comprar-por-beneficio" className="link-all">Ir a la tienda</Link></p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Carrito", href: "/carrito" }, { label: "Checkout" }]} />

      <div className="checkout-page">
        <div className="wrap">
          <h1 className="h-section" style={{ marginBottom: 36 }}>Finalizar compra</h1>

          <form className="checkout-grid" onSubmit={handleSubmit}>
            <div className="checkout-form">
              {error && <div className="checkout-error">{error}</div>}

              <div className="form-section" style={{ borderTop: "none", paddingTop: 0 }}>
                <h2>Tus datos</h2>
                <div className="field-grid">
                  <div className="field"><label htmlFor="nombre">Nombre</label><input id="nombre" required {...campo("nombre")} /></div>
                  <div className="field"><label htmlFor="apellido">Apellido</label><input id="apellido" required {...campo("apellido")} /></div>
                  <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" required {...campo("email")} /></div>
                  <div className="field"><label htmlFor="telefono">Teléfono</label><input id="telefono" type="tel" required {...campo("telefono")} /></div>
                  <div className="field"><label htmlFor="dni">DNI (opcional)</label><input id="dni" {...campo("dni")} /></div>
                </div>
              </div>

              <div className="form-section">
                <h2>Entrega</h2>
                {t["checkout.entrega"] && <p className="field-note" style={{ marginBottom: 20 }}>{t["checkout.entrega"]}</p>}
                <div className="field-grid">
                  <div className="field span-2">
                    <label htmlFor="barrioZona">Barrio (zona de reparto propio)</label>
                    <select id="barrioZona" {...campo("barrioZona")}>
                      <option value="">Elegí tu barrio…</option>
                      {ajustes.barriosZona.map((b) => <option key={b} value={b}>{b}</option>)}
                      <option value="fuera-de-zona">Fuera de esta zona (resto del país)</option>
                    </select>
                  </div>
                  <div className="field"><label htmlFor="calle">Calle</label><input id="calle" required {...campo("calle")} /></div>
                  <div className="field"><label htmlFor="numeroDom">Número</label><input id="numeroDom" required {...campo("numeroDom")} /></div>
                  <div className="field"><label htmlFor="piso">Piso / depto (opcional)</label><input id="piso" {...campo("piso")} /></div>
                  <div className="field"><label htmlFor="localidad">Localidad</label><input id="localidad" required {...campo("localidad")} /></div>
                  <div className="field"><label htmlFor="provincia">Provincia</label><input id="provincia" required {...campo("provincia")} /></div>
                  <div className="field"><label htmlFor="codigoPostal">Código postal</label><input id="codigoPostal" required {...campo("codigoPostal")} /></div>
                </div>
                {fueraDeZona && t["checkout.fuera-de-zona"] && (
                  <p className="field-note" style={{ marginTop: 14 }}>{t["checkout.fuera-de-zona"]}</p>
                )}
              </div>

              <div className="form-section">
                <h2>Pago</h2>
                {t["checkout.pago"] && <p className="field-note">{t["checkout.pago"]}</p>}
                {t["checkout.pago-nota"] && <p className="field-note" style={{ marginTop: 14 }}>{t["checkout.pago-nota"]}</p>}
              </div>

              <div className="form-section">
                <h2>Notas (opcional)</h2>
                <div className="field">
                  <textarea placeholder="Referencias de entrega, aclaraciones, etc." {...campo("notas")} />
                </div>
              </div>

              <button type="submit" className="btn btn-solid" disabled={enviando} style={{ alignSelf: "flex-start" }}>
                {enviando ? "Confirmando…" : "Confirmar pedido"}
              </button>
            </div>

            <aside className="checkout-summary">
              <h3>Tu pedido</h3>
              {lineas.map((l) => (
                <div className="checkout-summary-item" key={`${l.tipo}-${l.slug}`}>
                  <span>{l.nombre} × {l.cantidad}</span>
                  <span>{formatPrecio(l.precio * l.cantidad)}</span>
                </div>
              ))}
              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>{formatPrecio(subtotal)}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Envío</span>
                <span>{costoEnvio === 0 ? "Sin cargo" : formatPrecio(costoEnvio)}</span>
              </div>
              <div className="checkout-summary-total">
                <span>Total</span>
                <span>{formatPrecio(total)}</span>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </>
  );
}
