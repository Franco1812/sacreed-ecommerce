import Image from "next/image";
import Link from "next/link";
import { formatPrecio, ritualLabel } from "@/lib/format";
import type { Producto } from "@/lib/types";

export default function ProductCard({
  producto,
  badge,
  badgeGold = false,
  meta,
}: {
  producto: Producto;
  /** Pisa producto.destacado — útil para badges contextuales (ej. "Más vendido") que no son un dato del producto. */
  badge?: string;
  badgeGold?: boolean;
  /** Pisa el texto de la esquina inferior derecha (por defecto, el placeholder de estrellas). */
  meta?: string;
}) {
  const foto = producto.imagenes?.[0];
  const badgeTexto = badge ?? producto.destacado;
  return (
    <article className="card">
      <div className="card-media">
        {badgeTexto && <span className={`badge${badgeGold ? " gold" : ""}`}>{badgeTexto}</span>}
        {foto ? (
          <Image src={foto.url} alt={foto.alt} fill sizes="(max-width: 640px) 50vw, 300px" style={{ objectFit: "cover" }} />
        ) : (
          <span className="ph">Packshot</span>
        )}
        <Link href={`/producto/${producto.slug}`} className="quickadd">Ver ficha</Link>
      </div>
      <div className="card-body">
        <span className="card-tag">{ritualLabel(producto.ritual)}</span>
        <h3><Link href={`/producto/${producto.slug}`}>{producto.nombre}</Link></h3>
        {producto.formulaSubtitulo && (
          <p className="card-benefit">{producto.formulaSubtitulo}</p>
        )}
        <div className="card-foot">
          <span className="price">{formatPrecio(producto.precio)}</span>
          <span className="stars" style={{ opacity: 0.5 }}>{meta ?? "mock"}</span>
        </div>
      </div>
    </article>
  );
}
