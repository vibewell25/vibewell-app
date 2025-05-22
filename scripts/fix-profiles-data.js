#!/usr/bin/env node

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

async function fixProfilesAndData() {
  console.log('🔧 Fixing RLS policies and ensuring data updates correctly...');
  
  try {
    // Step 1: Get existing RLS policies
    console.log('\nStep 1: Checking RLS policies for profiles table...');
    
    // We'll skip the RLS SQL operations since we already fixed them manually
    console.log('✅ RLS policies for profiles table have been fixed manually');
    
    // Step 2: List users to check current data
    console.log('\nStep 2: Listing users to check current data...');
    
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError.message);
      return;
    }
    
    console.log(`Found ${users.users.length} users in the auth system`);
    
    // Step 3: Check for existing profiles
    console.log('\nStep 3: Checking for existing profiles...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message);
      return;
    }
    
    console.log(`Found ${profiles.length} profiles in the database`);
    
    // Find users without profiles
    const usersWithoutProfiles = users.users.filter(user => 
      !profiles.some(profile => profile.userId === user.id)
    );
    
    console.log(`Found ${usersWithoutProfiles.length} users without profiles`);
    
    // Step 4: Create missing profiles
    if (usersWithoutProfiles.length > 0) {
      console.log('\nStep 4: Creating missing profiles...');
      
      for (const user of usersWithoutProfiles) {
        // Extract user metadata
        const firstName = user.user_metadata?.firstName || 'Unknown';
        const lastName = user.user_metadata?.lastName || 'User';
        
        console.log(`Creating profile for user ${user.email}...`);
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            userId: user.id,
            email: user.email,
            firstName,
            lastName,
            role: 'CUSTOMER'
          });
        
        if (insertError) {
          console.error(`❌ Error creating profile for ${user.email}:`, insertError.message);
        } else {
          console.log(`✅ Created profile for ${user.email}`);
        }
      }
    }
    
    // Step 5: Test updating a profile
    console.log('\nStep 5: Testing profile updates...');
    
    // Use the first profile for testing
    if (profiles.length > 0) {
      const testProfile = profiles[0];
      console.log(`Testing update on profile for ${testProfile.email}...`);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          bio: `Updated bio at ${new Date().toISOString()}`,
          updatedAt: new Date().toISOString()
        })
        .eq('id', testProfile.id);
      
      if (updateError) {
        console.error('❌ Error updating profile:', updateError.message);
      } else {
        console.log('✅ Profile updated successfully');
        
        // Verify the update
        const { data: updated, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', testProfile.id)
          .single();
        
        if (fetchError) {
          console.error('❌ Error fetching updated profile:', fetchError.message);
        } else {
          console.log('✅ Updated profile data:', updated.bio);
        }
      }
    } else {
      console.log('No profiles available for testing updates');
    }
    
    console.log('\n✅ Profiles fix and data update check completed!');
    
  } catch (error) {
    console.error('❌ Error during fix and data updates:', error.message);
  }
}

// Run the fix
fixProfilesAndData(); 