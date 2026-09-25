import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ComboCard from "@/components/ComboCard";
import { combosPorRitual, productosPorRitual } from "@/lib/helpers";
import { getTextos } from "@/lib/textos";
import type { RitualModo } from "@/lib/types";

export function generateStaticParams() {
  return [{ modo: "am" }, { modo: "pm" }];
}

export default async function RitualPage({ params }: { params: Promise<{ modo: string }> }) {
  const { modo: raw } = await params;
  if (raw !== "am" && raw !== "pm") notFound();
  const modo = raw as RitualModo;

  const [productos, combos, t] = await Promise.all([productosPorRitual(modo), combosPorRitual(modo), getTextos()]);
  const r = { titulo: t[`ritual.${modo}.titulo`], texto: t[`ritual.${modo}.texto`] };
  const otro: RitualModo = modo === "am" ? "pm" : "am";

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Rituales", href: "/rituales" },
          { label: modo.toUpperCase() },
        ]}
      />

      <div className={`ritual-page ${modo === "pm" ? "pm" : ""}`}>
        <div className="wrap" style={{ textAlign: "center", maxWidth: 760 }}>
          <h1 className="h-section" style={{ margin: "16px 0 20px" }}>{r.titulo}</h1>
          <p className="prose" style={{ margin: "0 auto", textAlign: "center", opacity: 0.85 }}>{r.texto}</p>
          <div style={{ marginTop: 30 }}>
            <Link href={`/rituales/${otro}`} className="link-all">
              {otro === "am" ? "☀ Ver Ritual AM" : "☾ Ver Ritual PM"}
            </Link>
          </div>
        </div>

        <div className="wrap rail">
          {combos.map((combo) => (
            <ComboCard combo={combo} key={combo.slug} />
          ))}
          {productos.map((p) => (
            <ProductCard producto={p} key={p.slug} />
          ))}
        </div>
      </div>
    </>
  );
}
