-- Create blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "postId" UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "isApproved" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);