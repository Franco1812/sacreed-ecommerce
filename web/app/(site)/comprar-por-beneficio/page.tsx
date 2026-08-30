import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LINEAS } from "@/lib/mock-data";
import { getAllProductos } from "@/lib/data";

export const metadata = { title: "Comprá por Beneficio — SACRED Wellness Club" };

export default async function ComprarPorBeneficioPage() {
  const productos = await getAllProductos();
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Comprar por Beneficio" }]} />

      <section>
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Entrada principal a la tienda</span>
              <h2 className="h-section">Comprá por beneficio</h2>
            </div>
          </div>
          <div className="cat-index-grid">
            {Object.entries(LINEAS).map(([slug, l]) => {
              const count = productos.filter((p) => p.linea === slug).length;
              return (
                <Link href={`/comprar-por-beneficio/${slug}`} className="cat-index-card" key={slug}>
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
