import Link from "next/link";
import AttributeStrip from "@/components/AttributeStrip";
import Carousel from "@/components/Carousel";
import ComboCard from "@/components/ComboCard";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { productosMasVendidos } from "@/lib/helpers";
import { getAllCombos, getContenidoHome, getHeroImagenes } from "@/lib/data";

/** El copy editable se guarda con saltos de línea reales; acá se vuelven <br>. */
function conSaltos(texto: string) {
  return texto.split("\n").map((linea, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {linea}
    </span>
  ));
}

const PILARES = [
  { titulo: "Origen trazable", texto: "Sabemos de dónde viene cada ingrediente y lo contamos en la ficha de cada producto." },
  { titulo: "Sin rellenos", texto: "Solo lo que cumple una función. Nada de ingredientes innecesarios." },
  { titulo: "Upgrade de bienestar", texto: "Pequeños rituales, de la mañana a la noche, que se integran a tu día sin esfuerzo." },
];

export default async function HomePage() {
  const [combos, contenido, masVendidos, fotosHero] = await Promise.all([
    getAllCombos(),
    getContenidoHome(),
    productosMasVendidos(),
    getHeroImagenes(),
  ]);

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
            <h2 className="h-section">Nuestro Origen</h2>
            <p>No nos propusimos crear una marca más de productos naturales. ¿Cómo podemos hacer de un simple momento una experiencia de bienestar profunda, que forme parte de la vida cotidiana sin esfuerzo?</p>
            <Link href="/nuestro-origen" className="btn btn-ghost">Aprender más</Link>
          </div>
          <div className="pilares-grid">
            {PILARES.map((p) => (
              <div key={p.titulo}>
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
            <h2 className="h-section">Combos Sinérgicos</h2>
            <Link href="/combos" className="link-all">Ver todo</Link>
          </div>
          <Carousel label="Combos Sinérgicos">
            {combos.map((combo) => (
              <ComboCard combo={combo} key={combo.slug} />
            ))}
          </Carousel>
        </section>
      )}

      {/* BLOQUE 6 — Banner "Armá tu ritual" (lleva al selector AM/PM). Color liso hasta tener una foto propia del banner. */}
      <section id="ritual" className="anchor">
        <div className="wrap">
          <div className="banner">
            <div className="banner-inner">
              <h2 className="h-section">Armá tu ritual</h2>
              <p>El día tiene dos mitades. Elegí tu momento: mañana o noche.</p>
              <Link href="/rituales" className="btn btn-outline-light">Elegir mi ritual</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
