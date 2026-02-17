-- CreateTable
CREATE TABLE "VisitaAnuncio" (
  "id" TEXT NOT NULL,
  "anuncio_id" TEXT NOT NULL,
  "ip" TEXT,
  "user_agent" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "VisitaAnuncio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VisitaAnuncio"
ADD CONSTRAINT "VisitaAnuncio_anuncio_id_fkey"
FOREIGN KEY ("anuncio_id") REFERENCES "Anuncio"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
