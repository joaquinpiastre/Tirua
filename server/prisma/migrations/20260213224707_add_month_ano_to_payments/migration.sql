/*
  Warnings:

  - A unique constraint covering the columns `[userId,mes,ano]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "ano" INTEGER,
ADD COLUMN     "esManual" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mes" INTEGER,
ADD COLUMN     "observaciones" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_userId_mes_ano_key" ON "payments"("userId", "mes", "ano");
