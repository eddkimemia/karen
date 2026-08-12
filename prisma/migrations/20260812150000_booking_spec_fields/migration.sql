-- Booking: travel-plan fields for the invoice spec
ALTER TABLE "Booking" ADD COLUMN "endDate" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN "adults" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Booking" ADD COLUMN "children" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Booking" ADD COLUMN "pickupLocation" TEXT;
ALTER TABLE "Booking" ADD COLUMN "pickupTime" TEXT;
ALTER TABLE "Booking" ADD COLUMN "dropoffLocation" TEXT;
ALTER TABLE "Booking" ADD COLUMN "dropoffTime" TEXT;
ALTER TABLE "Booking" ADD COLUMN "accommodation" TEXT;
ALTER TABLE "Booking" ADD COLUMN "transport" TEXT;
ALTER TABLE "Booking" ADD COLUMN "depositPaidKes" INTEGER;

-- Adventure: day-by-day itinerary + inclusions/exclusions + defaults
ALTER TABLE "Adventure" ADD COLUMN "itinerary" JSONB;
ALTER TABLE "Adventure" ADD COLUMN "inclusions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Adventure" ADD COLUMN "exclusions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Adventure" ADD COLUMN "accommodation" TEXT;
ALTER TABLE "Adventure" ADD COLUMN "transport" TEXT;

-- Destination: gallery of multiple images (first entry = hero)
ALTER TABLE "Destination" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
