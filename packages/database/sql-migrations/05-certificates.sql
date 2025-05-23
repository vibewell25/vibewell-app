-- Create certificates table for course completions
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "enrollmentId" UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "courseId" UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  "certificateUrl" TEXT,
  "certificateNumber" TEXT NOT NULL,
  "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);