"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarPortada } from "../../actions";
import type { CampoTexto, GrupoTexto } from "../textos/campos";
import {
  BarraGuardar,
  Panel,
  PanelGrupo,
  Pestanas,
  VistaPrevia,
  estadoGuardado,
  useAvisoSinGuardar,
  useTextosEditables,
  validarTextos,
} from "../textos/editor-comun";
import { PREVIAS } from "../textos/previas";
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

/**
 * Pestañas en el orden en que se ven en la portada. Las que no son `hero`, `masvendidos` ni
 * `lineas` son grupos del registro de textos (api/src/contenido/contenido.registro.ts).
 */
const PESTANAS: { id: string; titulo: string }[] = [
  { id: "anuncios", titulo: "Barra de anuncios" },
  { id: "hero", titulo: "Portada" },
  { id: "franja", titulo: "Franja" },
  { id: "masvendidos", titulo: "Más vendidos" },
  { id: "pilares", titulo: "Nuestro Origen" },
  { id: "combos-home", titulo: "Combos" },
  { id: "banner", titulo: "Banner ritual" },
  { id: "pie", titulo: "Pie de página" },
  { id: "lineas", titulo: "Líneas de beneficio" },
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
  if (!home.heroCta1Label.trim()) return "El botón de la portada necesita un texto.";
  if (!home.heroCta1Href.trim()) return "El botón de la portada necesita una dirección a dónde llevar.";
  if (!home.beneficiosTitulo.trim()) return "La página «Comprá por beneficio» necesita un título.";
  if (lineas.some((l) => !l.nombre.trim())) return "Cada línea de beneficio necesita un nombre.";
  if (masVendidos.length > 0 && !home.masVendidosTitulo.trim()) return "La sección «Los más vendidos» necesita un título.";
  return null;
}

