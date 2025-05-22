-- First, disable RLS for the profiles table (temporarily) to resolve any current issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Then re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for the profiles table to ensure a clean slate
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Providers can view customer profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;

-- Create a single simple policy for profile viewing that won't cause recursion
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = "userId");

-- Create a simple policy for profile updates
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = "userId");

-- Create a simple policy for profile creation
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Add a simplified admin view policy if needed
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  (SELECT current_setting('app.is_admin', true)::boolean) = true
); 