-- CreateEnum
CREATE TYPE "LineaBeneficio" AS ENUM ('FOCO_VITALIDAD', 'LONGEVIDAD_GLOW', 'SALUD_INTESTINAL', 'CALMA_ALQUIMICA');

-- CreateEnum
CREATE TYPE "Ritual" AS ENUM ('AM', 'PM');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE_PAGO', 'PAGO_CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'LISTO_PARA_RETIRO', 'ENTREGADO', 'CANCELADA');

-- CreateEnum
CREATE TYPE "MetodoEntrega" AS ENUM ('ENVIO_DOMICILIO', 'RETIRO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TRANSFERENCIA', 'EFECTIVO', 'MERCADO_PAGO');

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "formulaSubtitulo" TEXT,
    "linea" "LineaBeneficio" NOT NULL,
    "ritual" "Ritual"[],
    "orden" INTEGER NOT NULL,
    "momentoSugerido" TEXT,
    "descripcion" TEXT NOT NULL,
    "laFormula" JSONB,
    "beneficios" TEXT[],
    "ritualDeUso" TEXT NOT NULL,
    "ingredientes" TEXT,
    "notaDePureza" TEXT,
    "origen" TEXT,
    "precio" INTEGER NOT NULL,
    "formato" TEXT,
    "pesoNetoGramos" DOUBLE PRECISION,
    "paqueteAltoCm" DOUBLE PRECISION,
    "paqueteAnchoCm" DOUBLE PRECISION,
    "paqueteProfundidadCm" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "destacado" TEXT,
    "nombrePendiente" BOOLEAN NOT NULL DEFAULT false,
    "seoTitulo" TEXT,
    "seoDescripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combo" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "bajada" TEXT NOT NULL,
    "ritual" "Ritual"[],
    "porQueSePotencian" TEXT NOT NULL,
    "copyAprobado" BOOLEAN NOT NULL DEFAULT false,
    "precio" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Combo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComboProducto" (
    "comboId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,

    CONSTRAINT "ComboProducto_pkey" PRIMARY KEY ("comboId","productoId")
);

-- CreateTable
CREATE TABLE "Imagen" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "productoId" TEXT,
    "comboId" TEXT,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "metodoEntrega" "MetodoEntrega" NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "dni" TEXT,
    "calle" TEXT,
    "numeroDom" TEXT,
    "piso" TEXT,
    "localidad" TEXT,
    "provincia" TEXT,
    "codigoPostal" TEXT,
    "barrioZona" TEXT,
    "notas" TEXT,
    "subtotal" INTEGER NOT NULL,
    "costoEnvio" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productoId" TEXT,
    "comboId" TEXT,
    "nombre" TEXT NOT NULL,
    "precioUnitario" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvisoStock" (
    "id" TEXT NOT NULL,
    "productoId" TEXT,
    "comboId" TEXT,
    "contacto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvisoStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_slug_key" ON "Producto"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Combo_slug_key" ON "Combo"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_numero_key" ON "Order"("numero");

-- AddForeignKey
ALTER TABLE "ComboProducto" ADD CONSTRAINT "ComboProducto_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "Combo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComboProducto" ADD CONSTRAINT "ComboProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "Combo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "Combo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
