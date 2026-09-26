import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { comboProductos, getCombo } from "@/lib/helpers";
import { formatPrecio } from "@/lib/format";
import { getTextos } from "@/lib/textos";
import { AddToCartButtonCombo } from "@/components/AddToCartButton";

export default async function ComboPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const combo = await getCombo(slug);
  if (!combo) notFound();

  const [comps, t] = await Promise.all([comboProductos(combo), getTextos()]);
  const suma = comps.reduce((acc, p) => acc + p.precio, 0);
  const foto = combo.imagenes?.[0];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Combos Sinérgicos", href: "/combos" },
          { label: combo.nombre },
        ]}
      />

      <div className="combo-hero">
        <div className="wrap combo-hero-grid">
          <div className="combo-media-big">
            {foto && <Image src={foto.url} alt={foto.alt} fill sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: "cover" }} priority />}
          </div>
          <div>
            <h1>{combo.nombre}</h1>
            <p className="bundle-bajada">{combo.bajada}</p>
            {!combo.copyAprobado && (
              <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>Copy propuesto — pendiente de aprobación de marca (§5.9)</p>
            )}

            <div className="combo-integrantes">
              {comps.map((cp) => (
                <Link href={`/producto/${cp.slug}`} className="combo-mini" key={cp.slug} title={cp.nombre}>
                  {cp.nombre}
                </Link>
              ))}
            </div>

            <div className="bundle-price" style={{ margin: "22px 0" }}>
              {formatPrecio(combo.precio)}
              <span style={{ fontSize: 12, opacity: 0.6 }}>vs. {formatPrecio(suma)} comprando cada producto por separado</span>
            </div>
            <AddToCartButtonCombo slug={combo.slug} />
            {t["combo.envio"] && <p className="pdp-shipnote">{t["combo.envio"]}</p>}
          </div>
        </div>
      </div>

      <div className="combo-why">
        <div className="wrap">
          <h2>{t["combo.porque"]}</h2>
          <p>{combo.porQueSePotencian}</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="h-section" style={{ fontSize: "clamp(26px,3vw,38px)" }}>{t["combo.piezas"]}</h2>
            </div>
          </div>
          <div className="rail cols-3">
            {comps.map((cp) => (
              <ProductCard producto={cp} key={cp.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
