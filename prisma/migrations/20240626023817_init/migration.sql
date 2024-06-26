-- CreateTable
CREATE TABLE "CustomerCallList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CustomerCallList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerCallList" ADD CONSTRAINT "CustomerCallList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
