-- CreateTable
CREATE TABLE "Plano" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "preco" DOUBLE PRECISION NOT NULL,
  "limite_anuncios" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);
