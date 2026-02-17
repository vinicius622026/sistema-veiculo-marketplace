-- CreateTable
CREATE TABLE "Favorito" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "anuncio_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favorito"
ADD CONSTRAINT "Favorito_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito"
ADD CONSTRAINT "Favorito_anuncio_id_fkey"
FOREIGN KEY ("anuncio_id") REFERENCES "Anuncio"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
