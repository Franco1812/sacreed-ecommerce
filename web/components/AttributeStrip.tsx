import Icon, { type IconName } from "@/components/Icons";

const ATRIBUTOS: { icono: IconName; texto: string }[] = [
  { icono: "pin", texto: "100% trazable" },
  { icono: "leaf", texto: "Sin rellenos ni ingredientes innecesarios" },
  { icono: "sparkle", texto: "Upgrade de bienestar" },
  { icono: "clock", texto: "Slow living" },
];

/** Franja de atributos en movimiento continuo (home y ficha de producto). */
export default function AttributeStrip() {
  return (
    <div className="marquee anchor">
      <div className="marquee-track">
        {[0, 1].map((copia) => (
          <div className="marquee-group" key={copia} aria-hidden={copia === 1 ? true : undefined}>
            {[...ATRIBUTOS, ...ATRIBUTOS].map((a, i) => (
              <span key={i}>
                <Icon name={a.icono} size={24} />
                {a.texto}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
