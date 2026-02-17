-- CreateTable
CREATE TABLE "TicketSuporte" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "assunto" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "prioridade" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TicketSuporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMensagem" (
  "id" TEXT NOT NULL,
  "ticket_id" TEXT NOT NULL,
  "autor" TEXT NOT NULL,
  "mensagem" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TicketMensagem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketSuporte"
ADD CONSTRAINT "TicketSuporte_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMensagem"
ADD CONSTRAINT "TicketMensagem_ticket_id_fkey"
FOREIGN KEY ("ticket_id") REFERENCES "TicketSuporte"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
