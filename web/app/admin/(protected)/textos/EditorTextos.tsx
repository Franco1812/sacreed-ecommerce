"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarTextos } from "../../actions";
import type { CampoTexto, GrupoTexto } from "./campos";
import { BarraGuardar, Panel, PanelGrupo, Pestanas, estadoGuardado, useAvisoSinGuardar, useTextosEditables, validarTextos } from "./editor-comun";
import { PREVIAS } from "./previas";

/**
 * Editor genérico de los textos del sitio: arma una pestaña por grupo del registro de la API
 * (api/src/contenido/contenido.registro.ts), con la vista previa de previas.tsx al costado.
 * Sumar un texto nuevo no requiere tocar el admin (solo la vista previa, si se quiere que aparezca ahí).
 */
export default function EditorTextos({ grupos, campos, base }: { grupos: GrupoTexto[]; campos: CampoTexto[]; base: Record<string, string> }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState(grupos[0]?.id ?? "");
  const textos = useTextosEditables(campos, base);
  const [recienGuardado, setRecienGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sinGuardar = textos.cambiadas.length > 0;
  const gruposConCambios = new Set(textos.cambiadas.map((c) => c.grupo));
  useAvisoSinGuardar(sinGuardar);

  function setValor(clave: string, valor: string) {
    textos.setValor(clave, valor);
    setError(null);
    setRecienGuardado(false);
  }

  function guardar() {
    const problema = validarTextos(textos.cambiadas, textos.valores);
    if (problema) {
      setError(problema);
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await guardarTextos(textos.aGuardar());
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar.");
        return;
      }
      textos.marcarGuardado();
      setRecienGuardado(true);
      router.refresh();
    });
  }

  return (
    <div>
      <Pestanas
        pestanas={grupos.map((g) => ({ id: g.id, titulo: g.titulo, conCambios: gruposConCambios.has(g.id) }))}
        activa={tab}
        onCambio={setTab}
      />

      {grupos.map((g) => {
        const previa = PREVIAS[g.id];
        return (
          <Panel key={g.id} id={g.id} activa={tab}>
            <PanelGrupo
              grupo={g}
              campos={campos}
              valores={textos.valores}
              onCambio={setValor}
              previa={previa && { titulo: previa.titulo, contenido: <previa.Componente {...textos.ctx} /> }}
            />
          </Panel>
        );
      })}

      <BarraGuardar estado={estadoGuardado({ pending, error, sinGuardar, recienGuardado })} pending={pending} sinGuardar={sinGuardar} onGuardar={guardar} />
    </div>
  );
}
