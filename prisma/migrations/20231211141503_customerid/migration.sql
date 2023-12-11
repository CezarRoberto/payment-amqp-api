/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_customer_id` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "stripe_customer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "views" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_stripe_customer_id_key" ON "Customer"("stripe_customer_id");
