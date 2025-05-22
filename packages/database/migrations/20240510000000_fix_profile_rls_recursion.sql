-- First, drop potentially problematic policies that may cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Providers can view customer profiles" ON profiles;

-- Create a simpler admin policy that doesn't self-reference profiles table
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Create a fixed provider policy that avoids recursion
CREATE POLICY "Providers can view customer profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings."providerId" = (
      SELECT id FROM profiles WHERE profiles."userId" = auth.uid() LIMIT 1
    )
    AND bookings."customerId" = profiles.id
  )
);

-- Make sure the basic profile access policy exists
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = "userId");

-- Make sure users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = "userId");

-- Make sure users can create their own profile
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = "userId"); 