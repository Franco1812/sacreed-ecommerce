import PaginaTexto, { metadataPagina } from "@/components/PaginaTexto";

export const generateMetadata = () => metadataPagina("envios");

export default function EnviosPage() {
  return <PaginaTexto slug="envios" />;
}
