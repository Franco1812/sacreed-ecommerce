import PaginaTexto, { metadataPagina } from "@/components/PaginaTexto";

export const generateMetadata = () => metadataPagina("politica-de-privacidad");

export default function PrivacidadPage() {
  return <PaginaTexto slug="politica-de-privacidad" />;
}
