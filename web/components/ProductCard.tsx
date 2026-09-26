import Image from "next/image";
import Link from "next/link";
import { formatPrecio } from "@/lib/format";
import type { Producto } from "@/lib/types";

/**
 * Tarjeta de producto (home, categorías, rituales, combos): foto sin caja sobre el fondo de la
 * página, todo centrado y cerrada por un botón "Comprar" a ancho completo.
 */
export default function ProductCard({
  producto,
  badge,
}: {
  producto: Producto;
  /** Pisa producto.destacado — útil para etiquetas contextuales (ej. "Más vendido") que no son un dato del producto. */
  badge?: string;
}) {
  const foto = producto.imagenes?.[0];
  const badgeTexto = badge ?? producto.destacado;
  const href = `/producto/${producto.slug}`;
  return (
    <article className="card">
      <Link href={href} className="card-media" tabIndex={-1} aria-hidden="true">
        {badgeTexto && <span className="badge">{badgeTexto}</span>}
        {foto && <Image src={foto.url} alt={foto.alt} fill sizes="(max-width: 680px) 45vw, (max-width: 1000px) 30vw, 220px" style={{ objectFit: "cover" }} />}
      </Link>
      <div className="card-body">
        <h3><Link href={href}>{producto.nombre}</Link></h3>
        {producto.formulaSubtitulo && <p className="card-benefit">{producto.formulaSubtitulo}</p>}
        <span className="price">{formatPrecio(producto.precio)}</span>
      </div>
      <Link href={href} className="btn btn-ghost card-btn">Comprar</Link>
    </article>
  );
}
