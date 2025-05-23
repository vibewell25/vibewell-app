-- Create virtual try-on table to store user sessions
CREATE TABLE IF NOT EXISTS virtual_tryons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "productId" UUID REFERENCES products(id) ON DELETE SET NULL,
  "imageUrl" TEXT,
  "resultImageUrl" TEXT,
  "settings" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);