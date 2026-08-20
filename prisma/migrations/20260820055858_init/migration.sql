/*
  Warnings:

  - You are about to drop the column `email` on the `OtpVerification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sendto]` on the table `OtpVerification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sendto` to the `OtpVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OtpVerification_email_idx";

-- DropIndex
DROP INDEX "OtpVerification_email_verifiedAt_expiresAt_idx";

-- AlterTable
ALTER TABLE "OtpVerification" DROP COLUMN "email",
ADD COLUMN     "sendto" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OtpVerification_sendto_key" ON "OtpVerification"("sendto");

-- CreateIndex
CREATE INDEX "OtpVerification_sendto_idx" ON "OtpVerification"("sendto");

-- CreateIndex
CREATE INDEX "OtpVerification_sendto_verifiedAt_expiresAt_idx" ON "OtpVerification"("sendto", "verifiedAt", "expiresAt");
