/*
  Warnings:

  - You are about to drop the column `bannerAlt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `bannerUrl` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "bannerAlt",
DROP COLUMN "bannerUrl";
