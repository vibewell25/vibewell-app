"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function CertificateViewPage() {
  const params = useParams<{ id: string }>();
  const certificateId = params.id;
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [certificate, setCertificate] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    const fetchCertificateData = async () => {
      if (!certificateId) return;
      
      const supabase = createClient();
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/auth/signin");
          return;
        }
        
        // Get certificate data
        const { data: certificateData, error } = await supabase
          .from("certificates")
          .select(`
            *,
            courses:courseId (*),
            profiles:userId (*)
          `)
          .eq("id", certificateId)
          .single();
          
        if (error || !certificateData) {
          toast({
            title: "Certificate Not Found",
            description: "The certificate you're looking for couldn't be found",
            variant: "destructive",
          });
          router.push("/profile/dashboard");
          return;
        }
        
        // Verify that the certificate belongs to the current user
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("userId", user.id)
          .single();
          
        if (!userProfile || (userProfile.id !== certificateData.userId && !user.app_metadata?.isAdmin)) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this certificate",
            variant: "destructive",
          });
          router.push("/profile/dashboard");
          return;
        }
        
        setCertificate(certificateData);
        setCourse(certificateData.courses);
        setProfile(certificateData.profiles);
      } catch (error) {
        console.error("Error fetching certificate data:", error);
        toast({
          title: "Error",
          description: "Failed to load certificate data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCertificateData();
  }, [certificateId, router, toast]);
  
  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!certificate || !course || !profile) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
          <p className="mb-6">The certificate you're looking for couldn't be found or you don't have access to view it.</p>
          <Link
            href="/profile/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Format dates
  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/profile/dashboard"
          className="text-primary hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <a 
              href={certificate.certificateUrl || "#"} 
              download={`certificate-${certificate.certificateNumber}.pdf`}
            >
              Download Certificate
            </a>
          </Button>
          <Button asChild>
            <Link href={`/courses/${course.id}`}>
              View Course
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Certificate Preview */}
      <div className="bg-white border-8 border-double border-gray-200 rounded-lg p-12 shadow-lg relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-64 h-64 text-primary">
            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="text-center mb-8">
          <div className="mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto text-primary">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl uppercase tracking-widest text-gray-700 font-light mb-2">Certificate of Completion</h1>
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-full my-4" />
        </div>
        
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">This certifies that</p>
          <h2 className="text-4xl font-serif italic my-4 text-gray-800">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-lg text-gray-600 mb-6">has successfully completed the course</p>
          <h3 className="text-2xl font-semibold mb-1 text-primary">{course.title}</h3>
          <p className="text-gray-600">{course.description && course.description.substring(0, 100)}...</p>
        </div>
        
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="text-center">
            <div className="mb-4 h-px bg-gray-300 w-4/5 mx-auto" />
            <p className="text-sm uppercase tracking-wider text-gray-600">Date Issued</p>
            <p className="font-medium">{issuedDate}</p>
          </div>
          <div className="text-center">
            <div className="mb-4 h-px bg-gray-300 w-4/5 mx-auto" />
            <p className="text-sm uppercase tracking-wider text-gray-600">Certificate Number</p>
            <p className="font-medium text-gray-800">{certificate.certificateNumber}</p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>This certificate verifies the completion of the above mentioned course on the VibeWell platform.</p>
          <p>To verify this certificate, please visit: vibewell.com/verify/{certificate.certificateNumber}</p>
        </div>
      </div>
      
      <div className="mt-12 bg-card border rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-6">Certificate Details</h2>
        
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <dt className="text-muted-foreground">Certificate Number</dt>
            <dd className="font-medium">{certificate.certificateNumber}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">Issue Date</dt>
            <dd className="font-medium">{issuedDate}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">Recipient</dt>
            <dd className="font-medium">{profile.firstName} {profile.lastName}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">Course</dt>
            <dd className="font-medium">{course.title}</dd>
          </div>
          <div className="space-y-1 md:col-span-2">
            <dt className="text-muted-foreground">Course Description</dt>
            <dd>{course.description}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
} 