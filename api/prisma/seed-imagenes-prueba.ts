/**
 * Carga puntual de fotos de prueba (packshots reales que mandó Cintia por
 * WhatsApp) para los productos que ya tienen foto — el resto sigue sin
 * imágenes hasta que llegue el resto del catálogo. Correr una sola vez con:
 * npx tsx prisma/seed-imagenes-prueba.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const BASE_URL = "https://quzjgheuefatgczvqkcv.supabase.co/storage/v1/object/public/productos";

const IMAGENES: Record<string, { archivo: string; alt: string }[]> = {
  "blend-calma": [
    { archivo: "blend-calma-1.jpg", alt: "Paquete de Blend Calma — cacao, reishi, ashwagandha, rhodiola y pétalos de rosa" },
    { archivo: "blend-calma-2.jpg", alt: "Blend Calma sostenido en la mano, ritual de la noche" },
  ],
  "blend-golden-milk": [
    { archivo: "blend-golden-milk-1.jpg", alt: "Tubo de Blend Golden Milk con cúrcuma, jengibre y especias" },
  ],
  "blend-colageno-hibiscus": [
    { archivo: "blend-colageno-hibiscus-1.jpg", alt: "Tubo de Blend Colágeno Bovino + Extracto de Hibiscus" },
  ],
  "blend-acai-maca-andina": [
    { archivo: "blend-acai-maca-andina-1.jpg", alt: "Tubo de Blend Açaí + Maca Andina junto a açaí fresco" },
  ],
  "matcha-premium": [
    { archivo: "matcha-premium-1.jpg", alt: "Lata de Matcha Premium con matcha latte sirviéndose" },
    { archivo: "matcha-premium-2.jpg", alt: "Lata de Matcha Premium, primer plano de la etiqueta" },
  ],
  "cacao-en-pasta-ecuador": [
    { archivo: "cacao-en-pasta-ecuador-1.jpg", alt: "Tubo de Cacao en Pasta Orgánico de Ecuador junto a bebida de cacao servida" },
  ],
};

async function main() {
  for (const [slug, imagenes] of Object.entries(IMAGENES)) {
    const producto = await prisma.producto.findUniqueOrThrow({ where: { slug } });
    await prisma.imagen.deleteMany({ where: { productoId: producto.id } });
    await prisma.imagen.createMany({
      data: imagenes.map((img, i) => ({
        productoId: producto.id,
        url: `${BASE_URL}/${img.archivo}`,
        alt: img.alt,
        orden: i,
      })),
    });
    console.log(`${slug}: ${imagenes.length} imagen(es)`);
  }
  console.log("Listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