function PreviaHero({ home, foto }: { home: HomeValues; foto?: HeroFotoValue }) {
  return (
    <div className="pv pv-hero" style={foto ? { backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.5), rgba(0,0,0,.12) 65%, rgba(0,0,0,0)), url(${foto.url})` } : undefined}>
      {home.heroEyebrow.trim() && <span className="pv-tag">{home.heroEyebrow}</span>}
      <h4 className="pv-hero-titulo">
        {conSaltos(home.heroTitulo)}
        <br />
        {conSaltos(home.heroTituloEnfasis)}
      </h4>
      <p className="pv-p">{home.heroBajada}</p>
      <span className="pv-btn pv-btn-light">{home.heroCta1Label}</span>
    </div>
  );
}

function PreviaMasVendidos({ titulo, items }: { titulo: string; items: (ProductoOpcion | undefined)[] }) {
  if (items.length === 0) return <p className="pv-nada">Sin productos: la sección no aparece en la portada.</p>;
  return (
    <div className="pv">
      <div className="pv-head">
        <h4 className="pv-h">{titulo}</h4>
        <span className="pv-link">Ver todo</span>
      </div>
      <div className="pv-cards">
        {items.map((p, i) => (
          <div key={p?.slug ?? i} className="pv-card">
            <div className="pv-card-foto">
              {i === 0 && <span className="pv-badge">Más vendido</span>}
              {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de admin */}
              {p?.foto && <img src={p.foto} alt="" />}
            </div>
            <span>{p?.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviaLineas({ titulo, lineas }: { titulo: string; lineas: LineaValue[] }) {
  return (
    <div className="pv">
      <h4 className="pv-h">{titulo}</h4>
      <div className="pv-lineas">
        {lineas.map((l) => (
          <div key={l.id}>
            <strong>{l.nombre}</strong>
            <p className="pv-p">{l.texto}</p>
          </div>
        ))}
      </div>
      <p className="pv-nota">Los nombres también se usan en el menú, en el pie y en la ficha de cada producto.</p>
    </div>
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
  grupos,
  campos,
  base,
}: {
  home: HomeValues;
  lineas: LineaValue[];
  fotos: HeroFotoValue[];
  masVendidos: MasVendidoValue[];
  productos: ProductoOpcion[];
  /** Grupos del registro de textos que van en esta pantalla (anuncios, franja, pilares…). */
  grupos: GrupoTexto[];
  campos: CampoTexto[];
  base: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("hero");
  const [home, setHome] = useState(homeInicial);
  const [lineas, setLineas] = useState(lineasIniciales);
  const [masVendidos, setMasVendidos] = useState(masVendidosIniciales);
  const [aAgregar, setAAgregar] = useState("");
  const [guardado, setGuardado] = useState(() => JSON.stringify({ home: homeInicial, lineas: lineasIniciales, masVendidos: masVendidosIniciales }));
  const textos = useTextosEditables(campos, base);
  const [recienGuardado, setRecienGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contenidoCambiado = JSON.stringify({ home, lineas, masVendidos }) !== guardado;
  const sinGuardar = contenidoCambiado || textos.cambiadas.length > 0;
  useAvisoSinGuardar(sinGuardar);

  const productoPorSlug = new Map(productos.map((p) => [p.slug, p]));
  const disponibles = productos.filter((p) => !masVendidos.some((m) => m.slug === p.slug));
  const grupoPorId = new Map(grupos.map((g) => [g.id, g]));

  // Qué pestañas tienen cambios sin guardar (el puntito dorado).
  const inicial = JSON.parse(guardado) as { home: HomeValues; lineas: LineaValue[]; masVendidos: MasVendidoValue[] };
  const conCambios = new Set(textos.cambiadas.map((c) => c.grupo));
  const cambio = (claves: (keyof HomeValues)[]) => claves.some((k) => home[k] !== inicial.home[k]);
  if (cambio(["heroEyebrow", "heroTitulo", "heroTituloEnfasis", "heroBajada", "heroCta1Label", "heroCta1Href"])) conCambios.add("hero");
  if (cambio(["masVendidosTitulo"]) || JSON.stringify(masVendidos) !== JSON.stringify(inicial.masVendidos)) conCambios.add("masvendidos");
  if (cambio(["beneficiosTitulo"]) || JSON.stringify(lineas) !== JSON.stringify(inicial.lineas)) conCambios.add("lineas");

  function tocado() {
    setError(null);
    setRecienGuardado(false);
  }

  function setCampo(campo: keyof HomeValues, valor: string) {
    setHome((h) => ({ ...h, [campo]: valor }));
    tocado();
  }

  function setLinea(id: string, cambios: Partial<LineaValue>) {
    setLineas((ls) => ls.map((l) => (l.id === id ? { ...l, ...cambios } : l)));
    tocado();
  }

  function agregarMasVendido() {
    if (!aAgregar || masVendidos.length >= MAS_VENDIDOS_MAX) return;
    setMasVendidos((l) => [...l, { slug: aAgregar, vendidos: "" }]);
    setAAgregar("");
    tocado();
  }

  function moverMasVendido(indice: number, delta: -1 | 1) {
    setMasVendidos((l) => {
      const copia = [...l];
      [copia[indice], copia[indice + delta]] = [copia[indice + delta], copia[indice]];
      return copia;
    });
    tocado();
  }

  function guardar() {
    const problema = validar(home, lineas, masVendidos) ?? validarTextos(textos.cambiadas, textos.valores);
    if (problema) {
      setError(problema);
      return;
    }
    setError(null);
    startTransition(async () => {
      // Solo lo que cambió: tocar un texto del hero no vuelve a guardar las líneas ni los más vendidos.
      const res = await guardarPortada({
        home: JSON.stringify(home) !== JSON.stringify(inicial.home) ? home : undefined,
        lineas: lineas.filter((l, i) => JSON.stringify(l) !== JSON.stringify(inicial.lineas[i])),
        masVendidos:
          JSON.stringify(masVendidos) !== JSON.stringify(inicial.masVendidos)
            ? masVendidos.map((m) => ({ slug: m.slug, vendidos: m.vendidos.trim() === "" ? null : Number(m.vendidos) }))
            : undefined,
        textos: textos.cambiadas.length > 0 ? textos.aGuardar() : undefined,
      });
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar.");
        return;
      }
      setGuardado(JSON.stringify({ home, lineas, masVendidos }));
      textos.marcarGuardado();
      setRecienGuardado(true);
      router.refresh();
    });
  }

  const ctx = { ...textos.ctx, lineas: lineas.map((l) => l.nombre) };

  return (
    <div>
      <Pestanas
        pestanas={PESTANAS.filter((p) => ["hero", "masvendidos", "lineas"].includes(p.id) || grupoPorId.has(p.id)).map((p) => ({
          ...p,
          conCambios: conCambios.has(p.id),
        }))}
        activa={tab}
        onCambio={setTab}
      />

      {grupos.map((g) => {
        const previa = PREVIAS[g.id];
        return (
          <Panel key={g.id} id={g.id} activa={tab}>
            <PanelGrupo
              grupo={g}
              campos={campos}
              valores={textos.valores}
              onCambio={(clave, valor) => {
                textos.setValor(clave, valor);
                tocado();
              }}
              previa={previa && { titulo: previa.titulo, contenido: <previa.Componente {...ctx} /> }}
            />
          </Panel>
        );
      })}

      <Panel id="hero" activa={tab}>
        <div className="ce-layout">
          <div>
            <section className="ce-card">
              <h2>Textos</h2>
              <p className="ce-card-sub">Lo primero que se lee al entrar al sitio, sobre la foto.</p>
              <div className="admin-field">
                <label htmlFor="heroEyebrow">Etiqueta amarilla de arriba</label>
                <input id="heroEyebrow" value={home.heroEyebrow} onChange={(e) => setCampo("heroEyebrow", e.target.value)} />
                <span className="ce-hint">Si la dejás vacía, no se muestra.</span>
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
              <h2>Botón</h2>
              <p className="ce-card-sub">El botón que va debajo del texto.</p>
              <div className="admin-row">
                <div className="admin-field">
                  <label htmlFor="heroCta1Label">Texto del botón</label>
                  <input id="heroCta1Label" value={home.heroCta1Label} onChange={(e) => setCampo("heroCta1Label", e.target.value)} />
                </div>
                <SelectorDestino id="heroCta1Href" valor={home.heroCta1Href} onCambio={(v) => setCampo("heroCta1Href", v)} lineas={lineas} />
              </div>
            </section>

            <HeroFotos imagenes={fotos} />
          </div>

          <VistaPrevia titulo="Así se ve en la portada">
            <PreviaHero home={home} foto={fotos[0]} />
          </VistaPrevia>
        </div>
      </Panel>

      <Panel id="masvendidos" activa={tab}>
        <div className="ce-layout">
          <div>
            <section className="ce-card">
              <h2>Título de la sección</h2>
              <div className="admin-field">
                <label htmlFor="masVendidosTitulo">Título</label>
                <input id="masVendidosTitulo" value={home.masVendidosTitulo} onChange={(e) => setCampo("masVendidosTitulo", e.target.value)} />
              </div>
            </section>

            <section className="ce-card">
              <div className="ce-card-head">
                <h2>Productos de la sección</h2>
                <span className="ce-tag">{masVendidos.length} de {MAS_VENDIDOS_MAX}</span>
              </div>
              <p className="ce-card-sub">
                Elegí cuáles se muestran y en qué orden. El primero lleva la etiqueta «Más vendido». También aparecen en el menú. Si no hay ninguno,
                la sección no aparece en la portada.
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
                        <div className="ce-mv-acciones">
                          <button type="button" onClick={() => moverMasVendido(i, -1)} disabled={i === 0} aria-label={`Subir ${p?.nombre ?? m.slug}`} title="Subir">↑</button>
                          <button type="button" onClick={() => moverMasVendido(i, 1)} disabled={i === masVendidos.length - 1} aria-label={`Bajar ${p?.nombre ?? m.slug}`} title="Bajar">↓</button>
                          <button
                            type="button"
                            className="ce-mv-quitar"
                            onClick={() => {
                              setMasVendidos((l) => l.filter((x) => x.slug !== m.slug));
                              tocado();
                            }}
                          >
                            Quitar
                          </button>
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
            </section>
          </div>

          <VistaPrevia titulo="Así se ve en la portada">
            <PreviaMasVendidos titulo={home.masVendidosTitulo} items={masVendidos.map((m) => productoPorSlug.get(m.slug))} />
          </VistaPrevia>
        </div>
      </Panel>

      <Panel id="lineas" activa={tab}>
        <div className="ce-layout">
          <div>
            <section className="ce-card">
              <h2>Página «Comprá por beneficio»</h2>
              <p className="ce-card-sub">El título de la página que reúne las 4 líneas.</p>
              <div className="admin-field">
                <label htmlFor="beneficiosTitulo">Título</label>
                <input id="beneficiosTitulo" value={home.beneficiosTitulo} onChange={(e) => setCampo("beneficiosTitulo", e.target.value)} />
              </div>
            </section>

            <section className="ce-card">
              <h2>Las 4 líneas de beneficio</h2>
              <p className="ce-card-sub">Se muestran en esa página, en el menú, en el pie y en la ficha de cada producto.</p>
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

          <VistaPrevia titulo="Así se ve en «Comprá por beneficio»">
            <PreviaLineas titulo={home.beneficiosTitulo} lineas={lineas} />
          </VistaPrevia>
        </div>
      </Panel>

      <BarraGuardar estado={estadoGuardado({ pending, error, sinGuardar, recienGuardado })} pending={pending} sinGuardar={sinGuardar} onGuardar={guardar} />
    </div>
  );
}
