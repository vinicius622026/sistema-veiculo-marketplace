-- CreateTable
CREATE TABLE "Webhook" (
  "id" TEXT NOT NULL,
  "revenda_id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "eventos" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Webhook"
ADD CONSTRAINT "Webhook_revenda_id_fkey"
FOREIGN KEY ("revenda_id") REFERENCES "Revenda"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
