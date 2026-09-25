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
import { getTextos } from "@/lib/textos";

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProducto(slug);
  if (!p) notFound();

  const [combos, relacionados, lineas, t] = await Promise.all([
    combosParaProducto(slug),
    relacionadosMismaLinea(slug, 8),
    getLineas(),
    getTextos(),
  ]);
  const opciones = [1, 2, 3].map((n) => t[`ficha.opciones.${n}`]).filter((o) => o?.trim());
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
            </div>
            {p.formulaSubtitulo && <p className="pdp-frase">{p.formulaSubtitulo}</p>}

            {tieneFormato && (
              <div className="pills" role="group" aria-label="Formato">
                <span className="pill on">{p.formato}</span>
              </div>
            )}

            {(t["ficha.opciones.titulo"] || opciones.length > 0) && (
              <div className="buy-options">
                {t["ficha.opciones.titulo"] && <div className="buy-options-head">{t["ficha.opciones.titulo"]}</div>}
                <ul>
                  {opciones.map((o) => (
                    <li key={o}><Icon name="check" size={16} />{o}</li>
                  ))}
                </ul>
              </div>
            )}

            <AddToCartButtonProducto slug={p.slug} nombre={p.nombre} precio={p.precio} />
            {stockBajo && <p className="stock-badge">{t["ficha.pocas-unidades"]}</p>}

            <ul className="trust-row">
              {t["ficha.confianza.1"] && <li><Icon name="truck" size={24} /><span>{t["ficha.confianza.1"]}</span></li>}
              {t["ficha.confianza.2"] && <li><Icon name="card" size={24} /><span>{t["ficha.confianza.2"]}</span></li>}
              {t["ficha.confianza.3"] && <li><Icon name="refresh" size={24} /><Link href="/cambios-y-devoluciones">{t["ficha.confianza.3"]}</Link></li>}
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

              {(tieneIngredientes || p.notaDePureza) && (
                <PdpBlock title="Ingredientes">
                  {p.laFormula?.map((ing) => (
                    <div className="pdp-formula-item" key={ing.ingrediente}>
                      <strong>{ing.ingrediente}</strong>
                      {ing.texto}
                    </div>
                  ))}
                  {p.ingredientes && <p>{p.ingredientes}</p>}
                  {p.notaDePureza && <p className="pdp-nota-pureza">Nota de pureza: {p.notaDePureza}</p>}
                </PdpBlock>
              )}

              {p.origen && (
                <PdpBlock title="Origen">
                  <p>{p.origen}</p>
                </PdpBlock>
              )}
            </div>

            {combos.length > 0 && (
              <div className="together">
                <h3>{t["ficha.combinalo"]}</h3>
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
            <h2 className="h-section">{t["ficha.misma-linea"]}</h2>
          </div>
          <Carousel label={t["ficha.misma-linea"]}>
            {relacionados.map((rp) => (
              <ProductCard producto={rp} key={rp.slug} />
            ))}
          </Carousel>
        </section>
      )}
    </>
  );
}
