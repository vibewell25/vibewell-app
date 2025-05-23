import { createServerClient } from '@/lib/supabase/server';
import { Certificate } from '@/components/certificate';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { VerifiedBadge } from '@/components/verify/verified-badge';
import { VerificationDetails } from '@/components/verify/verification-details';

interface VerifyPageProps {
  params: {
    certificateId: string;
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { certificateId } = params;
  const supabase = createServerClient();
  
  // Fetch certificate data
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select(`
      *,
      courses:courseId (
        id,
        title,
        description,
        authorId
      ),
      users:userId (
        id,
        firstName,
        lastName,
        email
      ),
      enrollments:enrollmentId (
        id,
        enrolledAt,
        completedAt
      )
    `)
    .eq('certificateNumber', certificateId)
    .single();
  
  // If certificate not found or error
  if (error || !certificate) {
    return notFound();
  }
  
  // Format certificate for display
  const formattedCertificate = {
    id: certificate.id,
    certificateNumber: certificate.certificateNumber,
    issuedAt: certificate.issuedAt,
    course: {
      title: certificate.courses?.title || 'Unknown Course',
      description: certificate.courses?.description || '',
    },
    user: {
      firstName: certificate.users?.firstName || 'Unknown',
      lastName: certificate.users?.lastName || 'User',
    }
  };
  
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 text-center">
        <VerifiedBadge />
        <h1 className="text-3xl font-bold mt-4">Certificate Verification</h1>
        <p className="text-muted-foreground mt-2">
          This certificate has been verified as authentic and issued by VibeWell.
        </p>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <VerificationDetails 
          certificate={certificate}
          enrollment={certificate.enrollments}
        />
      </div>
      
      <Certificate certificate={formattedCertificate} />
      
      <div className="mt-8 flex justify-center gap-4">
        <Button variant="outline" onClick={() => window.print()}>
          Print Certificate
        </Button>
        <Button asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            Visit VibeWell
          </a>
        </Button>
      </div>
    </div>
  );
} 