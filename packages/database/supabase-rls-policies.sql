-- Enable Row Level Security on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to certain tables
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to active services" ON services FOR SELECT USING ("isActive" = true AND "isPrivate" = false);

-- Profile policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = "userId");

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = "userId");

-- Users can create their own profile
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Providers can view profiles of their customers - FIXED RECURSIVE REFERENCE
CREATE POLICY "Providers can view customer profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings."providerId" IN (
      SELECT profiles.id FROM profiles WHERE profiles."userId" = auth.uid()
    )
    AND bookings."customerId" = profiles.id
  )
);

-- Service policies
-- Providers can view all their services (including inactive ones)
CREATE POLICY "Providers can view all their services"
ON services FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services."providerId" 
    AND profiles."userId" = auth.uid()
  )
);

-- Providers can create services
CREATE POLICY "Providers can create services"
ON services FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services."providerId" 
    AND profiles."userId" = auth.uid()
    AND (profiles.role = 'PROVIDER' OR profiles.role = 'ADMIN')
  )
);

-- Providers can update their own services
CREATE POLICY "Providers can update their services"
ON services FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services."providerId" 
    AND profiles."userId" = auth.uid()
  )
);

-- Booking policies
-- Customers can view their bookings
CREATE POLICY "Customers can view their bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings."customerId" 
    AND profiles."userId" = auth.uid()
  )
);

-- Providers can view bookings for their services
CREATE POLICY "Providers can view bookings for their services"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings."providerId" 
    AND profiles."userId" = auth.uid()
  )
);

-- Customers can create bookings
CREATE POLICY "Customers can create bookings"
ON bookings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings."customerId" 
    AND profiles."userId" = auth.uid()
  )
);

-- Customers can update their own bookings (cancel, etc.)
CREATE POLICY "Customers can update their bookings"
ON bookings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings."customerId" 
    AND profiles."userId" = auth.uid()
  )
);

-- Providers can update bookings for their services
CREATE POLICY "Providers can update bookings for their services"
ON bookings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings."providerId" 
    AND profiles."userId" = auth.uid()
  )
);

-- Review policies
-- Anyone can view public reviews
CREATE POLICY "Anyone can view public reviews"
ON reviews FOR SELECT
USING ("isPublic" = true);

-- Users can view their own reviews (public or private)
CREATE POLICY "Users can view their own reviews"
ON reviews FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = reviews."customerId"
    AND profiles."userId" = auth.uid()
  )
);

-- Providers can view all reviews for their services
CREATE POLICY "Providers can view all reviews for their services"
ON reviews FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = reviews."providerId"
    AND profiles."userId" = auth.uid()
  )
);

-- Customers can create reviews for completed bookings
CREATE POLICY "Customers can create reviews for completed bookings"
ON reviews FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = reviews."bookingId"
    AND bookings.status = 'COMPLETED'
    AND bookings."customerId" IN (
      SELECT id FROM profiles WHERE "userId" = auth.uid()
    )
    AND bookings."hasReview" = false
  )
);

-- Customers can update their own reviews
CREATE POLICY "Customers can update their reviews"
ON reviews FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = reviews."customerId"
    AND profiles."userId" = auth.uid()
  )
);

-- Create a trigger to update hasReview flag on bookings
CREATE OR REPLACE FUNCTION update_booking_has_review()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bookings
  SET "hasReview" = true
  WHERE id = NEW."bookingId";
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_booking_has_review_trigger
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE PROCEDURE update_booking_has_review(); 