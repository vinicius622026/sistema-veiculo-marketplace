-- CreateTable
CREATE TABLE "AnuncioFoto" (
  "id" TEXT NOT NULL,
  "anuncio_id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "ordem" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AnuncioFoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnuncioFoto"
ADD CONSTRAINT "AnuncioFoto_anuncio_id_fkey"
FOREIGN KEY ("anuncio_id") REFERENCES "Anuncio"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
