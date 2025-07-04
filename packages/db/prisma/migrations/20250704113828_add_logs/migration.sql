-- CreateTable
CREATE TABLE "usage_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "timeZone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "usage_logs_userId_date_feature_idx" ON "usage_logs"("userId", "date", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "usage_logs_userId_date_feature_key" ON "usage_logs"("userId", "date", "feature");
