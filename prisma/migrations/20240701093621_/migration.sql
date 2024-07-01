/*
  Warnings:

  - Added the required column `description` to the `CustomerCallList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_callListId_fkey";

-- AlterTable
ALTER TABLE "Agent" ALTER COLUMN "model" SET DEFAULT 'base';

-- AlterTable
ALTER TABLE "CustomerCallList" ADD COLUMN     "description" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_callListId_fkey" FOREIGN KEY ("callListId") REFERENCES "CustomerCallList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
