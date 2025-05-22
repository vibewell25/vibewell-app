#!/usr/bin/env node

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set');
  process.exit(1);
}

// Create Supabase client with admin privileges (service key)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Test user credentials - change these to valid credentials or use environment variables
const testEmail = 'test@example.com';
const testPassword = 'testpassword123';

async function testDataUpdates() {
  console.log('🧪 Testing Supabase data updates...');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // Check if the test user exists, create if not
    const { data: existingUser, error: userError } = await supabase.auth.admin.listUsers({
      perPage: 1,
      page: 1,
      filter: { email: testEmail }
    });
    
    let userId;
    
    if (userError) {
      console.error('❌ Error checking existing users:', userError.message);
      return;
    }
    
    if (!existingUser || existingUser.users.length === 0) {
      console.log('Test user does not exist, creating...');
      
      // Create a test user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
      });
      
      if (createError) {
        console.error('❌ Error creating test user:', createError.message);
        return;
      }
      
      userId = newUser.user.id;
      console.log('✅ Created test user with ID:', userId);
    } else {
      userId = existingUser.users[0].id;
      console.log('✅ Using existing test user with ID:', userId);
    }
    
    // Check if the user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('userId', userId)
      .maybeSingle();
    
    if (profileError && !profileError.message.includes('No rows found')) {
      console.error('❌ Error checking profile:', profileError.message);
      return;
    }
    
    // Create or update the profile
    if (!profile) {
      console.log('Creating profile for user...');
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          userId: userId,
          email: testEmail,
          firstName: 'Test',
          lastName: 'User',
          role: 'CUSTOMER'
        });
      
      if (insertError) {
        console.error('❌ Error creating profile:', insertError.message);
        console.log('\nRaw error details:', JSON.stringify(insertError, null, 2));
        return;
      }
      
      console.log('✅ Profile created successfully');
    } else {
      console.log('Updating existing profile...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          firstName: 'Updated',
          lastName: 'User',
          updatedAt: new Date().toISOString()
        })
        .eq('userId', userId);
      
      if (updateError) {
        console.error('❌ Error updating profile:', updateError.message);
        console.log('\nRaw error details:', JSON.stringify(updateError, null, 2));
        return;
      }
      
      console.log('✅ Profile updated successfully');
    }
    
    // Fetch the updated profile to verify changes
    const { data: updatedProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('userId', userId)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching updated profile:', fetchError.message);
      return;
    }
    
    console.log('\n✅ Updated profile data:');
    console.log(JSON.stringify(updatedProfile, null, 2));
    
    // Test inserting a test category (for general data insert testing)
    const testCategoryId = `test-${Date.now()}`;
    console.log('\nTesting category insertion...');
    
    const { error: categoryError } = await supabase
      .from('categories')
      .insert({
        id: testCategoryId,
        name: `Test Category ${Date.now()}`,
        description: 'Created for testing data updates'
      });
    
    if (categoryError) {
      console.error('❌ Error inserting test category:', categoryError.message);
      console.log('\nRaw error details:', JSON.stringify(categoryError, null, 2));
    } else {
      console.log('✅ Test category inserted successfully');
      
      // Clean up the test category
      await supabase
        .from('categories')
        .delete()
        .eq('id', testCategoryId);
      
      console.log('✅ Test category cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testDataUpdates(); 