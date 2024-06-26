/*
  Warnings:

  - You are about to drop the column `metadataKey` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `metadataValue` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "metadataKey",
DROP COLUMN "metadataValue",
ADD COLUMN     "amd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "answeredByEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "calendly" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "interruptionThreshold" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "localDialing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxDuration" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "model" TEXT NOT NULL DEFAULT 'default_model',
ADD COLUMN     "pronunciationGuide" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "record" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestData" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "startTime" TIMESTAMP(3),
ADD COLUMN     "temperature" DOUBLE PRECISION DEFAULT 0.7,
ADD COLUMN     "tools" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "transferList" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "voiceSettings" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "voicemailMessage" TEXT DEFAULT '',
ADD COLUMN     "waitForGreeting" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "webhook" TEXT DEFAULT '';
