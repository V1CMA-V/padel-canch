/*
  Warnings:

  - You are about to drop the column `city` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `tournaments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state";
