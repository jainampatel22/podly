/*
  Warnings:

  - You are about to drop the column `userId` on the `usage_logs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName,date,feature]` on the table `usage_logs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `usage_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "usage_logs_userId_date_feature_idx";

-- DropIndex
DROP INDEX "usage_logs_userId_date_feature_key";

-- AlterTable
ALTER TABLE "usage_logs" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "usage_logs_userName_date_feature_idx" ON "usage_logs"("userName", "date", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "usage_logs_userName_date_feature_key" ON "usage_logs"("userName", "date", "feature");
