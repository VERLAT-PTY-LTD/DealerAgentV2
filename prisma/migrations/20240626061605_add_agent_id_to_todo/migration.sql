/*
  Warnings:

  - You are about to drop the column `phone` on the `CustomerCallList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomerCallList" DROP COLUMN "phone";

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "callListId" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_callListId_fkey" FOREIGN KEY ("callListId") REFERENCES "CustomerCallList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
