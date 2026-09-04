import { adminApiFetch } from "@/lib/admin-api";
import { actualizarContenidoHome, actualizarLinea } from "../../actions";

interface ContenidoHomeDb {
  heroEyebrow: string;
  heroTitulo: string;
  heroTituloEnfasis: string;
  heroBajada: string;
  heroCta1Label: string;
  heroCta1Href: string;
  heroCta2Label: string;
  heroCta2Href: string;
  beneficiosEyebrow: string;
  beneficiosTitulo: string;
}

interface LineaDb {
  id: string;
  nombre: string;
  texto: string;
}

const CAMPOS_HOME = [
  "heroEyebrow",
  "heroTitulo",
  "heroTituloEnfasis",
  "heroBajada",
  "heroCta1Label",
  "heroCta1Href",
  "heroCta2Label",
  "heroCta2Href",
  "beneficiosEyebrow",
  "beneficiosTitulo",
] as const;

async function getContenido(): Promise<ContenidoHomeDb> {
  const res = await adminApiFetch("/contenido/home");
  if (!res.ok) throw new Error(`GET /contenido/home: ${res.status}`);
  return res.json();
}

async function getLineas(): Promise<LineaDb[]> {
  const res = await adminApiFetch("/contenido/lineas");
  if (!res.ok) throw new Error(`GET /contenido/lineas: ${res.status}`);
  return res.json();
}

async function guardar(formData: FormData) {
  "use server";

  const home: Record<string, string> = {};
  for (const campo of CAMPOS_HOME) home[campo] = String(formData.get(campo) ?? "");
  await actualizarContenidoHome(home);

  // Un hidden input "lineaId" por línea; así el mismo form guarda todo junto.
  for (const id of formData.getAll("lineaId").map(String)) {
    await actualizarLinea(id, {
      nombre: String(formData.get(`nombre-${id}`) ?? ""),
      texto: String(formData.get(`texto-${id}`) ?? ""),
    });
  }
}

export default async function AdminContenidoPage() {
  const [contenido, lineas] = await Promise.all([getContenido(), getLineas()]);

  return (
    <>
      <div className="admin-main-head">
        <h1>Contenido del sitio</h1>
      </div>

      <form action={guardar}>
        <div className="admin-card">
          <div className="admin-block">
            <h2>Portada — bloque principal</h2>
            <div className="admin-field">
              <label htmlFor="heroEyebrow">Línea chica de arriba</label>
              <input id="heroEyebrow" name="heroEyebrow" defaultValue={contenido.heroEyebrow} />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="heroTitulo">Título</label>
                <textarea id="heroTitulo" name="heroTitulo" defaultValue={contenido.heroTitulo} />
                <span className="admin-hint">Cada renglón nuevo se ve como un salto de línea en la página.</span>
              </div>
              <div className="admin-field">
                <label htmlFor="heroTituloEnfasis">Título destacado (verde, en itálica)</label>
                <textarea id="heroTituloEnfasis" name="heroTituloEnfasis" defaultValue={contenido.heroTituloEnfasis} />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="heroBajada">Texto debajo del título</label>
              <textarea id="heroBajada" name="heroBajada" defaultValue={contenido.heroBajada} />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="heroCta1Label">Botón principal</label>
                <input id="heroCta1Label" name="heroCta1Label" defaultValue={contenido.heroCta1Label} />
              </div>
              <div className="admin-field">
                <label htmlFor="heroCta1Href">A dónde lleva</label>
                <input id="heroCta1Href" name="heroCta1Href" defaultValue={contenido.heroCta1Href} />
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="heroCta2Label">Botón secundario</label>
                <input id="heroCta2Label" name="heroCta2Label" defaultValue={contenido.heroCta2Label} />
              </div>
              <div className="admin-field">
                <label htmlFor="heroCta2Href">A dónde lleva</label>
                <input id="heroCta2Href" name="heroCta2Href" defaultValue={contenido.heroCta2Href} />
              </div>
            </div>
          </div>

          <div className="admin-block">
            <h2>Sección &quot;Comprá por beneficio&quot;</h2>
            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="beneficiosEyebrow">Línea chica de arriba</label>
                <input id="beneficiosEyebrow" name="beneficiosEyebrow" defaultValue={contenido.beneficiosEyebrow} />
              </div>
              <div className="admin-field">
                <label htmlFor="beneficiosTitulo">Título</label>
                <input id="beneficiosTitulo" name="beneficiosTitulo" defaultValue={contenido.beneficiosTitulo} />
              </div>
            </div>
          </div>

          <div className="admin-block">
            <h2>Líneas de beneficio</h2>
            <p className="admin-hint" style={{ marginBottom: 20 }}>
              Se usan en la portada, en el menú, en el pie de página y en la ficha de cada producto.
            </p>
            {lineas.map((l) => (
              <div className="admin-linea-item" key={l.id}>
                <input type="hidden" name="lineaId" value={l.id} />
                <div className="admin-field">
                  <label htmlFor={`nombre-${l.id}`}>Nombre</label>
                  <input id={`nombre-${l.id}`} name={`nombre-${l.id}`} defaultValue={l.nombre} />
                </div>
                <div className="admin-field">
                  <label htmlFor={`texto-${l.id}`}>Descripción</label>
                  <textarea id={`texto-${l.id}`} name={`texto-${l.id}`} defaultValue={l.texto} />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="admin-btn">Guardar cambios</button>
        </div>
      </form>
    </>
  );
}
