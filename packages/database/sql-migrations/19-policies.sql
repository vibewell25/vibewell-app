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