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