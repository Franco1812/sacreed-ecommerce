-- AlterTable
ALTER TABLE "Imagen" ADD COLUMN     "orderId" TEXT;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
