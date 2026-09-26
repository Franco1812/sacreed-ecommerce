import Breadcrumbs from "@/components/Breadcrumbs";
import { ComboBundle } from "@/components/ComboCard";
import { getAllCombos } from "@/lib/data";
import { getTextos } from "@/lib/textos";

export async function generateMetadata() {
  const t = await getTextos();
  return { title: `${t["combos.titulo"]} — SACRED Wellness Club` };
}

export default async function CombosIndexPage() {
  const [combos, t] = await Promise.all([getAllCombos(), getTextos()]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: t["combos.titulo"] }]} />

      <section className="bundles">
        <div className="wrap">
          <div className="section-head" style={{ borderColor: "var(--hair)" }}>
            <div>
              <h1 className="h-section">{t["combos.titulo"]}</h1>
            </div>
          </div>
          <p className="prose" style={{ marginBottom: 44, opacity: 0.85 }}>
            {t["combos.intro"]}
          </p>

          <div className="bundle-grid">
            {combos.map((combo) => (
              <ComboBundle combo={combo} key={combo.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
