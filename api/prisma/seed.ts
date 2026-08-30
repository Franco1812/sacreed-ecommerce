/**
 * Seed inicial — convierte el catálogo mock (seed-data.ts, copy ya
 * aprobado del brief §5.8/§5.9) en filas reales de la base de datos.
 * Correr con: npx prisma db seed
 */
import "dotenv/config";
import { PrismaClient, LineaBeneficio, Ritual, type Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PRODUCTOS, COMBOS, type LineaSlug, type RitualModo } from "./seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const LINEA_MAP: Record<LineaSlug, LineaBeneficio> = {
  "foco-vitalidad": LineaBeneficio.FOCO_VITALIDAD,
  "longevidad-glow": LineaBeneficio.LONGEVIDAD_GLOW,
  "salud-intestinal": LineaBeneficio.SALUD_INTESTINAL,
  "calma-alquimica": LineaBeneficio.CALMA_ALQUIMICA,
};

const RITUAL_MAP: Record<RitualModo, Ritual> = {
  am: Ritual.AM,
  pm: Ritual.PM,
};

async function main() {
  console.log(`Seed: ${PRODUCTOS.length} productos, ${COMBOS.length} combos...`);

  for (const p of PRODUCTOS) {
    await prisma.producto.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        nombre: p.nombre,
        formulaSubtitulo: p.formulaSubtitulo,
        linea: LINEA_MAP[p.linea],
        ritual: p.ritual.map((r) => RITUAL_MAP[r]),
        orden: p.orden,
        momentoSugerido: p.momentoSugerido,
        descripcion: p.descripcion,
        laFormula: (p.laFormula as unknown as Prisma.InputJsonValue) ?? undefined,
        beneficios: p.beneficios,
        ritualDeUso: p.ritualDeUso,
        ingredientes: p.ingredientes,
        notaDePureza: p.notaDePureza,
        origen: p.origen,
        precio: p.precio,
        formato: p.formato,
        stock: p.stock,
        destacado: p.destacado,
        nombrePendiente: p.nombrePendiente ?? false,
      },
    });
  }

  for (const c of COMBOS) {
    await prisma.combo.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        nombre: c.nombre,
        bajada: c.bajada,
        ritual: c.ritual.map((r) => RITUAL_MAP[r]),
        porQueSePotencian: c.porQueSePotencian,
        copyAprobado: c.copyAprobado,
        precio: c.precio,
        stock: c.stock,
        productos: {
          create: await Promise.all(
            c.productos.map(async (slug) => {
              const producto = await prisma.producto.findUniqueOrThrow({ where: { slug } });
              return { productoId: producto.id };
            })
          ),
        },
      },
    });
  }

  console.log("Seed listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
