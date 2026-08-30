import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { getAllCombos, getAllProductos } from "@/lib/data";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const util = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-util",
});

export const metadata: Metadata = {
  title: "SACRED Wellness Club",
  description: "Alacena funcional · Buenos Aires",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [productos, combos] = await Promise.all([getAllProductos(), getAllCombos()]);

  return (
    <html lang="es-AR" className={`${display.variable} ${util.variable}`}>
      <body>
        <CartProvider productos={productos} combos={combos}>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
