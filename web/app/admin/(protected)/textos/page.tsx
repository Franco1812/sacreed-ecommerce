import { adminApiFetch } from "@/lib/admin-api";
import EditorTextos from "./EditorTextos";
import type { CampoTexto, GrupoTexto } from "./campos";

export default async function AdminTextosPage() {
  const res = await adminApiFetch("/contenido/textos/campos");
  if (!res.ok) throw new Error(`GET /contenido/textos/campos: ${res.status}`);
  const { grupos, campos }: { grupos: GrupoTexto[]; campos: CampoTexto[] } = await res.json();
  const gruposTextos = grupos.filter((g) => g.pantalla === "textos");

  return (
    <div className="ce-root">
      <div className="admin-main-head">
        <h1>Textos del sitio</h1>
      </div>
      <p className="ce-intro">
        Todos los textos fijos del sitio: anuncios, franja, pie de página, ficha de producto, carrito y más. Los títulos y textos de la portada
        están en «Contenido». Cuando termines, tocá «Guardar cambios» y se ve en el sitio.
      </p>
      <EditorTextos grupos={gruposTextos} campos={campos.filter((c) => gruposTextos.some((g) => g.id === c.grupo))} />
    </div>
  );
}
