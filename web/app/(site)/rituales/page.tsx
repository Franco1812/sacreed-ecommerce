import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RITUALES } from "@/lib/mock-data";
import { productosPorRitual } from "@/lib/helpers";

export const metadata = { title: "Rituales AM / PM — SACRED Wellness Club" };

export default async function RitualesIndexPage() {
  const [am, pm] = await Promise.all([productosPorRitual("am"), productosPorRitual("pm")]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Rituales AM / PM" }]} />

      <section>
        <div className="wrap" style={{ textAlign: "center", maxWidth: 760 }}>
          <span className="eyebrow" style={{ color: "var(--gold)" }}>El día tiene dos mitades</span>
          <h1 className="h-section" style={{ margin: "16px 0 20px" }}>Elegí tu ritual</h1>
          <p className="prose" style={{ margin: "0 auto", textAlign: "center" }}>
            Diseñada para acompañar la curva biológica del día: desde el encendido consciente de la mañana hasta el descanso restaurador de la noche.
          </p>
        </div>

        <div className="wrap cat-index-grid" style={{ marginTop: 56 }}>
          <Link href="/rituales/am" className="cat-index-card">
            <h3>☀ {RITUALES.am.titulo}</h3>
            <p>{RITUALES.am.texto}</p>
            <span className="benefit-count" style={{ display: "block", marginTop: 16 }}>{am.length} productos</span>
          </Link>
          <Link href="/rituales/pm" className="cat-index-card">
            <h3>☾ {RITUALES.pm.titulo}</h3>
            <p>{RITUALES.pm.texto}</p>
            <span className="benefit-count" style={{ display: "block", marginTop: 16 }}>{pm.length} productos</span>
          </Link>
        </div>
      </section>
    </>
  );
}
