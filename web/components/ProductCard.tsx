import Link from "next/link";
import CardFotos from "@/components/CardFotos";
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
  const fotos = producto.imagenes ?? [];
  const badgeTexto = badge ?? producto.destacado;
  const href = `/producto/${producto.slug}`;
  return (
    <article className="card">
      <CardFotos fotos={fotos} href={href} badge={badgeTexto} />
      <div className="card-body">
        <h3><Link href={href}>{producto.nombre}</Link></h3>
        {producto.formulaSubtitulo && <p className="card-benefit">{producto.formulaSubtitulo}</p>}
        <span className="price">{formatPrecio(producto.precio)}</span>
      </div>
      <Link href={href} className="btn btn-ghost card-btn">Comprar</Link>
    </article>
  );
}
