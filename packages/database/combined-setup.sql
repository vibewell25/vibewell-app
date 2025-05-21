-- Create enum types first
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROVIDER', 'CUSTOMER');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "LoyaltyTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "displayName" TEXT,
  bio TEXT,
  "avatarUrl" TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  "zipCode" TEXT,
  country TEXT,
  role "UserRole" NOT NULL DEFAULT 'CUSTOMER',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  "iconUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "providerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL, -- Duration in minutes
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "categoryId" UUID NOT NULL REFERENCES categories(id),
  "isPrivate" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "customerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "providerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "serviceId" UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  status "BookingStatus" NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  price DECIMAL(10, 2) NOT NULL,
  "cancellationReason" TEXT,
  "cancellationNotes" TEXT,
  "cancellationFee" DECIMAL(10, 2),
  "hasReview" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bookingId" UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  "customerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "providerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "serviceId" UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_profiles_userId ON profiles("userId");
CREATE INDEX idx_services_providerId ON services("providerId");
CREATE INDEX idx_services_categoryId ON services("categoryId");
CREATE INDEX idx_bookings_customerId ON bookings("customerId");
CREATE INDEX idx_bookings_providerId ON bookings("providerId");
CREATE INDEX idx_bookings_serviceId ON bookings("serviceId");
CREATE INDEX idx_reviews_customerId ON reviews("customerId");
CREATE INDEX idx_reviews_providerId ON reviews("providerId");
CREATE INDEX idx_reviews_serviceId ON reviews("serviceId");
CREATE INDEX idx_reviews_bookingId ON reviews("bookingId");

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 
-- Then, set up RLS policies

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

-- Providers can view profiles of their customers
CREATE POLICY "Providers can view customer profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings."providerId" IN (
      SELECT id FROM profiles WHERE "userId" = auth.uid()
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