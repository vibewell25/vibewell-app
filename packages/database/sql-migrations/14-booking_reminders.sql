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