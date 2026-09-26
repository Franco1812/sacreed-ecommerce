"use client";

import { useState, type ReactNode } from "react";
import Icon from "@/components/Icons";

/** Acordeón de la ficha: título con + / −, una línea fina entre cada bloque. */
export default function PdpBlock({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`pdp-block${open ? " open" : ""}`}>
      <h2>
        <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span>{title}</span>
          <Icon name={open ? "minus" : "plus"} size={18} />
        </button>
      </h2>
      {open && <div className="pdp-block-content">{children}</div>}
    </div>
  );
}
