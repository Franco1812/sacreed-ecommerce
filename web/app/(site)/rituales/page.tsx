import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { productosPorRitual } from "@/lib/helpers";
import { getTextos } from "@/lib/textos";

export const metadata = { title: "Rituales AM / PM — SACRED Wellness Club" };

export default async function RitualesIndexPage() {
  const [am, pm, t] = await Promise.all([productosPorRitual("am"), productosPorRitual("pm"), getTextos()]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Rituales AM / PM" }]} />

      <section>
        <div className="wrap" style={{ textAlign: "center", maxWidth: 760 }}>
          <h1 className="h-section" style={{ margin: "16px 0 20px" }}>{t["rituales.titulo"]}</h1>
          <p className="prose" style={{ margin: "0 auto", textAlign: "center" }}>
            {t["rituales.intro"]}
          </p>
        </div>

        <div className="wrap cat-index-grid" style={{ marginTop: 56 }}>
          <Link href="/rituales/am" className="cat-index-card">
            <h3>☀ {t["ritual.am.titulo"]}</h3>
            <p>{t["ritual.am.texto"]}</p>
            <span className="benefit-count" style={{ display: "block", marginTop: 16 }}>{am.length} productos</span>
          </Link>
          <Link href="/rituales/pm" className="cat-index-card">
            <h3>☾ {t["ritual.pm.titulo"]}</h3>
            <p>{t["ritual.pm.texto"]}</p>
            <span className="benefit-count" style={{ display: "block", marginTop: 16 }}>{pm.length} productos</span>
          </Link>
        </div>
      </section>
    </>
  );
}
