-- Create AI recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "recommendationType" TEXT NOT NULL, -- 'skincare', 'nutrition', 'fitness', etc.
  "recommendations" JSONB NOT NULL,
  "baseAnalysisId" UUID, -- can link to skin_analyses or other analysis tables
  "isApplied" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);