"use client";

import { useState, type ReactNode } from "react";

export default function PdpBlock({
  title,
  defaultOpen = false,
  destacado = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  destacado?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`pdp-block ${destacado ? "destacado" : ""} ${open ? "open" : ""}`}>
      <h2>{title}</h2>
      <div className="pdp-block-content">{children}</div>
      <span className="accordion-trigger" onClick={() => setOpen(true)} role="button" tabIndex={0}>
        Ver más +
      </span>
    </div>
  );
}
