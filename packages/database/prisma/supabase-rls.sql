-- Enable Row Level Security on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profile policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = "userId");

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = "userId");

-- Admin users can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid() AND profiles.role = 'ADMIN'
  )
);

-- Service policies
-- Anyone can view active services
CREATE POLICY "Anyone can view active services"
ON services FOR SELECT
USING (isActive = true);

-- Providers can view all their services (active and inactive)
CREATE POLICY "Providers can view all their services"
ON services FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services.providerId AND profiles.userId = auth.uid()
  )
);

-- Providers can create services
CREATE POLICY "Providers can create services"
ON services FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services.providerId AND profiles.userId = auth.uid()
  )
);

-- Providers can update their services
CREATE POLICY "Providers can update their services"
ON services FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services.providerId AND profiles.userId = auth.uid()
  )
);

-- Booking policies
-- Customers can view their bookings
CREATE POLICY "Customers can view their bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings.customerId AND profiles.userId = auth.uid()
  )
);

-- Providers can view bookings for their services
CREATE POLICY "Providers can view bookings for their services"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings.providerId AND profiles.userId = auth.uid()
  )
);

-- Customers can create bookings
CREATE POLICY "Customers can create bookings"
ON bookings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings.customerId AND profiles.userId = auth.uid()
  )
);

-- Customers can update their bookings (cancel, etc.)
CREATE POLICY "Customers can update their bookings"
ON bookings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings.customerId AND profiles.userId = auth.uid()
  )
);

-- Providers can update bookings for their services
CREATE POLICY "Providers can update bookings for their services"
ON bookings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = bookings.providerId AND profiles.userId = auth.uid()
  )
);

-- Categories policies
-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
ON categories FOR SELECT
USING (true);

-- Only admins can create/update categories
CREATE POLICY "Only admins can create categories"
ON categories FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid() AND profiles.role = 'ADMIN'
  )
);

CREATE POLICY "Only admins can update categories"
ON categories FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid() AND profiles.role = 'ADMIN'
  )
);

-- Review policies
-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
ON reviews FOR SELECT
USING (true);

-- Users can create reviews for services they booked
CREATE POLICY "Users can create reviews for services they booked"
ON reviews FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.customerId IN (
      SELECT id FROM profiles WHERE userId = auth.uid()
    )
    AND bookings.serviceId = reviews.serviceId
    AND bookings.status = 'COMPLETED'
  )
);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = reviews.authorId AND profiles.userId = auth.uid()
  )
);

-- Post policies
-- Anyone can view posts
CREATE POLICY "Anyone can view posts"
ON posts FOR SELECT
USING (true);

-- Users can create their own posts
CREATE POLICY "Users can create their own posts"
ON posts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = posts.authorId AND profiles.userId = auth.uid()
  )
);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = posts.authorId AND profiles.userId = auth.uid()
  )
);

-- Comment policies
-- Anyone can view comments
CREATE POLICY "Anyone can view comments"
ON comments FOR SELECT
USING (true);

-- Users can create comments
CREATE POLICY "Users can create comments"
ON comments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = comments.authorId AND profiles.userId = auth.uid()
  )
);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = comments.authorId AND profiles.userId = auth.uid()
  )
); 