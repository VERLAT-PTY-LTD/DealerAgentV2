/*
  Warnings:

  - You are about to drop the `todos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_user_id_fkey";

-- DropTable
DROP TABLE "todos";

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "transferPhoneNumber" TEXT NOT NULL,
    "aiVoice" TEXT NOT NULL,
    "metadataKey" TEXT NOT NULL,
    "metadataValue" TEXT NOT NULL,
    "scheduleTime" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "user_id" TEXT,
    "author" TEXT,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeDataset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "userId" TEXT NOT NULL,

    CONSTRAINT "KnowledgeDataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TodoDatasets" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TodoDatasets_AB_unique" ON "_TodoDatasets"("A", "B");

-- CreateIndex
CREATE INDEX "_TodoDatasets_B_index" ON "_TodoDatasets"("B");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeDataset" ADD CONSTRAINT "KnowledgeDataset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TodoDatasets" ADD CONSTRAINT "_TodoDatasets_A_fkey" FOREIGN KEY ("A") REFERENCES "KnowledgeDataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TodoDatasets" ADD CONSTRAINT "_TodoDatasets_B_fkey" FOREIGN KEY ("B") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
