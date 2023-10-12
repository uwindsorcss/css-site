/*
  Warnings:

  - You are about to drop the `Suggestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_authorId_fkey";

-- DropTable
DROP TABLE "Suggestion";

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
