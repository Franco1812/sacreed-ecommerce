import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Renderiza el texto de las páginas editables desde el admin (Páginas). Formato simple, pensado para
 * que Cintia no necesite saber nada de código:
 *   ## Subtítulo          ### Pregunta          - ítem de lista          > cita
 *   **negrita**           ==resaltado==         [texto del link](/pagina)
 * Un renglón en blanco separa los párrafos. Todo se arma como elementos de React (nunca HTML crudo),
 * así que nada de lo que se escriba en el admin puede inyectar código en el sitio.
 */

type Bloque =
  | { tipo: "h2" | "h3"; texto: string }
  | { tipo: "p" | "quote"; lineas: string[] }
  | { tipo: "ul"; items: string[] };

function parsear(texto: string): Bloque[] {
  const bloques: Bloque[] = [];
  // Bloque de varios renglones que se está armando (párrafo, lista o cita); se cierra al cambiar de tipo o en un renglón en blanco.
  const abierto: { bloque: Bloque | null } = { bloque: null };
  const cerrar = () => {
    if (abierto.bloque) bloques.push(abierto.bloque);
    abierto.bloque = null;
  };

  for (const linea of texto.replace(/\r\n/g, "\n").split("\n")) {
    const l = linea.trim();
    if (l === "") {
      cerrar();
    } else if (l.startsWith("### ")) {
      cerrar();
      bloques.push({ tipo: "h3", texto: l.slice(4) });
    } else if (/^#{1,2} /.test(l)) {
      cerrar();
      bloques.push({ tipo: "h2", texto: l.replace(/^#{1,2} /, "") });
    } else if (l.startsWith("- ")) {
      if (abierto.bloque?.tipo !== "ul") {
        cerrar();
        abierto.bloque = { tipo: "ul", items: [] };
      }
      abierto.bloque.items.push(l.slice(2));
    } else if (l.startsWith(">")) {
      if (abierto.bloque?.tipo !== "quote") {
        cerrar();
        abierto.bloque = { tipo: "quote", lineas: [] };
      }
      abierto.bloque.lineas.push(l.replace(/^>\s?/, ""));
    } else {
      if (abierto.bloque?.tipo !== "p") {
        cerrar();
        abierto.bloque = { tipo: "p", lineas: [] };
      }
      abierto.bloque.lineas.push(l);
    }
  }
  cerrar();
  return bloques;
}

const LINK_SEGURO = /^(\/(?!\/)|https?:\/\/|mailto:|tel:)/;
const INLINE = /\*\*(.+?)\*\*|==(.+?)==|\[([^\]]+)\]\(([^)\s]+)\)/g;

function enLinea(texto: string): ReactNode[] {
  const nodos: ReactNode[] = [];
  let desde = 0;
  let n = 0;
  for (const m of texto.matchAll(INLINE)) {
    if (m.index > desde) nodos.push(texto.slice(desde, m.index));
    const key = n++;
    if (m[1] !== undefined) nodos.push(<strong key={key}>{enLinea(m[1])}</strong>);
    else if (m[2] !== undefined) nodos.push(<mark key={key}>{enLinea(m[2])}</mark>);
    else if (LINK_SEGURO.test(m[4])) {
      nodos.push(
        m[4].startsWith("/") ? (
          <Link key={key} href={m[4]} style={{ textDecoration: "underline" }}>{m[3]}</Link>
        ) : (
          <a key={key} href={m[4]} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>{m[3]}</a>
        )
      );
    } else {
      nodos.push(m[0]);
    }
    desde = m.index + m[0].length;
  }
  if (desde < texto.length) nodos.push(texto.slice(desde));
  return nodos;
}

function conSaltos(lineas: string[]): ReactNode[] {
  return lineas.map((linea, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {enLinea(linea)}
    </Fragment>
  ));
}

function renderBloque(b: Bloque, key: number, clase?: string): ReactNode {
  switch (b.tipo) {
    case "h2":
      return <h2 key={key}>{enLinea(b.texto)}</h2>;
    case "h3":
      return <h3 key={key}>{enLinea(b.texto)}</h3>;
    case "ul":
      return (
        <ul key={key}>
          {b.items.map((item, i) => <li key={i}>{enLinea(item)}</li>)}
        </ul>
      );
    case "quote":
      return <blockquote key={key}>{conSaltos(b.lineas)}</blockquote>;
    case "p":
      return <p key={key} className={clase}>{conSaltos(b.lineas)}</p>;
  }
}

/**
 * `institucional`: el primer párrafo y el último se muestran destacados (página Nuestro Origen).
 * `faq`: cada `###` abre una pregunta con su respuesta debajo (página Preguntas frecuentes).
 */
export default function Prosa({ texto, variante }: { texto: string; variante?: "institucional" | "faq" }) {
  const bloques = parsear(texto);

  if (variante === "faq") {
    const grupos: Bloque[][] = [];
    for (const b of bloques) {
      if (b.tipo === "h3" || grupos.length === 0) grupos.push([b]);
      else grupos[grupos.length - 1].push(b);
    }
    return (
      <>
        {grupos.map((g, i) =>
          g[0].tipo === "h3" ? (
            <div className="faq-item" key={i}>{g.map((b, j) => renderBloque(b, j))}</div>
          ) : (
            <Fragment key={i}>{g.map((b, j) => renderBloque(b, j))}</Fragment>
          )
        )}
      </>
    );
  }

  const parrafos = bloques.flatMap((b, i) => (b.tipo === "p" ? [i] : []));
  const primero = parrafos[0];
  const ultimo = parrafos[parrafos.length - 1];
  return (
    <>
      {bloques.map((b, i) =>
        renderBloque(b, i, variante === "institucional" && parrafos.length > 1 ? (i === primero ? "lead" : i === ultimo ? "close" : undefined) : undefined)
      )}
    </>
  );
}
