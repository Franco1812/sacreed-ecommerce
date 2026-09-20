-- CreateTable
CREATE TABLE "HeroImagen" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HeroImagen_pkey" PRIMARY KEY ("id")
);

-- Fotos que estaban hardcodeadas en web/app/(site)/page.tsx: así el carrusel
-- se ve igual el día que se aplica la migración.
INSERT INTO "HeroImagen" ("id", "url", "alt", "orden") VALUES
    ('hero-inicial-1', '/hero/hero-1.jpeg', 'Medicina viva, belleza interior y experiencias sagradas de autocuidado', 0),
    ('hero-inicial-2', '/hero/hero-2.jpeg', 'Sacred PM Routine', 1),
    ('hero-inicial-3', '/hero/hero-3.jpeg', 'Ritual de bienestar SACRED', 2),
    ('hero-inicial-4', '/hero/hero-4.jpeg', 'El bienestar no es perfección', 3);
