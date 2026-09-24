import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButtonProducto, AgregarMini } from "@/components/AddToCartButton";
import AttributeStrip from "@/components/AttributeStrip";
import Breadcrumbs from "@/components/Breadcrumbs";
import Carousel from "@/components/Carousel";
import Icon from "@/components/Icons";
import PdpBlock from "@/components/PdpBlock";
import ProductCard from "@/components/ProductCard";
import { getLineas } from "@/lib/data";
import { combosParaProducto, getProducto, relacionadosMismaLinea } from "@/lib/helpers";
import { formatPrecio } from "@/lib/format";
import { ENVIO_GRATIS_ZONA_MOCK } from "@/lib/mock-data";

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProducto(slug);
  if (!p) notFound();

  const [combos, relacionados, lineas] = await Promise.all([
    combosParaProducto(slug),
    relacionadosMismaLinea(slug, 8),
    getLineas(),
  ]);
  // La API garantiza una fila por cada valor del enum, así que el find siempre
  // encuentra; el fallback es sólo para no romper tipos.
  const lineaNombre = lineas.find((l) => l.slug === p.linea)?.nombre ?? "";
  const stockBajo = p.stock <= 15;
  const fotos = p.imagenes ?? [];
  const tieneFormato = p.formato && p.formato !== "PENDIENTE";
  const tieneIngredientes = Boolean(p.ingredientes) || Boolean(p.laFormula?.length);

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
          {/* Izquierda (55%): foto principal grande + grilla de 2 columnas con el resto. En mobile es una galería deslizable. */}
          <div className="pdp-photos">
            {fotos.length > 0 ? (
              fotos.map((foto, i) => (
                <div className="pdp-photo" key={foto.url}>
                  <Image
                    src={foto.url}
                    alt={foto.alt}
                    fill
                    sizes={i === 0 ? "(max-width: 1000px) 100vw, 55vw" : "(max-width: 1000px) 100vw, 27vw"}
                    style={{ objectFit: "cover" }}
                    priority={i === 0}
                  />
                </div>
              ))
            ) : (
              <div className="pdp-photo"></div>
            )}
          </div>

          {/* Derecha (45%): columna fija mientras se hace scroll */}
          <div className="pdp-info">
            <span className="tag-accent">{lineaNombre}</span>
            <h1>{p.nombre}{p.nombrePendiente && <span style={{ fontSize: 14, opacity: 0.6 }}> (nombre pendiente §8.3)</span>}</h1>

            <div className="pdp-price-row">
              <span className="price">{formatPrecio(p.precio)}</span>
              <span style={{ fontSize: 11, opacity: 0.55 }}>precio mock</span>
            </div>
            {p.formulaSubtitulo && <p className="pdp-frase">{p.formulaSubtitulo}</p>}

            {tieneFormato && (
              <div className="pills" role="group" aria-label="Formato">
                <span className="pill on">{p.formato}</span>
              </div>
            )}

            <div className="buy-options">
              <div className="buy-options-head">Pago por transferencia -15%</div>
              <ul>
                <li><Icon name="check" size={16} />15% de descuento pagando por transferencia</li>
                <li><Icon name="check" size={16} />Reparto propio en la zona los viernes</li>
                <li><Icon name="check" size={16} />Envío sin cargo desde {formatPrecio(ENVIO_GRATIS_ZONA_MOCK)} en tu zona</li>
              </ul>
            </div>

            <AddToCartButtonProducto slug={p.slug} nombre={p.nombre} precio={p.precio} />
            {stockBajo && <p className="stock-badge">Quedan pocas unidades (mock: {p.stock})</p>}

            <ul className="trust-row">
              <li><Icon name="truck" size={24} /><span>Envíos a todo el país</span></li>
              <li><Icon name="card" size={24} /><span>Pagás por transferencia</span></li>
              <li><Icon name="refresh" size={24} /><Link href="/cambios-y-devoluciones">Cambios y devoluciones</Link></li>
            </ul>

            <div className="pdp-blocks">
              <PdpBlock title="Descripción" defaultOpen>
                <p>{p.descripcion}</p>
              </PdpBlock>

              <PdpBlock title="Beneficios">
                <ul>
                  {p.beneficios.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </PdpBlock>

              <PdpBlock title="Cómo usarlo">
                <p>{p.ritualDeUso}</p>
              </PdpBlock>

              <PdpBlock title="Ingredientes">
                {p.laFormula?.map((ing) => (
                  <div className="pdp-formula-item" key={ing.ingrediente}>
                    <strong>{ing.ingrediente}</strong>
                    {ing.texto}
                  </div>
                ))}
                {p.ingredientes && <p>{p.ingredientes}</p>}
                {!tieneIngredientes && (
                  <p style={{ opacity: 0.6 }}>[PENDIENTE — la marca debe redactar este bloque. Ver observación 8.4 del brief]</p>
                )}
                {p.notaDePureza && <p className="pdp-nota-pureza">Nota de pureza: {p.notaDePureza}</p>}
              </PdpBlock>

              {p.origen && (
                <PdpBlock title="Origen">
                  <p>{p.origen}</p>
                </PdpBlock>
              )}
            </div>

            {combos.length > 0 && (
              <div className="together">
                <h3>Combinalo con</h3>
                <ul>
                  {combos.slice(0, 2).map((combo) => {
                    const foto = combo.imagenes?.[0];
                    return (
                      <li key={combo.slug}>
                        <Link href={`/combos/${combo.slug}`} className="together-media" tabIndex={-1} aria-hidden="true">
                          {foto && <Image src={foto.url} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />}
                        </Link>
                        <div className="together-info">
                          <Link href={`/combos/${combo.slug}`}>{combo.nombre}</Link>
                          <span className="price">{formatPrecio(combo.precio)}</span>
                        </div>
                        <AgregarMini slug={combo.slug} tipo="combo" />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <AttributeStrip />

      {relacionados.length > 0 && (
        <section>
          <div className="section-head">
            <h2 className="h-section">De la misma línea</h2>
          </div>
          <Carousel label="De la misma línea">
            {relacionados.map((rp) => (
              <ProductCard producto={rp} key={rp.slug} />
            ))}
          </Carousel>
        </section>
      )}
    </>
  );
}
