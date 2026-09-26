import Breadcrumbs from "@/components/Breadcrumbs";
import Prosa from "@/components/Prosa";
import { getPagina } from "@/lib/textos";
import type { ReactNode } from "react";

/** Título de la pestaña del navegador de una página editable desde el admin (Páginas). */
export async function metadataPagina(slug: string) {
  const { titulo } = await getPagina(slug);
  return { title: `${titulo} — SACRED Wellness Club` };
}

/**
 * Página de texto cuyo título y cuerpo edita Cintia en Admin → Páginas. `children` va debajo
 * del texto (por ejemplo, el formulario del botón de arrepentimiento).
 */
export default async function PaginaTexto({
  slug,
  variante,
  children,
}: {
  slug: string;
  variante?: "institucional" | "faq";
  children?: ReactNode;
}) {
  const { titulo, cuerpo } = await getPagina(slug);

  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: titulo }]} />

      {variante === "institucional" ? (
        <article className="institucional">
          <Prosa texto={cuerpo} variante="institucional" />
          {children}
        </article>
      ) : (
        <article className="content-page">
          <h1>{titulo}</h1>
          <Prosa texto={cuerpo} variante={variante} />
          {children}
        </article>
      )}
    </>
  );
}
