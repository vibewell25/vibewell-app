"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { issueCertificate } from "@/lib/certificates";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function CourseCompletionPage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      const supabase = createClient();
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/auth/signin");
          return;
        }
        
        // Get user profile
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .eq("userId", user.id)
          .single();
          
        if (!profiles) {
          router.push("/auth/signin");
          return;
        }
        
        // Get course data
        const { data: courseData } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();
          
        if (!courseData) {
          router.push("/courses");
          return;
        }
        
        setCourse(courseData);
        
        // Get enrollment data
        const { data: enrollmentData } = await supabase
          .from("enrollments")
          .select("*")
          .eq("userId", profiles.id)
          .eq("courseId", courseId)
          .single();
          
        if (!enrollmentData) {
          router.push(`/courses/${courseId}`);
          return;
        }
        
        // Check if course is completed
        const { data: lessons } = await supabase
          .from("lessons")
          .select("id")
          .eq("courseId", courseId);
          
        const isCompleted = 
          lessons && 
          enrollmentData.completedLessons && 
          lessons.length > 0 && 
          enrollmentData.completedLessons.length >= lessons.length;
          
        if (!isCompleted) {
          router.push(`/courses/${courseId}`);
          return;
        }
        
        setEnrollment(enrollmentData);
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast({
          title: "Error",
          description: "Failed to load course completion data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, router, toast]);
  
  const handleGetCertificate = async () => {
    if (!course || !enrollment) return;
    
    setIsProcessing(true);
    
    try {
      // Issue certificate
      const certificate = await issueCertificate(
        enrollment.id,
        enrollment.userId,
        courseId
      );
      
      toast({
        title: "Certificate Issued!",
        description: "Your certificate has been generated successfully",
      });
      
      // Redirect to view certificate
      router.push(`/certificates/${certificate.id}`);
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast({
        title: "Error",
        description: "Failed to issue certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!course || !enrollment) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-6">The course you're looking for couldn't be found or you're not enrolled.</p>
          <Link
            href="/courses"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-16 max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-lg text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Congratulations!</h1>
        <p className="text-xl mb-2">You've completed "{course.title}"</p>
        <p className="text-muted-foreground">This achievement demonstrates your dedication and commitment to learning.</p>
      </div>
      
      <div className="bg-card border rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-6">Your Certificate is Ready</h2>
        
        {enrollment.certificateIssued ? (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-muted/50">
              <p className="mb-2">Your certificate has already been issued.</p>
              <p className="text-sm text-muted-foreground mb-4">You can view or download it below.</p>
              
              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <Link href={enrollment.certificateUrl || "#"} target="_blank">
                    View Certificate
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href={enrollment.certificateUrl || "#"} 
                    download={`certificate-${course.title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                  >
                    Download
                  </a>
                </Button>
              </div>
            </div>
            
            <div>
              <Link 
                href="/learning" 
                className="text-primary hover:underline text-sm"
              >
                Return to My Learning
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-muted/50">
              <p className="mb-2">Your certificate is ready to be generated.</p>
              <p className="text-sm text-muted-foreground mb-4">Click the button below to get your certificate.</p>
              
              <Button 
                onClick={handleGetCertificate} 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Get My Certificate"}
              </Button>
            </div>
            
            <div>
              <Link 
                href="/learning" 
                className="text-primary hover:underline text-sm"
              >
                Return to My Learning
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-4">
            <div className="p-2 bg-primary/10 rounded-full inline-block mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Explore More Courses</h3>
            <p className="text-sm text-muted-foreground mb-3">Continue your learning journey with our other courses</p>
            <Link href="/courses" className="text-primary text-sm hover:underline">Browse Courses</Link>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="p-2 bg-primary/10 rounded-full inline-block mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Share Your Experience</h3>
            <p className="text-sm text-muted-foreground mb-3">Leave a review and share what you've learned</p>
            <Link href={`/courses/${courseId}?review=true`} className="text-primary text-sm hover:underline">Write a Review</Link>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="p-2 bg-primary/10 rounded-full inline-block mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Connect with Others</h3>
            <p className="text-sm text-muted-foreground mb-3">Join our community and connect with fellow learners</p>
            <Link href="/social" className="text-primary text-sm hover:underline">Visit Community</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 