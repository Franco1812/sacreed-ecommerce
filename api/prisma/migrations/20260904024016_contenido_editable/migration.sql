-- CreateTable
CREATE TABLE "Linea" (
    "id" "LineaBeneficio" NOT NULL,
    "nombre" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Linea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContenidoHome" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "heroEyebrow" TEXT NOT NULL,
    "heroTitulo" TEXT NOT NULL,
    "heroTituloEnfasis" TEXT NOT NULL,
    "heroBajada" TEXT NOT NULL,
    "heroCta1Label" TEXT NOT NULL,
    "heroCta1Href" TEXT NOT NULL,
    "heroCta2Label" TEXT NOT NULL,
    "heroCta2Href" TEXT NOT NULL,
    "beneficiosEyebrow" TEXT NOT NULL,
    "beneficiosTitulo" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContenidoHome_pkey" PRIMARY KEY ("id")
);
