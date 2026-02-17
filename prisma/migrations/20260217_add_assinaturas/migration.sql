-- CreateTable
CREATE TABLE "Assinatura" (
  "id" TEXT NOT NULL,
  "revenda_id" TEXT NOT NULL,
  "plano_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "inicio" TIMESTAMP(3) NOT NULL,
  "fim" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assinatura"
ADD CONSTRAINT "Assinatura_revenda_id_fkey"
FOREIGN KEY ("revenda_id") REFERENCES "Revenda"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura"
ADD CONSTRAINT "Assinatura_plano_id_fkey"
FOREIGN KEY ("plano_id") REFERENCES "Plano"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
