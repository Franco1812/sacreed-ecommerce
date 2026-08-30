import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { LINEAS } from "@/lib/mock-data";
import { productosPorLinea } from "@/lib/helpers";
import type { RitualModo } from "@/lib/types";

export function generateStaticParams() {
  return Object.keys(LINEAS).map((linea) => ({ linea }));
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ linea: string }>;
  searchParams: Promise<{ ritual?: string }>;
}) {
  const { linea: slug } = await params;
  const { ritual } = await searchParams;
  const linea = LINEAS[slug as keyof typeof LINEAS];
  if (!linea) notFound();

  let productos = await productosPorLinea(slug);
  const filtroRitual = ritual === "am" || ritual === "pm" ? (ritual as RitualModo) : "";
  if (filtroRitual) {
    productos = productos.filter((p) => p.ritual.includes(filtroRitual));
  }

  const otras = Object.entries(LINEAS).filter(([k]) => k !== slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Comprar por Beneficio", href: "/comprar-por-beneficio" },
          { label: linea.nombre },
        ]}
      />

      <div className="cat-header">
        <div className="wrap">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>Línea de beneficio</span>
          <h1>{linea.nombre}</h1>
          <p>{linea.texto}</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="filters">
            <Link href={`/comprar-por-beneficio/${slug}`} className={filtroRitual === "" ? "active" : ""}>Todos</Link>
            <Link href={`/comprar-por-beneficio/${slug}?ritual=am`} className={filtroRitual === "am" ? "active" : ""}>☀ Ritual AM</Link>
            <Link href={`/comprar-por-beneficio/${slug}?ritual=pm`} className={filtroRitual === "pm" ? "active" : ""}>☾ Ritual PM</Link>
          </div>

          {productos.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No hay productos cargados con ese filtro todavía.</p>
          ) : (
            <div className="rail">
              {productos.map((p) => (
                <ProductCard producto={p} key={p.slug} />
              ))}
            </div>
          )}

          <div className="cat-crosslinks">
            {otras.map(([oslug, ol]) => (
              <Link href={`/comprar-por-beneficio/${oslug}`} key={oslug}>{ol.nombre}</Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
