import type { Metadata } from "next";
import { Instrument_Sans, Newsreader, Courier_Prime } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { getAllCombos, getAllProductos, getLineas } from "@/lib/data";

// Tres roles, como en la referencia (Moon Juice): sans para cuerpo/nav,
// serif editorial para títulos, mono tipo máquina de escribir para etiquetas tracked/uppercase.
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SACRED Wellness Club",
  description: "Alacena funcional · Buenos Aires",
};

// El catálogo vive en una base real vía la API — no tiene sentido pre-renderizar
// en build time (ni siquiera es posible: la API no está levantada durante el build).
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [productos, combos, lineas] = await Promise.all([getAllProductos(), getAllCombos(), getLineas()]);

  return (
    <html lang="es-AR" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <CartProvider productos={productos} combos={combos}>
          <Header lineas={lineas} />
          {children}
          <Footer lineas={lineas} />
        </CartProvider>
      </body>
    </html>
  );
}
