import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllProductos, getContenidoHome, getLineas } from "@/lib/data";

export const metadata = { title: "Comprá por Beneficio — SACRED Wellness Club" };

export default async function ComprarPorBeneficioPage() {
  const [productos, lineas, contenido] = await Promise.all([getAllProductos(), getLineas(), getContenidoHome()]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Comprar por Beneficio" }]} />

      <section>
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">{contenido.beneficiosEyebrow}</span>
              <h2 className="h-section">{contenido.beneficiosTitulo}</h2>
            </div>
          </div>
          <div className="cat-index-grid">
            {lineas.map((l) => {
              const count = productos.filter((p) => p.linea === l.slug).length;
              return (
                <Link href={`/comprar-por-beneficio/${l.slug}`} className="cat-index-card" key={l.slug}>
                  <h3>{l.nombre}</h3>
                  <p>{l.texto}</p>
                  <span className="benefit-count" style={{ display: "block", marginTop: 16 }}>
                    {count} producto{count === 1 ? "" : "s"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
