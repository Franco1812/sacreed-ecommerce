import Breadcrumbs from "@/components/Breadcrumbs";
import { ComboBundle } from "@/components/ComboCard";
import { getAllCombos } from "@/lib/data";

export const metadata = { title: "Combos Sinérgicos — SACRED Wellness Club" };

export default async function CombosIndexPage() {
  const combos = await getAllCombos();
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Combos Sinérgicos" }]} />

      <section className="bundles">
        <div className="wrap">
          <div className="section-head" style={{ borderColor: "var(--hair)" }}>
            <div>
              <span className="eyebrow">Armados para que no tengas que pensarlo</span>
              <h1 className="h-section">Combos Sinérgicos</h1>
            </div>
          </div>
          <p className="prose" style={{ marginBottom: 44, opacity: 0.85 }}>
            Propuestas de combinaciones alquímicas de productos para potenciar resultados nutricionales y sensoriales. Cuando dos o tres alimentos se consumen juntos, la absorción y el efecto bioactivo se multiplican, eso es la sinergia.
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
