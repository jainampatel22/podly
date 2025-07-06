/*
  Warnings:

  - Made the column `email` on table `usage_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "usage_logs" ALTER COLUMN "email" SET NOT NULL;
