-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "destinations" TEXT[] DEFAULT ARRAY[]::TEXT[];
