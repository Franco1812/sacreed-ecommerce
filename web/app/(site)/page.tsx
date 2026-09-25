import Image from "next/image";
import Link from "next/link";
import AttributeStrip from "@/components/AttributeStrip";
import Carousel from "@/components/Carousel";
import ComboCard from "@/components/ComboCard";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { productosMasVendidos } from "@/lib/helpers";
import { getAllCombos, getContenidoHome, getHeroImagenes } from "@/lib/data";
import { getTextos } from "@/lib/textos";

/** El copy editable se guarda con saltos de línea reales; acá se vuelven <br>. */
function conSaltos(texto: string) {
  return texto.split("\n").map((linea, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {linea}
    </span>
  ));
}

export default async function HomePage() {
  const [combos, contenido, masVendidos, fotosHero, t] = await Promise.all([
    getAllCombos(),
    getContenidoHome(),
    productosMasVendidos(),
    getHeroImagenes(),
    getTextos(),
  ]);
  // Los tres pilares salen de Admin → Textos; una foto vacía = se muestra solo el texto.
  const pilares = [1, 2, 3]
    .map((n) => ({ titulo: t[`home.pilar.${n}.titulo`], texto: t[`home.pilar.${n}.texto`], foto: t[`home.pilar.${n}.foto`] }))
    .filter((p) => p.titulo?.trim() || p.texto?.trim());

  return (
    <>
      {/* BLOQUE 1 — Hero: foto a ancho completo, texto blanco a la izquierda, un solo botón */}
      <div className="hero anchor">
        <HeroCarousel imagenes={fotosHero} />
        <div className="hero-scrim" aria-hidden="true"></div>
        <div className="wrap hero-inner">
          <div className="hero-copy">
            {contenido.heroEyebrow && <span className="tag-accent">{contenido.heroEyebrow}</span>}
            <h1 className="h-display">
              {conSaltos(contenido.heroTitulo)}<br />
              {conSaltos(contenido.heroTituloEnfasis)}
            </h1>
            <p className="hero-sub">{contenido.heroBajada}</p>
            <Link href={contenido.heroCta1Href} className="btn btn-light">{contenido.heroCta1Label}</Link>
          </div>
        </div>
      </div>

      {/* BLOQUE 2 — Franja de atributos en movimiento continuo */}
      <AttributeStrip />

      {/* BLOQUE 3 — Los más vendidos (lista armada a mano desde el admin, ver productosMasVendidos en lib/helpers.ts) */}
      {masVendidos.length > 0 && (
        <section id="mas-vendidos" className="anchor">
          <div className="section-head">
            <h2 className="h-section">{contenido.masVendidosTitulo}</h2>
            <Link href="/comprar-por-beneficio" className="link-all">Ver todo</Link>
          </div>
          <Carousel label={contenido.masVendidosTitulo}>
            {masVendidos.map(({ producto }, i) => (
              <ProductCard producto={producto} key={producto.slug} badge={i === 0 ? "Más vendido" : undefined} />
            ))}
          </Carousel>
        </section>
      )}

      {/* BLOQUE 4 — Pilares de marca (reemplaza el bloque "Nuestro Origen" de solo texto) */}
      <section className="pilares bg-band anchor">
        <div className="wrap">
          <div className="pilares-head">
            <h2 className="h-section">{t["home.pilares.titulo"]}</h2>
            <p>{t["home.pilares.texto"]}</p>
            {t["home.pilares.boton"] && <Link href="/nuestro-origen" className="btn btn-ghost">{t["home.pilares.boton"]}</Link>}
          </div>
          <div className="pilares-grid">
            {pilares.map((p) => (
              <div key={p.titulo}>
                {p.foto && (
                  <div className="pilar-foto">
                    <Image src={p.foto} alt="" fill sizes="(max-width: 900px) 100vw, 360px" style={{ objectFit: "cover" }} />
                  </div>
                )}
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 5 — Combos Sinérgicos: mismo carrusel que los más vendidos */}
      {combos.length > 0 && (
        <section id="combos" className="anchor">
          <div className="section-head">
            <h2 className="h-section">{t["home.combos.titulo"]}</h2>
            <Link href="/combos" className="link-all">Ver todo</Link>
          </div>
          <Carousel label={t["home.combos.titulo"]}>
            {combos.map((combo) => (
              <ComboCard combo={combo} key={combo.slug} />
            ))}
          </Carousel>
        </section>
      )}

      {/* BLOQUE 6 — Banner "Armá tu ritual" (lleva al selector AM/PM). Color liso hasta que Cintia suba una foto (Admin → Textos). */}
      <section id="ritual" className="anchor">
        <div className="wrap">
          <div className="banner">
            {t["home.banner.foto"] && (
              <>
                <Image src={t["home.banner.foto"]} alt="" fill sizes="(max-width: 1200px) 100vw, 1140px" style={{ objectFit: "cover" }} />
                <div className="banner-scrim" aria-hidden="true"></div>
              </>
            )}
            <div className="banner-inner">
              <h2 className="h-section">{t["home.banner.titulo"]}</h2>
              <p>{t["home.banner.texto"]}</p>
              {t["home.banner.boton"] && <Link href="/rituales" className="btn btn-outline-light">{t["home.banner.boton"]}</Link>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
