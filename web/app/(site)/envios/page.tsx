import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "Envíos y entregas — SACRED Wellness Club" };

export default function EnviosPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Envíos y entregas" }]} />

      <article className="content-page">
        <h1>Envíos y entregas</h1>

        <p className="pending-note">Los montos entre corchetes son placeholders — el brief los deja como definición pendiente de la marca (§7).</p>

        <h2>Reparto propio en zona — todos los viernes</h2>
        <p>Recorremos la zona barrio por barrio, todos los viernes. Superando el mínimo de compra, el envío corre por nuestra cuenta. Si estás fuera del radio, despachamos a todo el país.</p>
        <ul>
          <li>Envío sin cargo superando $[mínimo] de compra.</li>
          <li>Por debajo del mínimo, costo fijo de reparto.</li>
          <li>Elegís tu barrio de una lista cerrada en el checkout.</li>
          <li>Corte de pedidos: miércoles 23:59 (propuesta) para entrar en el reparto del viernes. Un pedido posterior pasa al viernes siguiente.</li>
          <li>Te avisamos por correo o WhatsApp el jueves, confirmando que tu pedido sale al día siguiente.</li>
        </ul>

        <h2>Fuera de zona — resto del país</h2>
        <p>Despachamos a todo el país por Correo Argentino y Andreani. Cotización automática por código postal. Envío sin cargo a partir de un monto mayor, a definir.</p>
        <p>Te enviamos el número de seguimiento por correo al despachar.</p>
      </article>
    </>
  );
}
