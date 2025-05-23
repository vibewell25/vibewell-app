const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

// Get env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

/**
 * Test certificate generation
 */
async function testCertificateGeneration() {
  console.log('Testing certificate generation...');
  
  try {
    // 1. Create a test user profile
    const testUserId = `test-user-${Date.now()}`;
    const testProfileId = `test-profile-${Date.now()}`;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: testProfileId,
        userId: testUserId,
        email: `test-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        role: 'CUSTOMER'
      })
      .select()
      .single();
      
    if (profileError) {
      console.error('Error creating test profile:', profileError);
      return false;
    }
    
    console.log('✅ Created test profile');
    
    // 2. Create a test course
    const testCourseId = `test-course-${Date.now()}`;
    
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        id: testCourseId,
        title: 'Test Course',
        description: 'Test course for certificate generation',
        price: 99.99,
        durationMinutes: 60,
        isPublished: true,
        authorId: testProfileId
      })
      .select()
      .single();
      
    if (courseError) {
      console.error('Error creating test course:', courseError);
      return false;
    }
    
    console.log('✅ Created test course');
    
    // 3. Create a test enrollment
    const testEnrollmentId = `test-enrollment-${Date.now()}`;
    
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        id: testEnrollmentId,
        userId: testProfileId,
        courseId: testCourseId,
        enrolledAt: new Date().toISOString(),
        completedLessons: ['lesson1', 'lesson2'],
        progress: 100,
        lastAccessedAt: new Date().toISOString()
      })
      .select()
      .single();
      
    if (enrollmentError) {
      console.error('Error creating test enrollment:', enrollmentError);
      return false;
    }
    
    console.log('✅ Created test enrollment');
    
    // 4. Generate a certificate
    const certificateNumber = `CERT-${Date.now()}-TEST`;
    const certificateUrl = `/certificates/${certificateNumber}.pdf`;
    
    const { data: certificate, error: certificateError } = await supabase
      .from('certificates')
      .insert({
        enrollmentId: testEnrollmentId,
        userId: testProfileId,
        courseId: testCourseId,
        certificateNumber,
        certificateUrl,
        issuedAt: new Date().toISOString()
      })
      .select()
      .single();
      
    if (certificateError) {
      console.error('Error creating certificate:', certificateError);
      return false;
    }
    
    console.log('✅ Created certificate');
    
    // 5. Update enrollment with certificate info
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({
        certificateIssued: true,
        certificateUrl
      })
      .eq('id', testEnrollmentId);
      
    if (updateError) {
      console.error('Error updating enrollment:', updateError);
      return false;
    }
    
    console.log('✅ Updated enrollment with certificate info');
    
    // 6. Fetch the certificate to verify
    const { data: fetchedCertificate, error: fetchError } = await supabase
      .from('certificates')
      .select(`
        *,
        courses:courseId (
          title,
          description
        )
      `)
      .eq('id', certificate.id)
      .single();
      
    if (fetchError) {
      console.error('Error fetching certificate:', fetchError);
      return false;
    }
    
    console.log('✅ Fetched certificate with course data');
    console.log('Certificate:', {
      id: fetchedCertificate.id,
      certificateNumber: fetchedCertificate.certificateNumber,
      courseName: fetchedCertificate.courses?.title || 'Unknown Course'
    });
    
    // 7. Clean up test data
    await supabase.from('certificates').delete().eq('id', certificate.id);
    await supabase.from('enrollments').delete().eq('id', testEnrollmentId);
    await supabase.from('courses').delete().eq('id', testCourseId);
    await supabase.from('profiles').delete().eq('id', testProfileId);
    
    console.log('✅ Cleaned up test data');
    
    return true;
  } catch (error) {
    console.error('Unexpected error in certificate test:', error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Running database tests...');
  
  const certificateTestResult = await testCertificateGeneration();
  
  console.log('\nTest Results:');
  console.log(`Certificate Generation: ${certificateTestResult ? '✅ PASS' : '❌ FAIL'}`);
  
  process.exit(certificateTestResult ? 0 : 1);
}

// Run the tests
runTests(); 