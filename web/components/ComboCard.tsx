import Link from "next/link";
import { comboProductos } from "@/lib/helpers";
import { formatPrecio } from "@/lib/format";
import type { Combo } from "@/lib/types";

export default async function ComboCard({ combo }: { combo: Combo }) {
  return (
    <article className="card">
      <div className="card-media">
        <span className="badge gold">Combo</span>
        <span className="ph">Packshot combo</span>
        <Link href={`/combos/${combo.slug}`} className="quickadd">Ver combo</Link>
      </div>
      <div className="card-body">
        <span className="card-tag">Combo sinérgico</span>
        <h3><Link href={`/combos/${combo.slug}`}>{combo.nombre}</Link></h3>
        <p className="card-benefit">{combo.bajada}</p>
        <div className="card-foot"><span className="price">{formatPrecio(combo.precio)}</span></div>
      </div>
    </article>
  );
}

export async function ComboBundle({ combo }: { combo: Combo }) {
  const comps = await comboProductos(combo);
  return (
    <article className="bundle">
      <div>
        <div className="bundle-media"><span className="ph">Imagen combo</span></div>
        <h3><Link href={`/combos/${combo.slug}`}>{combo.nombre}</Link></h3>
        <p className="bundle-bajada">{combo.bajada}</p>
        <ul className="bundle-items">
          {comps.map((cp) => (
            <li key={cp.slug}><Link href={`/producto/${cp.slug}`}>{cp.nombre}</Link></li>
          ))}
        </ul>
        <div className="bundle-price">{formatPrecio(combo.precio)}</div>
      </div>
      <Link href={`/combos/${combo.slug}`} className="btn btn-ghost">Ver el combo</Link>
    </article>
  );
}
