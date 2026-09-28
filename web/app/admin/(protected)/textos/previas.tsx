"use client";

/**
 * Vistas previas de cada grupo de textos del registro: una versión chica de cómo se ve esa parte
 * del sitio. No usan el CSS del storefront (el admin tiene su propio layout), así que imitan
 * lo esencial con las clases `pv-*` de admin.css. Si cambia el diseño del sitio, ajustar acá.
 */
import { useEffect, useState, type ComponentType } from "react";
import Icon, { type IconName } from "@/components/Icons";
import { formatPrecio } from "@/lib/format";
import type { CtxPrevia } from "./editor-comun";

const lleno = (s: string) => s.trim() !== "";

function Nada({ children }: { children: string }) {
  return <p className="pv-nada">{children}</p>;
}

function Anuncios({ v }: CtxPrevia) {
  const mensajes = [1, 2, 3, 4, 5].map((n) => v(`anuncio.${n}`)).filter(lleno);
  const [i, setI] = useState(0);

  // Rota como en el sitio (allá cada 5 s; acá un poco más rápido para verlos todos).
  useEffect(() => {
    if (mensajes.length < 2) return;
    const id = setInterval(() => setI((n) => n + 1), 2500);
    return () => clearInterval(id);
  }, [mensajes.length]);

  if (mensajes.length === 0) return <Nada>Sin mensajes: la barra no se muestra.</Nada>;
  const actual = i % mensajes.length;
  return (
    <div className="pv">
      <div className="pv-ticker">{mensajes[actual]}</div>
      <div className="pv-navbar"><span>☰</span><strong>SACRED</strong><span>⌕ ◯</span></div>
      <ol className="pv-rotacion">
        {mensajes.map((m, k) => (
          <li key={k} data-activo={k === actual}>{m}</li>
        ))}
      </ol>
      <p className="pv-nota">Se muestra uno por vez, cambian solos cada 5 segundos.</p>
    </div>
  );
}

const ICONOS_FRANJA: IconName[] = ["pin", "leaf", "sparkle", "clock", "drop", "check"];

function Franja({ v }: CtxPrevia) {
  const items = ICONOS_FRANJA.map((icono, i) => ({ icono, texto: v(`franja.${i + 1}`) })).filter((a) => lleno(a.texto));
  if (items.length === 0) return <Nada>Sin renglones: la franja no se muestra.</Nada>;
  return (
    <div className="pv">
      <div className="pv-franja">
        {items.map((a, i) => (
          <span key={i}><Icon name={a.icono} size={16} />{a.texto}</span>
        ))}
      </div>
      <p className="pv-nota">En el sitio la cinta se desplaza sola, de derecha a izquierda.</p>
    </div>
  );
}

