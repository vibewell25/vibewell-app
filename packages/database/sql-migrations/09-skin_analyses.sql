-- Create AI skin analysis table
CREATE TABLE IF NOT EXISTS skin_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "imageUrl" TEXT,
  "hydrationLevel" INTEGER,
  "oilLevel" INTEGER,
  "pigmentation" INTEGER,
  "wrinkles" INTEGER,
  "sensitivity" INTEGER,
  "uvDamage" INTEGER,
  "pores" INTEGER,
  "results" JSONB,
  "analysisDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);