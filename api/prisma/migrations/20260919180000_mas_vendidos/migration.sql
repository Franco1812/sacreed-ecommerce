-- AlterTable: textos editables de la sección (la fila "home" ya existe, por eso los DEFAULT)
ALTER TABLE "ContenidoHome"
    ADD COLUMN "masVendidosEyebrow" TEXT NOT NULL DEFAULT 'Lo que más se repite',
    ADD COLUMN "masVendidosTitulo" TEXT NOT NULL DEFAULT 'Los más vendidos';

-- CreateTable
CREATE TABLE "MasVendido" (
    "id" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "productoId" TEXT NOT NULL,

    CONSTRAINT "MasVendido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasVendido_productoId_key" ON "MasVendido"("productoId");

-- AddForeignKey
ALTER TABLE "MasVendido" ADD CONSTRAINT "MasVendido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Punto de partida: lo mismo que mostraba la portada hasta hoy (los 4 con más
-- "vendidos" cargados), para que la sección se vea igual el día de la migración.
INSERT INTO "MasVendido" ("id", "orden", "productoId")
SELECT 'mv-inicial-' || (row_number() OVER (ORDER BY "vendidos" DESC, "orden" ASC)), (row_number() OVER (ORDER BY "vendidos" DESC, "orden" ASC)) - 1, "id"
FROM "Producto"
WHERE "vendidos" > 0
ORDER BY "vendidos" DESC, "orden" ASC
LIMIT 4;
