import PaginaTexto, { metadataPagina } from "@/components/PaginaTexto";

export const generateMetadata = () => metadataPagina("preguntas-frecuentes");

export default function PreguntasFrecuentesPage() {
  return <PaginaTexto slug="preguntas-frecuentes" variante="faq" />;
}
