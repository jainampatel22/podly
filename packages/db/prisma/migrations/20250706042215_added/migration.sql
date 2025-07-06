/*
  Warnings:

  - Added the required column `billingCycle` to the `SubscriptionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `SubscriptionLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "SubscriptionLog" ADD COLUMN     "billingCycle" "BillingCycle" NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "billingCycle" "BillingCycle",
ADD COLUMN     "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionStartedAt" TIMESTAMP(3);
