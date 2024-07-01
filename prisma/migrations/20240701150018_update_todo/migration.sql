/*
  Warnings:

  - You are about to drop the column `aiVoice` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `interruptionThreshold` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `maxDuration` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `transferList` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `transferPhoneNumber` on the `Todo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_agentId_fkey";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "aiVoice",
DROP COLUMN "interruptionThreshold",
DROP COLUMN "language",
DROP COLUMN "maxDuration",
DROP COLUMN "metadata",
DROP COLUMN "model",
DROP COLUMN "transferList",
DROP COLUMN "transferPhoneNumber";

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
