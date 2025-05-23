-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "authorId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  "excerpt" TEXT,
  "featuredImageUrl" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP WITH TIME ZONE,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  tags TEXT[],
  category TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);