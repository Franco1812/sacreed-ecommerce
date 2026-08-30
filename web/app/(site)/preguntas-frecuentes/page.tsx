import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "Preguntas frecuentes — SACRED Wellness Club" };

const FAQ_MOCK = [
  {
    pregunta: "¿Cómo se calcula el envío?",
    respuesta: "En la zona de reparto propio, entregamos los viernes y el envío es sin cargo superando un monto mínimo (a definir). Fuera de zona, despachamos por Correo Argentino o Andreani con cotización por código postal.",
  },
  {
    pregunta: "¿Qué medios de pago aceptan?",
    respuesta: "Mercado Pago (tarjeta en cuotas o dinero en cuenta) y transferencia bancaria con descuento. El detalle final se confirma en el checkout.",
  },
  {
    pregunta: "¿Puedo devolver un producto si no me convenció?",
    respuesta: "Sí, tenés 10 días corridos desde que lo recibís para arrepentirte de la compra sin dar motivo — ver el botón de arrepentimiento.",
  },
];

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Preguntas frecuentes" }]} />

      <article className="content-page">
        <h1>Preguntas frecuentes</h1>
        <p className="pending-note">El listado real de preguntas y respuestas está pendiente de definición por la marca (§7, item 19). Estas son de ejemplo.</p>

        {FAQ_MOCK.map((item) => (
          <div className="faq-item" key={item.pregunta}>
            <h3>{item.pregunta}</h3>
            <p>{item.respuesta}</p>
          </div>
        ))}
      </article>
    </>
  );
}
