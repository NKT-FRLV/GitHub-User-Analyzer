/*
  Warnings:

  - You are about to drop the `CandidateFavorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CandidateFavorite" DROP CONSTRAINT "CandidateFavorite_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateFavorite" DROP CONSTRAINT "CandidateFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateNote" DROP CONSTRAINT "CandidateNote_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateNote" DROP CONSTRAINT "CandidateNote_userId_fkey";

-- DropTable
DROP TABLE "CandidateFavorite";

-- DropTable
DROP TABLE "CandidateNote";
