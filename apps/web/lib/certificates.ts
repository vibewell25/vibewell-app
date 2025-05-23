import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique certificate number
 */
export function generateCertificateNumber(courseId: string): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CERT-${timestamp.toString().slice(-8)}-${random}-${courseId.slice(-4)}`;
}

/**
 * Issue a certificate for a completed course
 */
export async function issueCertificate(enrollmentId: string, userId: string, courseId: string) {
  const supabase = createClient();
  
  try {
    // Generate certificate number
    const certificateNumber = generateCertificateNumber(courseId);
    
    // Certificate URL would typically be generated after creating a PDF
    // This is a placeholder URL
    const certificateUrl = `/certificates/${certificateNumber}.pdf`;
    
    // Create certificate record in database
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        id: uuidv4(),
        enrollmentId,
        userId,
        courseId,
        certificateNumber,
        certificateUrl,
        issuedAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error issuing certificate: ${error.message}`);
    }
    
    // Update enrollment record to mark certificate as issued
    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .update({
        certificateIssued: true,
        certificateUrl
      })
      .eq('id', enrollmentId);
    
    if (enrollmentError) {
      throw new Error(`Error updating enrollment: ${enrollmentError.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in issueCertificate:', error);
    throw error;
  }
}

/**
 * Get certificates for a user
 */
export async function getUserCertificates(userId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses:courseId (
          title,
          description
        )
      `)
      .eq('userId', userId)
      .order('issuedAt', { ascending: false });
    
    if (error) {
      throw new Error(`Error fetching certificates: ${error.message}`);
    }
    
    // Transform the data to include course name
    return data.map(cert => ({
      ...cert,
      courseName: cert.courses?.title || 'Unknown Course'
    }));
  } catch (error) {
    console.error('Error in getUserCertificates:', error);
    throw error;
  }
} 