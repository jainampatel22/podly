/*
  Warnings:

  - You are about to drop the column `userName` on the `usage_logs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,date,feature]` on the table `usage_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "usage_logs_userName_date_feature_idx";

-- DropIndex
DROP INDEX "usage_logs_userName_date_feature_key";

-- AlterTable
ALTER TABLE "usage_logs" DROP COLUMN "userName",
ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE INDEX "usage_logs_email_date_feature_idx" ON "usage_logs"("email", "date", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "usage_logs_email_date_feature_key" ON "usage_logs"("email", "date", "feature");
