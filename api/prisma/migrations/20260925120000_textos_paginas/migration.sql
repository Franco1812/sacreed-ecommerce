-- CreateTable
CREATE TABLE "Texto" (
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Texto_pkey" PRIMARY KEY ("clave")
);

-- CreateTable
CREATE TABLE "Pagina" (
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pagina_pkey" PRIMARY KEY ("slug")
);
