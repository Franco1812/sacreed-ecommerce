import Image from "next/image";
import Link from "next/link";
import { formatPrecio, ritualLabel } from "@/lib/format";
import type { Producto } from "@/lib/types";

export default function ProductCard({ producto }: { producto: Producto }) {
  const foto = producto.imagenes?.[0];
  return (
    <article className="card">
      <div className="card-media">
        {producto.destacado && <span className="badge">{producto.destacado}</span>}
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
          <p className="card-benefit" style={{ fontStyle: "italic" }}>{producto.formulaSubtitulo}</p>
        )}
        <div className="card-foot">
          <span className="price">{formatPrecio(producto.precio)}</span>
          <span className="stars" style={{ opacity: 0.5 }}>mock</span>
        </div>
      </div>
    </article>
  );
}
