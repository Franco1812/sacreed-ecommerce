import PaginaTexto, { metadataPagina } from "@/components/PaginaTexto";

export const generateMetadata = () => metadataPagina("terminos-y-condiciones");

export default function TerminosPage() {
  return <PaginaTexto slug="terminos-y-condiciones" />;
}
