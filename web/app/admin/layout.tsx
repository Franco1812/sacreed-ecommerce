import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./admin.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const util = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-util",
});

export const metadata: Metadata = {
  title: "Admin — SACRED",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${util.variable}`}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
