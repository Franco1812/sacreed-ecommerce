import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "Política de privacidad — SACRED Wellness Club" };

export default function PrivacidadPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Política de privacidad" }]} />

      <article className="content-page">
        <h1>Política de privacidad</h1>
        <p className="pending-note">
          Texto pendiente de redacción — el brief lo deja como definición pendiente de la marca (§7, item 17), y exige que esté
          conforme a la Ley 25.326 de Protección de Datos Personales (§6.5).
        </p>
      </article>
    </>
  );
}