function Pilares({ v }: CtxPrevia) {
  const pilares = [1, 2, 3]
    .map((n) => ({ titulo: v(`home.pilar.${n}.titulo`), texto: v(`home.pilar.${n}.texto`), foto: v(`home.pilar.${n}.foto`) }))
    .filter((p) => lleno(p.titulo) || lleno(p.texto));
  return (
    <div className="pv pv-band pv-centro">
      <h4 className="pv-h">{v("home.pilares.titulo")}</h4>
      <p className="pv-p">{v("home.pilares.texto")}</p>
      {lleno(v("home.pilares.boton")) && <span className="pv-btn pv-btn-ghost">{v("home.pilares.boton")}</span>}
      <div className="pv-pilares">
        {pilares.map((p, i) => (
          <div key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de admin */}
            {p.foto && <img src={p.foto} alt="" />}
            <strong>{p.titulo}</strong>
            <p className="pv-mono">{p.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CombosHome({ v }: CtxPrevia) {
  return (
    <div className="pv">
      <div className="pv-head">
        <h4 className="pv-h">{v("home.combos.titulo")}</h4>
        <span className="pv-link">Ver todo</span>
      </div>
      <div className="pv-cards">
        {[1, 2, 3].map((n) => (
          <div key={n} className="pv-card"><div className="pv-card-foto" /><span>Combo {n}</span></div>
        ))}
      </div>
      <p className="pv-nota">Los combos que se muestran son los que cargás en «Combos».</p>
    </div>
  );
}

function Banner({ v }: CtxPrevia) {
  const foto = v("home.banner.foto");
  return (
    <div className="pv">
      <div className="pv-banner" style={foto ? { backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${foto})` } : undefined}>
        <h4 className="pv-h">{v("home.banner.titulo")}</h4>
        <p className="pv-p">{v("home.banner.texto")}</p>
        {lleno(v("home.banner.boton")) && <span className="pv-btn pv-btn-outline">{v("home.banner.boton")}</span>}
      </div>
    </div>
  );
}

function Pie({ v, lineas }: CtxPrevia) {
  return (
    <div className="pv pv-pie">
      <div className="pv-pie-grid">
        <div>
          <span className="pv-logo">SACRED</span>
          <h4 className="pv-h">{v("pie.titulo")}</h4>
          <p className="pv-p pv-suave">{v("pie.bajada")}</p>
          <div className="pv-news"><span>tu@email.com</span><b>{v("pie.boton")}</b></div>
        </div>
        <div className="pv-pie-cols">
          <div><b>Comprar</b>{(lineas ?? []).map((l) => <span key={l}>{l}</span>)}</div>
          <div><b>Marca</b><span>Nuestro Origen</span><span>Contacto</span></div>
          <div><b>Ayuda</b><span>Envíos</span><span>Cambios</span></div>
        </div>
      </div>
      {lleno(v("pie.legal")) && <p className="pv-legal">{v("pie.legal")}</p>}
      <div className="pv-pie-bottom"><span>{v("pie.copyright")}</span><span>{v("pie.linea")}</span></div>
    </div>
  );
}

function Ficha({ v }: CtxPrevia) {
  const opciones = [1, 2, 3].map((n) => v(`ficha.opciones.${n}`)).filter(lleno);
  const confianza: [IconName, string][] = [
    ["truck", v("ficha.confianza.1")],
    ["card", v("ficha.confianza.2")],
    ["refresh", v("ficha.confianza.3")],
  ];
  return (
    <div className="pv">
      <span className="pv-tag">Línea del producto</span>
      <h4 className="pv-h">Nombre del producto</h4>
      <p className="pv-precio">$00.000</p>
      {(lleno(v("ficha.opciones.titulo")) || opciones.length > 0) && (
        <div className="pv-opciones">
          {lleno(v("ficha.opciones.titulo")) && <div className="pv-opciones-head">{v("ficha.opciones.titulo")}</div>}
          <ul>
            {opciones.map((o, i) => <li key={i}><Icon name="check" size={13} />{o}</li>)}
          </ul>
        </div>
      )}
      <span className="pv-btn pv-btn-solid pv-ancho">Agregar al carrito</span>
      <p className="pv-stock">{v("ficha.pocas-unidades")} <em>(solo si quedan pocas)</em></p>
      <ul className="pv-confianza">
        {confianza.filter(([, t]) => lleno(t)).map(([icono, t]) => <li key={icono}><Icon name={icono} size={18} />{t}</li>)}
      </ul>
      <div className="pv-separador">Más abajo en la ficha</div>
      <p className="pv-sub">{v("ficha.combinalo")}</p>
      <p className="pv-sub">{v("ficha.misma-linea")}</p>
    </div>
  );
}

function Combos({ v }: CtxPrevia) {
  return (
    <div className="pv-pila">
      <div className="pv">
        <span className="pv-marco">Lista de combos</span>
        <h4 className="pv-h">{v("combos.titulo")}</h4>
        <p className="pv-p">{v("combos.intro")}</p>
      </div>
      <div className="pv">
        <span className="pv-marco">Página de cada combo</span>
        <h4 className="pv-h">Nombre del combo</h4>
        <p className="pv-precio">$00.000</p>
        <span className="pv-btn pv-btn-solid pv-ancho">Agregar al carrito</span>
        {lleno(v("combo.envio")) && <p className="pv-mono pv-chico">{v("combo.envio")}</p>}
        <p className="pv-sub">{v("combo.porque")}</p>
        <p className="pv-sub">{v("combo.piezas")}</p>
      </div>
    </div>
  );
}

function Rituales({ v }: CtxPrevia) {
  return (
    <div className="pv">
      <h4 className="pv-h">{v("rituales.titulo")}</h4>
      <p className="pv-p">{v("rituales.intro")}</p>
      <div className="pv-rituales">
        <div><strong>☀ {v("ritual.am.titulo")}</strong><p className="pv-p">{v("ritual.am.texto")}</p></div>
        <div><strong>☾ {v("ritual.pm.titulo")}</strong><p className="pv-p">{v("ritual.pm.texto")}</p></div>
      </div>
    </div>
  );
}

/** Barra de "te faltan $X para el envío gratis" del carrito, con un monto de ejemplo. */
function ProgresoEnvio({ v, ajustes }: CtxPrevia) {
  const falta = Math.round((ajustes.envioGratis * 0.25) / 100) * 100;
  return (
    <>
      <div className="pv-progreso">
        <span>{v("carrito.falta").replaceAll("{falta}", formatPrecio(falta))}</span>
        <div><i style={{ width: "75%" }} /></div>
      </div>
      <div className="pv-progreso">
        <span>{v("carrito.listo")}</span>
        <div><i style={{ width: "100%" }} /></div>
      </div>
    </>
  );
}

function Carrito(ctx: CtxPrevia) {
  const { v } = ctx;
  return (
    <div className="pv-pila">
      <div className="pv">
        <div className="pv-drawer-head"><strong>Tu carrito</strong><span>✕</span></div>
        <p className="pv-nota">Con productos (ejemplo: le faltan unos pesos para el envío gratis, y cuando ya llegó):</p>
        <ProgresoEnvio {...ctx} />
        <div className="pv-item"><div className="pv-card-foto" /><span>Producto de ejemplo</span></div>
        <p className="pv-sub">{v("carrito.sugeridos")}</p>
      </div>
      <div className="pv pv-centro">
        <span className="pv-marco">Carrito vacío</span>
        <p className="pv-p">{v("carrito.vacio")}</p>
        <span className="pv-btn pv-btn-solid">Ir a la tienda</span>
      </div>
    </div>
  );
}

function Barrios({ v }: CtxPrevia) {
  const barrios = v("envio.barrios").split("\n").map((b) => b.trim()).filter(Boolean);
  return (
    <div className="pv-select">
      <span>Barrio (zona de reparto propio)</span>
      <ul>
        <li className="pv-suave">Elegí tu barrio…</li>
        {barrios.map((b) => <li key={b}>{b}</li>)}
        <li className="pv-suave">Fuera de esta zona (resto del país)</li>
      </ul>
    </div>
  );
}

function Checkout(ctx: CtxPrevia) {
  const { v } = ctx;
  return (
    <div className="pv">
      <h4 className="pv-h">Finalizar compra</h4>
      <div className="pv-seccion">
        <b>Entrega</b>
        {lleno(v("checkout.entrega")) && <p className="pv-nota-campo">{v("checkout.entrega")}</p>}
        <Barrios {...ctx} />
        {lleno(v("checkout.fuera-de-zona")) && (
          <p className="pv-nota-campo"><em>Si elige «fuera de esta zona»:</em> {v("checkout.fuera-de-zona")}</p>
        )}
      </div>
      <div className="pv-seccion">
        <b>Pago</b>
        {lleno(v("checkout.pago")) && <p className="pv-nota-campo">{v("checkout.pago")}</p>}
        {lleno(v("checkout.pago-nota")) && <p className="pv-nota-campo">{v("checkout.pago-nota")}</p>}
      </div>
    </div>
  );
}

const DATOS_CUENTA: [string, string][] = [
  ["Titular", "pago.titular"],
  ["Banco", "pago.banco"],
  ["CBU / CVU", "pago.cbu"],
  ["Alias", "pago.alias"],
  ["CUIT / CUIL", "pago.cuit"],
];

function PedidoConfirmado({ v }: CtxPrevia) {
  const datos = DATOS_CUENTA.map(([etiqueta, clave]) => [etiqueta, v(clave)]).filter(([, valor]) => lleno(valor));
  return (
    <div className="pv">
      <span className="pv-marco">Pedido #1024 · Pendiente de pago</span>
      <h4 className="pv-h">Gracias, María.</h4>
      {lleno(v("pedido.gracias")) && <p className="pv-p">{v("pedido.gracias")}</p>}
      <div className="pv-seccion">
        <b>Cómo pagar</b>
        {datos.length > 0 ? (
          <>
            <p className="pv-p">Transferí el total ($00.000) a esta cuenta:</p>
            <ul className="pv-cuenta">
              {datos.map(([etiqueta, valor]) => <li key={etiqueta}><span>{etiqueta}</span><strong>{valor}</strong></li>)}
            </ul>
            {lleno(v("pago.instrucciones")) && <p className="pv-p">{v("pago.instrucciones")}</p>}
          </>
        ) : (
          <p className="pv-p">{v("pedido.sin-datos")}</p>
        )}
      </div>
    </div>
  );
}

function Envio(ctx: CtxPrevia) {
  const { ajustes } = ctx;
  return (
    <div className="pv-pila">
      <div className="pv">
        <span className="pv-marco">Lo que se cobra en la zona</span>
        <ul className="pv-cuenta">
          <li><span>Compra de menos de {formatPrecio(ajustes.envioGratis)}</span><strong>Envío {formatPrecio(ajustes.costoEnvio)}</strong></li>
          <li><span>Compra de {formatPrecio(ajustes.envioGratis)} o más</span><strong>Envío sin cargo</strong></li>
        </ul>
      </div>
      <div className="pv">
        <span className="pv-marco">En el carrito</span>
        <ProgresoEnvio {...ctx} />
      </div>
      <div className="pv">
        <span className="pv-marco">Al finalizar la compra</span>
        <Barrios {...ctx} />
      </div>
    </div>
  );
}

/** Vista previa de cada grupo del registro, por id de grupo. Un grupo sin entrada se edita sin vista previa. */
export const PREVIAS: Record<string, { titulo: string; Componente: ComponentType<CtxPrevia> }> = {
  anuncios: { titulo: "Así se ve arriba de todo el sitio", Componente: Anuncios },
  franja: { titulo: "Así se ve la franja", Componente: Franja },
  pilares: { titulo: "Así se ve en la portada", Componente: Pilares },
  "combos-home": { titulo: "Así se ve en la portada", Componente: CombosHome },
  banner: { titulo: "Así se ve en la portada", Componente: Banner },
  pie: { titulo: "Así se ve al final de cada página", Componente: Pie },
  ficha: { titulo: "Así se ve en la ficha de un producto", Componente: Ficha },
  combos: { titulo: "Así se ve en las páginas de combos", Componente: Combos },
  rituales: { titulo: "Así se ve en «Rituales AM / PM»", Componente: Rituales },
  carrito: { titulo: "Así se ve el carrito", Componente: Carrito },
  checkout: { titulo: "Así se ve al finalizar la compra", Componente: Checkout },
  pedido: { titulo: "Así se ve el pedido confirmado", Componente: PedidoConfirmado },
  envio: { titulo: "Así se aplica en el sitio", Componente: Envio },
  pago: { titulo: "Así lo ve quien compra", Componente: PedidoConfirmado },
};
