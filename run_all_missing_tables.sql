-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "customerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status "OrderStatus" NOT NULL DEFAULT 'PENDING',
  total DECIMAL(10, 2) NOT NULL,
  "paymentIntentId" TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table for order line items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "orderId" UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  "productId" UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversations table for chat functionality
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participants UUID[] NOT NULL,
  "lastMessageAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for chat messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "conversationId" UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  "senderId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

-- Create blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

-- Create appointment reminders table
CREATE TABLE IF NOT EXISTS booking_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bookingId" UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  "reminderType" TEXT NOT NULL, -- 'email', 'sms', 'push'
  "reminderStatus" TEXT NOT NULL, -- 'pending', 'sent', 'failed'
  "scheduledFor" TIMESTAMP WITH TIME ZONE NOT NULL,
  "sentAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create updatedAt column update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updatedAt triggers for all tables
CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at 
BEFORE UPDATE ON order_items 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
BEFORE UPDATE ON conversations 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
BEFORE UPDATE ON messages 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at 
BEFORE UPDATE ON certificates 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at 
BEFORE UPDATE ON blog_categories
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at 
BEFORE UPDATE ON blog_comments
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_skin_analyses_updated_at 
BEFORE UPDATE ON skin_analyses
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at 
BEFORE UPDATE ON ai_recommendations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_virtual_tryons_updated_at 
BEFORE UPDATE ON virtual_tryons
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_provider_schedules_updated_at 
BEFORE UPDATE ON provider_schedules
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_provider_breaks_updated_at 
BEFORE UPDATE ON provider_breaks
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_booking_reminders_updated_at 
BEFORE UPDATE ON booking_reminders
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_orders_customerId ON orders("customerId");
CREATE INDEX idx_order_items_orderId ON order_items("orderId");
CREATE INDEX idx_order_items_productId ON order_items("productId");
CREATE INDEX idx_conversations_participants ON conversations USING GIN ("participants");
CREATE INDEX idx_messages_conversationId ON messages("conversationId");
CREATE INDEX idx_messages_senderId ON messages("senderId");
CREATE INDEX idx_certificates_userId ON certificates("userId");
CREATE INDEX idx_certificates_courseId ON certificates("courseId");
CREATE INDEX idx_certificates_enrollmentId ON certificates("enrollmentId");
CREATE INDEX idx_blog_posts_authorId ON blog_posts("authorId");
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_comments_postId ON blog_comments("postId");
CREATE INDEX idx_blog_comments_userId ON blog_comments("userId");
CREATE INDEX idx_skin_analyses_userId ON skin_analyses("userId");
CREATE INDEX idx_ai_recommendations_userId ON ai_recommendations("userId");
CREATE INDEX idx_virtual_tryons_userId ON virtual_tryons("userId");
CREATE INDEX idx_provider_schedules_providerId ON provider_schedules("providerId");
CREATE INDEX idx_provider_breaks_providerId ON provider_breaks("providerId");
CREATE INDEX idx_booking_reminders_bookingId ON booking_reminders("bookingId");

-- Set up RLS policies for all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_tryons ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() IN (
  SELECT "userId" FROM profiles WHERE id = "customerId"
));

CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT "userId" FROM profiles WHERE id = "customerId"
));

-- RLS policies for order_items
CREATE POLICY "Users can view their order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items."orderId"
    AND orders."customerId" IN (
      SELECT id FROM profiles WHERE "userId" = auth.uid()
    )
  )
);

-- RLS policies for conversations
CREATE POLICY "Users can view conversations they are part of"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()
    AND profiles.id = ANY(conversations.participants)
  )
);

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()
    AND profiles.id = ANY(conversations.participants)
  )
);

-- RLS policies for messages
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages."conversationId"
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId" = auth.uid()
      AND profiles.id = ANY(conversations.participants)
    )
  )
);

CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()
    AND profiles.id = messages."senderId"
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages."conversationId"
      AND profiles.id = ANY(conversations.participants)
    )
  )
);

-- RLS policies for certificates
CREATE POLICY "Users can view their own certificates"
ON certificates FOR SELECT
USING ("userId" IN (
  SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
));

-- RLS policies for blog posts
CREATE POLICY "Anyone can view published blog posts"
ON blog_posts FOR SELECT
USING ("isPublished" = true);

CREATE POLICY "Authors can manage their own blog posts"
ON blog_posts FOR ALL
USING ("authorId" IN (
  SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
));

-- RLS policies for blog categories
CREATE POLICY "Anyone can view blog categories"
ON blog_categories FOR SELECT
USING (true);

-- RLS policies for blog comments
CREATE POLICY "Anyone can view approved comments"
ON blog_comments FOR SELECT
USING ("isApproved" = true);

CREATE POLICY "Users can manage their own comments"
ON blog_comments FOR ALL
USING ("userId" IN (
  SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
));

-- RLS policies for skin analyses
CREATE POLICY "Users can view their own skin analyses"
ON skin_analyses FOR SELECT
USING ("userId" IN (
  SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
));

-- RLS policies for AI recommendations
CREATE POLICY "Users can view their own AI recommendations"
ON ai_recommendations FOR SELECT
USING ("userId" IN (
  SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
));

-- RLS policies for virtual tryons
CREATE POLICY "Users can view their own virtual tryons"
ON virtual_tryons FOR SELECT
USING ("userId" IN (
  SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
));

-- RLS policies for provider schedules
CREATE POLICY "Anyone can view provider schedules"
ON provider_schedules FOR SELECT
USING (true);

CREATE POLICY "Providers can manage their own schedules"
ON provider_schedules FOR ALL
USING ("providerId" IN (
  SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
));

-- RLS policies for provider breaks
CREATE POLICY "Anyone can view provider breaks"
ON provider_breaks FOR SELECT
USING (true);

CREATE POLICY "Providers can manage their own breaks"
ON provider_breaks FOR ALL
USING ("providerId" IN (
  SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
));

-- RLS policies for booking reminders
CREATE POLICY "Users can view their own booking reminders"
ON booking_reminders FOR SELECT
USING (EXISTS (
  SELECT 1 FROM bookings
  WHERE bookings.id = booking_reminders."bookingId"
  AND bookings."userId" IN (
    SELECT id FROM profiles WHERE profiles."userId" = auth.uid()
  )
));

-- Add certificateIssued and certificateUrl columns to enrollments table if they don't exist
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS "certificateIssued" BOOLEAN DEFAULT false;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS "certificateUrl" TEXT; 