import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ComboCard from "@/components/ComboCard";
import PdpBlock from "@/components/PdpBlock";
import { AddToCartButtonProducto } from "@/components/AddToCartButton";
import { getLineas } from "@/lib/data";
import { combosParaProducto, getProducto, relacionadosMismaLinea } from "@/lib/helpers";
import { formatPrecio, ritualLabel } from "@/lib/format";

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProducto(slug);
  if (!p) notFound();

  const [combos, relacionados, lineas] = await Promise.all([
    combosParaProducto(slug),
    relacionadosMismaLinea(slug, 4),
    getLineas(),
  ]);
  // La API garantiza una fila por cada valor del enum, así que el find siempre
  // encuentra; el fallback es sólo para no romper tipos.
  const lineaNombre = lineas.find((l) => l.slug === p.linea)?.nombre ?? "";
  const stockBajo = p.stock <= 15;
  const fotos = p.imagenes ?? [];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: lineaNombre, href: `/comprar-por-beneficio/${p.linea}` },
          { label: p.nombre },
        ]}
      />

      <div className="pdp">
        <div className="wrap pdp-grid">
          {/* Columna izquierda: galería */}
          <div className="pdp-gallery">
            {p.origen && <span className="pdp-origen">Origen: {p.origen}</span>}
            <div className="pdp-gallery-main" style={{ position: "relative", overflow: "hidden" }}>
              {fotos[0] ? (
                <Image src={fotos[0].url} alt={fotos[0].alt} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} priority />
              ) : (
                <span className="ph">Packshot principal<br />mínimo 3 fotos — pendiente §7 (foto de prueba pendiente)</span>
              )}
            </div>
            {fotos.length > 0 && (
              <div className="pdp-gallery-thumbs">
                {fotos.map((foto, i) => (
                  <div key={i} style={{ position: "relative", overflow: "hidden" }}>
                    <Image src={foto.url} alt={foto.alt} fill sizes="64px" style={{ objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna derecha: info de compra */}
          <div className="pdp-info">
            <span className="pdp-tag">{ritualLabel(p.ritual)} · {lineaNombre}</span>
            <h1>{p.nombre}{p.nombrePendiente && <span style={{ fontSize: 14, opacity: 0.6 }}> (nombre pendiente §8.3)</span>}</h1>
            {p.formulaSubtitulo && <p className="pdp-subtitulo">{p.formulaSubtitulo}</p>}

            <div className="pdp-price-row">
              <span className="price">{formatPrecio(p.precio)}</span>
              <span style={{ fontSize: 11, opacity: 0.55 }}>precio mock</span>
            </div>
            <p className="pdp-meta">Formato: {p.formato} · Peso neto: pendiente §7</p>

            <AddToCartButtonProducto slug={p.slug} />
            {stockBajo && <p className="stock-badge">Quedan pocas unidades (mock: {p.stock})</p>}

            <p className="pdp-shipnote">Reparto en zona los viernes · Envío sin cargo desde $[mínimo]. Despachamos a todo el país por Correo Argentino y Andreani.</p>
          </div>
        </div>

        {/* Zona de contenido — los 4 bloques, siempre en este orden */}
        <div className="wrap">
          <div className="pdp-blocks">
            <PdpBlock title="Descripción" defaultOpen>
              <p>{p.descripcion}</p>
            </PdpBlock>

            {p.laFormula && (
              <PdpBlock title="La fórmula">
                {p.laFormula.map((ing) => (
                  <div className="pdp-formula-item" key={ing.ingrediente}>
                    <strong>{ing.ingrediente}</strong>
                    {ing.texto}
                  </div>
                ))}
              </PdpBlock>
            )}

            <PdpBlock title="Beneficios">
              <ul>
                {p.beneficios.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </PdpBlock>

            <PdpBlock title="Ritual de Uso" destacado>
              <p>{p.ritualDeUso}</p>
            </PdpBlock>

            <PdpBlock title="Ingredientes">
              {p.ingredientes ? (
                <p>{p.ingredientes}</p>
              ) : (
                <p style={{ opacity: 0.6 }}>[PENDIENTE — la marca debe redactar este bloque. Ver observación 8.4 del brief]</p>
              )}
              {p.notaDePureza && <p className="pdp-nota-pureza">Nota de pureza: {p.notaDePureza}</p>}
            </PdpBlock>
          </div>

          {/* Zona inferior */}
          {combos.length > 0 && (
            <div className="pdp-cross pdp-cross-section">
              <h2>Combinalo con</h2>
              <div className="rail cols-3">
                {combos.map((combo) => (
                  <ComboCard combo={combo} key={combo.slug} />
                ))}
              </div>
            </div>
          )}

          {relacionados.length > 0 && (
            <div className="pdp-cross pdp-cross-section">
              <h2>De la misma línea</h2>
              <div className="rail cols-3">
                {relacionados.map((rp) => (
                  <ProductCard producto={rp} key={rp.slug} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
