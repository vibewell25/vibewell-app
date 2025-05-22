"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { courses, lessons, providers, courseEnrollments } from "@/lib/mock-data";
import { LessonList } from "@/components/courses/lesson-list";
import { CourseGrid } from "@/components/courses/course-grid";

// Add a helper function to safely get category name
function getCategoryName(category: any): string {
  if (!category) return '';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && 'name' in category) return category.name;
  return '';
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // This would be an API call in a real application
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the course
        const foundCourse = courses.find(c => c.id === params.id);
        if (!foundCourse) {
          return notFound();
        }
        
        setCourse(foundCourse);
        
        // Find the provider
        const foundProvider = providers.find(p => p.id === foundCourse.providerId);
        setProvider(foundProvider || null);
        
        // Find the lessons for this course
        const foundLessons = lessons.filter(l => l.courseId === foundCourse.id);
        setCourseLessons(foundLessons);
        
        // Check if user is enrolled (using mock user id 'c1' for demonstration)
        const foundEnrollment = courseEnrollments.find(e => e.courseId === foundCourse.id && e.userId === 'c1');
        setIsEnrolled(!!foundEnrollment);
        setEnrollment(foundEnrollment || null);
        
        // Find related courses (same category or same provider)
        const related = courses
          .filter(c => c.id !== params.id && (c.category === foundCourse.category || c.providerId === foundCourse.providerId))
          .slice(0, 4);
        setRelatedCourses(related);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseData();
  }, [params.id]);
  
  const handleEnroll = async () => {
    setIsEnrolling(true);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful enrollment
      setIsEnrolled(true);
      
      // Redirect to first lesson
      if (courseLessons.length > 0) {
        const firstLesson = courseLessons.sort((a, b) => a.order - b.order)[0];
        router.push(`/courses/${course.id}/lessons/${firstLesson.id}`);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    } finally {
      setIsEnrolling(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return notFound();
  }
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link 
          href="/courses" 
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Courses
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {course.category && (
              <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded mr-2">
                {getCategoryName(course.category)}
              </div>
            )}
            {course.level && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {course.level}
              </span>
            )}
          </div>
          
          <div className="aspect-video rounded-lg overflow-hidden mb-8">
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 9 6 6" />
                  <path d="m15 9-6 6" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-3">About This Course</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {course.description}
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-1">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Professional techniques used in the industry</span>
                </div>
                <div className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-1">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Equipment and tools selection and usage</span>
                </div>
                <div className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-1">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Common problems and troubleshooting</span>
                </div>
                <div className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-1">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Business practices and client relations</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
              <LessonList 
                lessons={courseLessons}
                courseId={course.id}
                userProgress={enrollment ? {
                  completedLessons: enrollment.completedLessons,
                  currentLessonId: enrollment.currentLessonId
                } : undefined}
              />
            </div>
            
            {provider && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Instructor</h2>
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                    {provider.avatarUrl ? (
                      <img
                        src={provider.avatarUrl}
                        alt={`${provider.firstName} ${provider.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{provider.firstName} {provider.lastName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {provider.specialties?.join(", ") || "Beauty and wellness professional"}
                    </p>
                    <Link
                      href={`/providers/${provider.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border bg-card shadow-sm sticky top-24">
            <div className="aspect-video relative overflow-hidden">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 9 6 6" />
                    <path d="m15 9-6 6" />
                  </svg>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="text-2xl font-bold text-white">${course.price.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="p-5">
              {isEnrolled ? (
                <Link
                  href={courseLessons.length > 0 ? `/courses/${course.id}/lessons/${courseLessons[0].id}` : '#'}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-70"
                >
                  {isEnrolling ? "Processing..." : "Enroll Now"}
                </button>
              )}
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                30-Day Money-Back Guarantee
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">This Course Includes:</h3>
                
                <ul className="space-y-3">
                  <li className="flex gap-2 items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 8-6 4 6 4V8Z"/>
                      <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
                    </svg>
                    <span>{course.totalLessons} on-demand video lessons</span>
                  </li>
                  <li className="flex gap-2 items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{course.durationHours} hours of content</span>
                  </li>
                  <li className="flex gap-2 items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <path d="M3 9h18"/>
                      <path d="M9 21V9"/>
                    </svg>
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex gap-2 items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 19v-9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2Z"/>
                      <path d="M8 12H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4"/>
                      <path d="M2 19h20"/>
                    </svg>
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex gap-2 items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span>Completion certificate</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Course Stats:</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-lg font-bold">{course.enrolledCount}</div>
                    <div className="text-xs text-muted-foreground">Enrolled</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-lg font-bold flex items-center justify-center">
                      {course.rating}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-yellow-500 ml-1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {relatedCourses.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Courses</h2>
          <CourseGrid courses={relatedCourses} />
        </div>
      )}
    </div>
  );
} 