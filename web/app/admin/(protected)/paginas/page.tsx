import Link from "next/link";
import { adminApiFetch } from "@/lib/admin-api";

interface PaginaAdmin {
  slug: string;
  ruta: string;
  titulo: string;
  editada: boolean;
}

export default async function AdminPaginasPage() {
  const res = await adminApiFetch("/contenido/paginas");
  if (!res.ok) throw new Error(`GET /contenido/paginas: ${res.status}`);
  const paginas: PaginaAdmin[] = await res.json();

  return (
    <>
      <div className="admin-main-head">
        <h1>Páginas</h1>
      </div>
      <p className="ce-intro">
        Los textos largos del sitio: Nuestro Origen, envíos, preguntas frecuentes, términos, privacidad y más. Elegí una para cambiar su título y su texto.
      </p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Página</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginas.map((p) => (
            <tr key={p.slug}>
              <td>{p.titulo}</td>
              <td>{p.editada ? "Editada por vos" : "Texto original del sitio"}</td>
              <td>
                <Link href={`/admin/paginas/${p.slug}`} className="admin-btn-ghost">Editar</Link>
              </td>
              <td>
                <a href={p.ruta} target="_blank" rel="noreferrer" className="ce-ver-sitio">Ver en el sitio ↗</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
