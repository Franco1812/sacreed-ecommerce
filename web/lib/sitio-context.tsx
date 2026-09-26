"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Ajustes } from "./data";
import type { Textos } from "./textos";

interface SitioContextValue {
  /** Textos editables ya con las marcas resueltas (ver lib/textos.ts). */
  textos: Textos;
  ajustes: Ajustes;
}

const SitioContext = createContext<SitioContextValue | null>(null);

/** Lo que Cintia edita desde el admin, disponible para los componentes cliente (carrito, checkout). Se carga server-side en el layout. */
export function SitioProvider({ textos, ajustes, children }: SitioContextValue & { children: ReactNode }) {
  return <SitioContext.Provider value={{ textos, ajustes }}>{children}</SitioContext.Provider>;
}

export function useSitio() {
  const ctx = useContext(SitioContext);
  if (!ctx) throw new Error("useSitio debe usarse dentro de <SitioProvider>");
  return ctx;
}
