import Image from "next/image";
import Link from "next/link";
import { comboProductos } from "@/lib/helpers";
import { formatPrecio } from "@/lib/format";
import type { Combo } from "@/lib/types";

/** Misma tarjeta que los productos, para que los combos entren en el mismo carrusel. */
export default function ComboCard({ combo }: { combo: Combo }) {
  const foto = combo.imagenes?.[0];
  const href = `/combos/${combo.slug}`;
  return (
    <article className="card">
      <Link href={href} className="card-media" tabIndex={-1} aria-hidden="true">
        <span className="badge">Combo</span>
        {foto && <Image src={foto.url} alt={foto.alt} fill sizes="(max-width: 680px) 45vw, (max-width: 1000px) 30vw, 220px" style={{ objectFit: "cover" }} />}
      </Link>
      <div className="card-body">
        <h3><Link href={href}>{combo.nombre}</Link></h3>
        <p className="card-benefit">{combo.bajada}</p>
        <span className="price">{formatPrecio(combo.precio)}</span>
      </div>
      <Link href={href} className="btn btn-ghost card-btn">Comprar</Link>
    </article>
  );
}

/** Tarjeta grande del listado de combos (/combos): incluye los productos que lo integran. */
export async function ComboBundle({ combo }: { combo: Combo }) {
  const comps = await comboProductos(combo);
  const foto = combo.imagenes?.[0];
  return (
    <article className="bundle">
      <div>
        {foto && (
          <div className="bundle-media">
            <Image src={foto.url} alt={foto.alt} fill sizes="(max-width: 1000px) 100vw, 360px" style={{ objectFit: "cover" }} />
          </div>
        )}
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
