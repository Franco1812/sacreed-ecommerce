import Link from "next/link";
import { notFound } from "next/navigation";
import { adminApiFetch } from "@/lib/admin-api";
import PaginaEditor from "../PaginaEditor";

export default async function AdminEditarPaginaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await adminApiFetch(`/contenido/paginas/${slug}`);
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`GET /contenido/paginas/${slug}: ${res.status}`);
  const pagina: { slug: string; ruta: string; titulo: string; cuerpo: string; editada: boolean } = await res.json();

  return (
    <div className="ce-root">
      <div className="admin-main-head">
        <h1>{pagina.titulo}</h1>
        <Link href="/admin/paginas" className="admin-btn-ghost">← Todas las páginas</Link>
      </div>
      <PaginaEditor slug={pagina.slug} ruta={pagina.ruta} titulo={pagina.titulo} cuerpo={pagina.cuerpo} editada={pagina.editada} />
    </div>
  );
}
