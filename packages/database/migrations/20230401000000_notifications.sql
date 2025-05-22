-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Add RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own notifications
CREATE POLICY notifications_select_policy
  ON notifications
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM profiles
      WHERE auth.uid() = profiles.user_id
    )
  );

-- Only allow users to update their own notifications
CREATE POLICY notifications_update_policy
  ON notifications
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM profiles
      WHERE auth.uid() = profiles.user_id
    )
  );

-- Allow the service role to insert notifications for any user
CREATE POLICY notifications_insert_policy
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Add hasReview field to bookings table if not exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS has_review BOOLEAN NOT NULL DEFAULT false;

-- Add isPublic field to reviews table if not exists
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true; 