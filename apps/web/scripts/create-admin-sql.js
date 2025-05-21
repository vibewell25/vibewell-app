// Script to generate SQL for creating a user and profile in Supabase
require('dotenv').config({ path: './.env.local' });
const crypto = require('crypto');
const { randomUUID } = require('crypto');

// Generate a random UUID for the user
const userId = randomUUID();

// Generate user details - ADMIN user
const email = 'admin@vibewell.com';
const firstName = 'Admin';
const lastName = 'User';
const role = 'ADMIN'; // ADMIN, PROVIDER, or CUSTOMER

// Current date in ISO format
const now = new Date().toISOString();

console.log(`Generating SQL commands to create an ${role} user with email: ${email}`);
console.log('\nIMPORTANT: This will directly insert records into the database, bypassing authentication.');
console.log('After running these SQL commands, you can sign in with the provided credentials.\n');

// Generate SQL for creating the user directly
const insertUserSQL = `
-- 1. First, insert into auth.users table
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '${userId}', 
  '${email}', 
  -- This creates a dummy password hash, you'll need to set a real password later
  '${crypto.randomBytes(20).toString('hex')}', 
  now(), 
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"${firstName}","last_name":"${lastName}"}',
  now(),
  now()
);
`;

// Generate SQL for creating profile
const insertProfileSQL = `
-- 2. Create the profile record
INSERT INTO profiles (
  id, "userId", email, "firstName", "lastName", role, "createdAt", "updatedAt"
)
VALUES (
  uuid_generate_v4(),
  '${userId}',
  '${email}',
  '${firstName}',
  '${lastName}',
  '${role}',
  now(),
  now()
);
`;

// Generate SQL for setting a known password
const setPasswordSQL = `
-- 3. Set a known password for the admin user
-- This sets the password to 'Admin123!'
UPDATE auth.users
SET encrypted_password = '$2a$10$zrGZ.xRUlsYu2qzr1HmYnOGkl8jJ7XZWKQi6y3vF27qVrLjWI0jee'
WHERE email = '${email}';
`;

console.log('============ SQL COMMANDS TO EXECUTE ============');
console.log(insertUserSQL);
console.log(insertProfileSQL);
console.log(setPasswordSQL);
console.log('================================================');

console.log('\nAfter executing these SQL commands, you can sign in with:');
console.log(`- Email: ${email}`);
console.log('- Password: Admin123!');
console.log(`- Role: ${role}`);
console.log('\nTo execute these commands:');
console.log('1. Go to the Supabase Dashboard at https://app.supabase.com');
console.log('2. Select your project');
console.log('3. Go to the SQL Editor');
console.log('4. Copy and paste each section of SQL commands');
console.log('5. Execute them in order'); 