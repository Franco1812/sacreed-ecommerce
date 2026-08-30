import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "Cambios y devoluciones — SACRED Wellness Club" };

export default function CambiosDevolucionesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Cambios y devoluciones" }]} />

      <article className="content-page">
        <h1>Cambios y devoluciones</h1>
        <p className="pending-note">
          Plazos y procedimiento pendientes de definir por la marca (§7, item 17). Distinto del{" "}
          <a href="/boton-de-arrepentimiento" style={{ textDecoration: "underline" }}>botón de arrepentimiento</a>, que cubre la
          revocación de la compra dentro de los primeros 10 días por ley, sin necesidad de motivo.
        </p>
      </article>
    </>
  );
}
