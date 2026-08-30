import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "Términos y condiciones — SACRED Wellness Club" };

export default function TerminosPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Términos y condiciones" }]} />

      <article className="content-page">
        <h1>Términos y condiciones</h1>
        <p className="pending-note">
          Texto legal pendiente de redacción — el brief lo deja como definición pendiente de la marca (§7, item 17). Esta página
          es el placeholder de ubicación en el sitemap; la aceptación explícita mediante casilla no premarcada en el checkout
          está prevista en el brief (§6.5) aunque el checkout todavía no está construido.
        </p>
      </article>
    </>
  );
}
