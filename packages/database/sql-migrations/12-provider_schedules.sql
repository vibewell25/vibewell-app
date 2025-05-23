-- Create provider schedules table for availability
CREATE TABLE IF NOT EXISTS provider_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "providerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "dayOfWeek" INTEGER NOT NULL CHECK ("dayOfWeek" BETWEEN 0 AND 6),
  "startTime" TIME NOT NULL,
  "endTime" TIME NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE("providerId", "dayOfWeek")
);