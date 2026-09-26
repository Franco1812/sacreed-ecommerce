import PaginaTexto, { metadataPagina } from "@/components/PaginaTexto";

export const generateMetadata = () => metadataPagina("cambios-y-devoluciones");

export default function CambiosDevolucionesPage() {
  return <PaginaTexto slug="cambios-y-devoluciones" />;
}
