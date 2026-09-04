import Link from "next/link";
import RitualToggle from "@/components/RitualToggle";
import HeroCarousel from "@/components/HeroCarousel";
import { ComboBundle } from "@/components/ComboCard";
import { productosPorRitual } from "@/lib/helpers";
import { getAllCombos, getAllProductos, getContenidoHome, getLineas } from "@/lib/data";

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
  const [combos, productos, am, pm, contenido, lineas] = await Promise.all([
    getAllCombos(),
    getAllProductos(),
    productosPorRitual("am"),
    productosPorRitual("pm"),
    getContenidoHome(),
    getLineas(),
  ]);
  const combosDestacados = combos.slice(0, 3);
  const amTop = am.slice(0, 3);
  const pmTop = pm.slice(0, 3);
  const fotosHero = productos.flatMap((p) => p.imagenes ?? []).slice(0, 5);

  return (
    <>
      {/* BLOQUE 1 — Hero */}
      <div className="hero anchor">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">{contenido.heroEyebrow}</span>
            <h1 className="h-display">
              {conSaltos(contenido.heroTitulo)}<br />
              <em>{conSaltos(contenido.heroTituloEnfasis)}</em>
            </h1>
            <p className="hero-sub">{contenido.heroBajada}</p>
            <div className="hero-actions">
              <Link href={contenido.heroCta1Href} className="btn btn-solid">{contenido.heroCta1Label}</Link>
              <Link href={contenido.heroCta2Href} className="btn btn-ghost">{contenido.heroCta2Label}</Link>
            </div>
          </div>
          <HeroCarousel imagenes={fotosHero} />
        </div>
      </div>

      {/* BLOQUE 2 — Cinta infinita */}
      <div className="marquee anchor">
        <div className="marquee-track">
          <span>100% TRAZABLE ✦ SIN RELLENOS NI INGREDIENTES INNECESARIOS ✦ UPGRADE DE BIENESTAR ✦ SLOW LIVING ✦</span>
          <span aria-hidden="true">100% TRAZABLE ✦ SIN RELLENOS NI INGREDIENTES INNECESARIOS ✦ UPGRADE DE BIENESTAR ✦ SLOW LIVING ✦</span>
        </div>
      </div>

      {/* BLOQUE 3 — Comprar por Beneficio */}
      <section id="beneficios" className="anchor">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">{contenido.beneficiosEyebrow}</span>
              <h2 className="h-section">{contenido.beneficiosTitulo}</h2>
            </div>
            <Link href="/comprar-por-beneficio" className="link-all">Ver todo</Link>
          </div>
          <div className="benefits">
            {lineas.map((l) => {
              const count = productos.filter((p) => p.linea === l.slug).length;
              return (
                <Link href={`/comprar-por-beneficio/${l.slug}`} className="benefit" key={l.slug}>
                  <div>
                    <div className="benefit-name">{l.nombre}</div>
                    <p className="benefit-desc">{l.texto}</p>
                  </div>
                  <span className="benefit-count">{count} producto{count === 1 ? "" : "s"}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOQUE 4 — Rituales AM / PM */}
      <RitualToggle am={amTop} pm={pmTop} />

      {/* BLOQUE 5 — Combos Sinérgicos */}
      <section id="combos" className="bundles anchor">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Sinergias</span>
              <h2 className="h-section">Combos Sinérgicos</h2>
            </div>
            <Link href="/combos" className="link-all">Ver todos los combos</Link>
          </div>
          <p className="prose" style={{ marginBottom: 40, opacity: 0.85 }}>
            Propuestas de combinaciones alquímicas de productos para potenciar resultados nutricionales y sensoriales. Cuando dos o tres alimentos se consumen juntos, la absorción y el efecto bioactivo se multiplican, eso es la sinergia.
          </p>
          <div className="bundle-grid cols-1-35">
            {combosDestacados.map((combo) => (
              <ComboBundle combo={combo} key={combo.slug} />
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 6 — Nuestro Origen */}
      <section className="anchor">
        <div className="wrap" style={{ maxWidth: 820, textAlign: "center" }}>
          <span className="eyebrow" style={{ color: "var(--gold)" }}>La marca</span>
          <h2 className="h-section" style={{ margin: "16px 0 28px" }}>Nuestro Origen</h2>
          <p className="prose" style={{ margin: "0 auto 22px", textAlign: "center" }}>No nos propusimos crear una marca más de productos naturales.</p>
          <p style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(22px,3vw,30px)", fontWeight: 300, lineHeight: 1.4, margin: "0 auto 26px", maxWidth: "38ch" }}>
            ¿Cómo podemos hacer de un simple momento una experiencia de bienestar profunda, que forme parte de la vida cotidiana sin esfuerzo?
          </p>
          <Link href="/nuestro-origen" className="link-all">Conocer nuestro origen</Link>
        </div>
      </section>
    </>
  );
}
