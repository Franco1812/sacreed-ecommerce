"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarContenido } from "../../actions";
import HeroFotos from "./HeroFotos";
import { MAS_VENDIDOS_MAX, type HeroFotoValue, type HomeValues, type LineaValue, type MasVendidoValue, type ProductoOpcion } from "./campos";

const OTRA_DIRECCION = "__otra__";

const DESTINOS_FIJOS = [
  { label: "Comprar por beneficio", href: "/comprar-por-beneficio" },
  { label: "Rituales AM / PM", href: "/rituales" },
  { label: "Combos sinérgicos", href: "/combos" },
  { label: "Nuestro origen", href: "/nuestro-origen" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
];

/** FOCO_VITALIDAD → foco-vitalidad (misma regla que LINEA_TO_SLUG en lib/data.ts). */
function slugDeLinea(id: string) {
  return id.toLowerCase().replace(/_/g, "-");
}

/** Los renglones nuevos del texto guardado se muestran como saltos de línea, igual que en la portada. */
function conSaltos(texto: string) {
  return texto.split("\n").map((linea, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {linea}
    </span>
  ));
}

function validar(home: HomeValues, lineas: LineaValue[], masVendidos: MasVendidoValue[]): string | null {
  if (!home.heroTitulo.trim()) return "El título de la portada no puede quedar vacío.";
  if (!home.heroCta1Label.trim() || !home.heroCta2Label.trim()) return "Los dos botones necesitan un texto.";
  if (!home.heroCta1Href.trim() || !home.heroCta2Href.trim()) return "Los dos botones necesitan una dirección a dónde llevar.";
  if (!home.beneficiosTitulo.trim()) return "La sección «Comprá por beneficio» necesita un título.";
  if (lineas.some((l) => !l.nombre.trim())) return "Cada línea de beneficio necesita un nombre.";
  if (masVendidos.length > 0 && !home.masVendidosTitulo.trim()) return "La sección «Los más vendidos» necesita un título.";
  if (masVendidos.some((m) => m.vendidos.trim() !== "" && !/^\d+$/.test(m.vendidos.trim()))) return "El número de «vendidos» tiene que ser un entero, sin puntos ni decimales.";
  return null;
}

function VistaPrevia({ home, foto }: { home: HomeValues; foto?: HeroFotoValue }) {
  return (
    <aside className="ce-preview" aria-label="Vista previa de la portada">
      <div className="ce-preview-label">
        <strong>Así se ve en la portada</strong>
        <span>Se actualiza mientras escribís</span>
      </div>
      <div className="ce-hero">
        <div className="ce-hero-text">
          <span className="ce-hero-eyebrow">{home.heroEyebrow}</span>
          <h3>
            {conSaltos(home.heroTitulo)}
            <br />
            {conSaltos(home.heroTituloEnfasis)}
          </h3>
          <p>{home.heroBajada}</p>
          <div className="ce-hero-btns">
            <span className="ce-hero-btn ce-hero-btn-solid">{home.heroCta1Label}</span>
            <span className="ce-hero-btn ce-hero-btn-ghost">{home.heroCta2Label}</span>
          </div>
        </div>
        <div className="ce-hero-foto">
          {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de admin */}
          {foto ? <img src={foto.url} alt="" /> : <span>Sin fotos</span>}
        </div>
      </div>
    </aside>
  );
}

function SelectorDestino({
  id,
  valor,
  onCambio,
  lineas,
}: {
  id: string;
  valor: string;
  onCambio: (href: string) => void;
  lineas: LineaValue[];
}) {
  const opciones = [
    ...DESTINOS_FIJOS,
    ...lineas.map((l) => ({ label: `Línea: ${l.nombre || l.id}`, href: `/comprar-por-beneficio/${slugDeLinea(l.id)}` })),
  ];
  const [otra, setOtra] = useState(!opciones.some((o) => o.href === valor));

  return (
    <div className="admin-field">
      <label htmlFor={id}>Lleva a</label>
      <select
        id={id}
        value={otra ? OTRA_DIRECCION : valor}
        onChange={(e) => {
          if (e.target.value === OTRA_DIRECCION) {
            setOtra(true);
          } else {
            setOtra(false);
            onCambio(e.target.value);
          }
        }}
      >
        {opciones.map((o) => (
          <option key={o.href} value={o.href}>{o.label}</option>
        ))}
        <option value={OTRA_DIRECCION}>Otra dirección…</option>
      </select>
      {otra && (
        <>
          <input
            aria-label="Dirección"
            value={valor}
            onChange={(e) => onCambio(e.target.value)}
            placeholder="/contacto o https://…"
          />
          <span className="ce-hint">Una página del sitio (empieza con /) o un link completo.</span>
        </>
      )}
    </div>
  );
}

export default function ContenidoEditor({
  home: homeInicial,
  lineas: lineasIniciales,
  fotos,
  masVendidos: masVendidosIniciales,
  productos,
}: {
  home: HomeValues;
  lineas: LineaValue[];
  fotos: HeroFotoValue[];
  masVendidos: MasVendidoValue[];
  productos: ProductoOpcion[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<"portada" | "beneficios" | "masvendidos">("portada");
  const [home, setHome] = useState(homeInicial);
  const [lineas, setLineas] = useState(lineasIniciales);
  const [masVendidos, setMasVendidos] = useState(masVendidosIniciales);
  const [aAgregar, setAAgregar] = useState("");
  const [guardado, setGuardado] = useState(() => JSON.stringify({ home: homeInicial, lineas: lineasIniciales, masVendidos: masVendidosIniciales }));
  const [recienGuardado, setRecienGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sinGuardar = JSON.stringify({ home, lineas, masVendidos }) !== guardado;
  const productoPorSlug = new Map(productos.map((p) => [p.slug, p]));
  const disponibles = productos.filter((p) => !masVendidos.some((m) => m.slug === p.slug));

  // Avisa antes de cerrar la pestaña si hay cambios sin guardar.
  useEffect(() => {
    if (!sinGuardar) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sinGuardar]);

  function setCampo(campo: keyof HomeValues, valor: string) {
    setHome((h) => ({ ...h, [campo]: valor }));
    setError(null);
  }

  function setLinea(id: string, cambios: Partial<LineaValue>) {
    setLineas((ls) => ls.map((l) => (l.id === id ? { ...l, ...cambios } : l)));
    setError(null);
  }

  function agregarMasVendido() {
    if (!aAgregar || masVendidos.length >= MAS_VENDIDOS_MAX) return;
    setMasVendidos((l) => [...l, { slug: aAgregar, vendidos: "" }]);
    setAAgregar("");
    setError(null);
  }

  function moverMasVendido(indice: number, delta: -1 | 1) {
    setMasVendidos((l) => {
      const copia = [...l];
      [copia[indice], copia[indice + delta]] = [copia[indice + delta], copia[indice]];
      return copia;
    });
    setError(null);
  }

  function guardar() {
    const problema = validar(home, lineas, masVendidos);
    if (problema) {
      setError(problema);
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await guardarContenido(
        home,
        lineas,
        masVendidos.map((m) => ({ slug: m.slug, vendidos: m.vendidos.trim() === "" ? null : Number(m.vendidos) }))
      );
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar.");
        return;
      }
      setGuardado(JSON.stringify({ home, lineas, masVendidos }));
      setRecienGuardado(true);
      router.refresh();
    });
  }

  let estado: { texto: string; tono: "info" | "aviso" | "ok" | "error" };
  if (pending) estado = { texto: "Guardando…", tono: "info" };
  else if (error) estado = { texto: error, tono: "error" };
  else if (sinGuardar) estado = { texto: "Tenés cambios sin guardar", tono: "aviso" };
  else if (recienGuardado) estado = { texto: "✓ Guardado. Ya se ve en el sitio.", tono: "ok" };
  else estado = { texto: "Todo guardado", tono: "info" };

  return (
    <div>
      <div className="ce-tabs" role="tablist" aria-label="Secciones del contenido">
        <button type="button" role="tab" id="tab-portada" aria-selected={tab === "portada"} aria-controls="panel-portada" className="ce-tab" onClick={() => setTab("portada")}>
          Portada
        </button>
        <button type="button" role="tab" id="tab-beneficios" aria-selected={tab === "beneficios"} aria-controls="panel-beneficios" className="ce-tab" onClick={() => setTab("beneficios")}>
          Beneficios
        </button>
        <button type="button" role="tab" id="tab-masvendidos" aria-selected={tab === "masvendidos"} aria-controls="panel-masvendidos" className="ce-tab" onClick={() => setTab("masvendidos")}>
          Más vendidos
        </button>
      </div>

      {/* Ambos paneles quedan montados (solo se oculta uno) para no perder lo escrito al cambiar de pestaña. */}
      <div role="tabpanel" id="panel-portada" aria-labelledby="tab-portada" hidden={tab !== "portada"}>
        <div className="ce-layout">
          <div>
            <section className="ce-card">
              <h2>Textos</h2>
              <p className="ce-card-sub">Lo primero que se lee al entrar al sitio.</p>
              <div className="admin-field">
                <label htmlFor="heroEyebrow">Frase chica de arriba</label>
                <input id="heroEyebrow" value={home.heroEyebrow} onChange={(e) => setCampo("heroEyebrow", e.target.value)} />
              </div>
              <div className="admin-field">
                <label htmlFor="heroTitulo">Título, primera parte</label>
                <textarea id="heroTitulo" rows={2} value={home.heroTitulo} onChange={(e) => setCampo("heroTitulo", e.target.value)} />
                <span className="ce-hint">Con Enter armás un renglón nuevo.</span>
              </div>
              <div className="admin-field">
                <label htmlFor="heroTituloEnfasis">Título, segunda parte</label>
                <textarea id="heroTituloEnfasis" rows={2} value={home.heroTituloEnfasis} onChange={(e) => setCampo("heroTituloEnfasis", e.target.value)} />
                <span className="ce-hint">Va justo debajo de la primera, en el mismo título.</span>
              </div>
              <div className="admin-field">
                <label htmlFor="heroBajada">Texto debajo del título</label>
                <textarea id="heroBajada" rows={3} value={home.heroBajada} onChange={(e) => setCampo("heroBajada", e.target.value)} />
              </div>
            </section>

            <section className="ce-card">
              <h2>Botones</h2>
              <p className="ce-card-sub">Los dos botones que van debajo del texto.</p>
              <div className="ce-boton">
                <h3>Botón principal</h3>
                <div className="admin-row">
                  <div className="admin-field">
                    <label htmlFor="heroCta1Label">Texto del botón</label>
                    <input id="heroCta1Label" value={home.heroCta1Label} onChange={(e) => setCampo("heroCta1Label", e.target.value)} />
                  </div>
                  <SelectorDestino id="heroCta1Href" valor={home.heroCta1Href} onCambio={(v) => setCampo("heroCta1Href", v)} lineas={lineas} />
                </div>
              </div>
              <div className="ce-boton">
                <h3>Botón secundario</h3>
                <div className="admin-row">
                  <div className="admin-field">
                    <label htmlFor="heroCta2Label">Texto del botón</label>
                    <input id="heroCta2Label" value={home.heroCta2Label} onChange={(e) => setCampo("heroCta2Label", e.target.value)} />
                  </div>
                  <SelectorDestino id="heroCta2Href" valor={home.heroCta2Href} onCambio={(v) => setCampo("heroCta2Href", v)} lineas={lineas} />
                </div>
              </div>
            </section>

            <HeroFotos imagenes={fotos} />
          </div>

          <VistaPrevia home={home} foto={fotos[0]} />
        </div>
      </div>

      <div role="tabpanel" id="panel-beneficios" aria-labelledby="tab-beneficios" hidden={tab !== "beneficios"}>
        <div className="ce-columna">
          <section className="ce-card">
            <h2>Encabezado de la sección</h2>
            <p className="ce-card-sub">Es el título que va sobre las 4 líneas de beneficio, más abajo en la portada.</p>
            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="beneficiosEyebrow">Frase chica de arriba</label>
                <input id="beneficiosEyebrow" value={home.beneficiosEyebrow} onChange={(e) => setCampo("beneficiosEyebrow", e.target.value)} />
              </div>
              <div className="admin-field">
                <label htmlFor="beneficiosTitulo">Título</label>
                <input id="beneficiosTitulo" value={home.beneficiosTitulo} onChange={(e) => setCampo("beneficiosTitulo", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="ce-card">
            <h2>Las 4 líneas de beneficio</h2>
            <p className="ce-card-sub">Se muestran en la portada, en el menú y en la ficha de cada producto.</p>
            {lineas.map((l, i) => (
              <div className="ce-linea" key={l.id}>
                <span className="ce-linea-num">{i + 1}</span>
                <div>
                  <div className="admin-field">
                    <label htmlFor={`nombre-${l.id}`}>Nombre</label>
                    <input id={`nombre-${l.id}`} value={l.nombre} onChange={(e) => setLinea(l.id, { nombre: e.target.value })} />
                  </div>
                  <div className="admin-field">
                    <label htmlFor={`texto-${l.id}`}>Descripción</label>
                    <textarea id={`texto-${l.id}`} rows={3} value={l.texto} onChange={(e) => setLinea(l.id, { texto: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      <div role="tabpanel" id="panel-masvendidos" aria-labelledby="tab-masvendidos" hidden={tab !== "masvendidos"}>
        <div className="ce-columna">
          <section className="ce-card">
            <h2>Encabezado de la sección</h2>
            <p className="ce-card-sub">El título que va sobre los productos, en la portada.</p>
            <div className="admin-row">
              <div className="admin-field">
                <label htmlFor="masVendidosEyebrow">Frase chica de arriba</label>
                <input id="masVendidosEyebrow" value={home.masVendidosEyebrow} onChange={(e) => setCampo("masVendidosEyebrow", e.target.value)} />
              </div>
              <div className="admin-field">
                <label htmlFor="masVendidosTitulo">Título</label>
                <input id="masVendidosTitulo" value={home.masVendidosTitulo} onChange={(e) => setCampo("masVendidosTitulo", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="ce-card">
            <div className="ce-card-head">
              <h2>Productos de la sección</h2>
              <span className="ce-tag">{masVendidos.length} de {MAS_VENDIDOS_MAX}</span>
            </div>
            <p className="ce-card-sub">
              Elegí cuáles se muestran y en qué orden. El primero lleva la etiqueta «Más vendido». Si no hay ninguno, la sección no aparece en la portada.
            </p>

            {masVendidos.length === 0 ? (
              <p className="ce-vacio">Todavía no elegiste ningún producto.</p>
            ) : (
              <ol className="ce-mv-lista">
                {masVendidos.map((m, i) => {
                  const p = productoPorSlug.get(m.slug);
                  return (
                    <li className="ce-mv-item" key={m.slug}>
                      <span className="ce-mv-num">{i + 1}</span>
                      <div className="ce-mv-foto">
                        {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de admin */}
                        {p?.foto ? <img src={p.foto} alt="" /> : <span>Sin foto</span>}
                      </div>
                      <div className="ce-mv-nombre">{p?.nombre ?? m.slug}</div>
                      <label className="ce-mv-vendidos">
                        <span>Vendidos (opcional)</span>
                        <input
                          type="number"
                          min={0}
                          inputMode="numeric"
                          placeholder="Sin número"
                          value={m.vendidos}
                          onChange={(e) => {
                            setMasVendidos((l) => l.map((x) => (x.slug === m.slug ? { ...x, vendidos: e.target.value } : x)));
                            setError(null);
                          }}
                        />
                      </label>
                      <div className="ce-mv-acciones">
                        <button type="button" onClick={() => moverMasVendido(i, -1)} disabled={i === 0} aria-label={`Subir ${p?.nombre ?? m.slug}`} title="Subir">↑</button>
                        <button type="button" onClick={() => moverMasVendido(i, 1)} disabled={i === masVendidos.length - 1} aria-label={`Bajar ${p?.nombre ?? m.slug}`} title="Bajar">↓</button>
                        <button type="button" className="ce-mv-quitar" onClick={() => setMasVendidos((l) => l.filter((x) => x.slug !== m.slug))}>Quitar</button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="ce-mv-agregar">
              <div className="admin-field">
                <label htmlFor="mv-agregar">Agregar un producto</label>
                <select id="mv-agregar" value={aAgregar} onChange={(e) => setAAgregar(e.target.value)} disabled={masVendidos.length >= MAS_VENDIDOS_MAX || disponibles.length === 0}>
                  <option value="">{masVendidos.length >= MAS_VENDIDOS_MAX ? `Llegaste al máximo de ${MAS_VENDIDOS_MAX}` : "Elegir un producto…"}</option>
                  {disponibles.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="admin-btn-ghost" onClick={agregarMasVendido} disabled={!aAgregar}>Agregar</button>
            </div>
            <p className="ce-hint" style={{ marginTop: 14 }}>
              El número de «vendidos» es el «+N vendidos» que se ve en la tarjeta. Si lo dejás vacío, la tarjeta no muestra ningún número.
            </p>
          </section>
        </div>
      </div>

      <div className="ce-savebar">
        <span className="ce-estado" data-tono={estado.tono} role="status" aria-live="polite">{estado.texto}</span>
        <a href="/" target="_blank" rel="noreferrer" className="ce-ver-sitio">Ver el sitio ↗</a>
        <button type="button" className="admin-btn" onClick={guardar} disabled={pending || !sinGuardar}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
