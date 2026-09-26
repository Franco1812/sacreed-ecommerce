import PaginaTexto, { metadataPagina } from "@/components/PaginaTexto";

export const generateMetadata = () => metadataPagina("contacto");

export default function ContactoPage() {
  return <PaginaTexto slug="contacto" />;
}
