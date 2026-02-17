-- CreateTable
CREATE TABLE "Mensagem" (
  "id" TEXT NOT NULL,
  "anuncio_id" TEXT NOT NULL,
  "sender_nome" TEXT NOT NULL,
  "sender_telefone" TEXT NOT NULL,
  "conteudo" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mensagem"
ADD CONSTRAINT "Mensagem_anuncio_id_fkey"
FOREIGN KEY ("anuncio_id") REFERENCES "Anuncio"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
