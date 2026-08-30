import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "Nuestro Origen — SACRED Wellness Club" };

export default function NuestroOrigenPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Nuestro Origen" }]} />

      <article className="institucional">
        <p className="lead">No nos propusimos crear una marca más de productos naturales.</p>

        <blockquote>
          ¿Cómo podemos hacer de <mark>un simple momento una experiencia</mark> de bienestar profunda, <mark>que forme parte de la vida cotidiana</mark> <mark>sin</mark> esfuerzo?
        </blockquote>

        <p>Esta pregunta surgió tras años de buscar respuestas en el ritmo acelerado de la vida moderna, donde nos acostumbramos a vivir corriendo tras la siguiente taza de café industrial, agotados y sobreestimulados al mismo tiempo. Sabíamos que ese no era el camino hacia la plenitud ni hacia la presencia.</p>

        <p>Decidimos volver al origen. Comenzamos a buscar ingredientes puros, sin maltodextrinas, sin endulzantes artificiales y sin procesos que apaguen nuestra fuerza biológica.</p>

        <p className="close">Nacimos para compartir la energía transformadora de la nutrición ancestral y el biohacking consciente. Creemos que cada taza, cada cucharada y cada pausa es una oportunidad para recordar quién sos y regalarte un rito sagrado de autocuidado.</p>

        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Link href="/comprar-por-beneficio" className="link-all">Ir a la tienda</Link>
        </div>
      </article>
    </>
  );
}
