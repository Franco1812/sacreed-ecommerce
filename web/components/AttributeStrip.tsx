import Icon, { type IconName } from "@/components/Icons";
import { getTextos } from "@/lib/textos";

// Cada renglón lleva siempre el mismo ícono (por posición); el texto lo edita Cintia en Admin → Textos.
const ICONOS: IconName[] = ["pin", "leaf", "sparkle", "clock", "drop", "check"];

/** Franja de atributos en movimiento continuo (home y ficha de producto). */
export default async function AttributeStrip() {
  const t = await getTextos();
  const atributos = ICONOS.map((icono, i) => ({ icono, texto: t[`franja.${i + 1}`] ?? "" })).filter((a) => a.texto.trim());
  if (atributos.length === 0) return null;

  return (
    <div className="marquee anchor">
      <div className="marquee-track">
        {[0, 1].map((copia) => (
          <div className="marquee-group" key={copia} aria-hidden={copia === 1 ? true : undefined}>
            {[...atributos, ...atributos].map((a, i) => (
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
