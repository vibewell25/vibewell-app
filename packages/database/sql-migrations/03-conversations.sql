-- Create conversations table for chat functionality
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participants UUID[] NOT NULL,
  "lastMessageAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);