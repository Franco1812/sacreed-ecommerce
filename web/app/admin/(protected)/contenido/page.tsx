import { adminApiFetch } from "@/lib/admin-api";
import ContenidoEditor from "./ContenidoEditor";
import { CAMPOS_HOME, type HeroFotoValue, type HomeValues, type LineaValue, type MasVendidoValue, type ProductoOpcion } from "./campos";

async function getJson<T>(path: string): Promise<T> {
  const res = await adminApiFetch(path);
  if (!res.ok) throw new Error(`GET ${path}: ${res.status}`);
  return res.json();
}

export default async function AdminContenidoPage() {
  const [contenido, lineas, fotos, masVendidos, productos] = await Promise.all([
    getJson<Record<string, string>>("/contenido/home"),
    getJson<LineaValue[]>("/contenido/lineas"),
    getJson<HeroFotoValue[]>("/contenido/hero-imagenes"),
    getJson<{ slug: string; vendidos: number | null }[]>("/contenido/mas-vendidos"),
    getJson<{ slug: string; nombre: string; imagenes: { url: string }[] }[]>("/productos"),
  ]);

  // La API devuelve también id y updatedAt; el editor solo maneja los campos de texto.
  const home = Object.fromEntries(CAMPOS_HOME.map((campo) => [campo, contenido[campo] ?? ""])) as HomeValues;

  return (
    <div className="ce-root">
      <div className="admin-main-head">
        <h1>Contenido del sitio</h1>
      </div>
      <p className="ce-intro">Cambiá los textos, las fotos y los productos destacados de la portada. Cuando termines, tocá «Guardar cambios» y se ve en el sitio.</p>
      <ContenidoEditor
        home={home}
        lineas={lineas.map(({ id, nombre, texto }) => ({ id, nombre, texto }))}
        fotos={fotos.map(({ id, url, alt }) => ({ id, url, alt }))}
        masVendidos={masVendidos.map((m): MasVendidoValue => ({ slug: m.slug, vendidos: m.vendidos ? String(m.vendidos) : "" }))}
        productos={productos.map((p): ProductoOpcion => ({ slug: p.slug, nombre: p.nombre, foto: p.imagenes[0]?.url }))}
      />
    </div>
  );
}
