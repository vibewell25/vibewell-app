-- Create provider breaks table
CREATE TABLE IF NOT EXISTS provider_breaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "providerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "dayOfWeek" INTEGER CHECK ("dayOfWeek" BETWEEN 0 AND 6),
  "startTime" TIME NOT NULL,
  "endTime" TIME NOT NULL,
  "isRecurring" BOOLEAN NOT NULL DEFAULT true,
  "specificDate" DATE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (("isRecurring" = true AND "dayOfWeek" IS NOT NULL) OR 
         ("isRecurring" = false AND "specificDate" IS NOT NULL))
);