-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "customerCallListId" TEXT;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_customerCallListId_fkey" FOREIGN KEY ("customerCallListId") REFERENCES "CustomerCallList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
