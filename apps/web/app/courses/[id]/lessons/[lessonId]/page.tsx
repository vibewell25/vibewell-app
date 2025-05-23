"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { courses, lessons, courseEnrollments } from "@/lib/mock-data";
import { LessonList } from "@/components/courses/lesson-list";
import { CourseProgress } from "@/components/courses/course-progress";

// Define params as Promise to match Next.js 15 requirements
export default function LessonPage({ 
  params 
}: { 
  params: Promise<{ id: string; lessonId: string }> 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [prevLesson, setPrevLesson] = useState<any>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        // Get the resolved params
        const resolvedParams = await params;
        
        // This would be an API call in a real application
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the course
        const foundCourse = courses.find(c => c.id === resolvedParams.id);
        if (!foundCourse) {
          return notFound();
        }
        
        setCourse(foundCourse);
        
        // Find the lesson
        const foundLesson = lessons.find(l => l.id === resolvedParams.lessonId && l.courseId === resolvedParams.id);
        if (!foundLesson) {
          return notFound();
        }
        
        setLesson(foundLesson);
        
        // Find all lessons for this course
        const foundLessons = lessons.filter(l => l.courseId === resolvedParams.id)
          .sort((a, b) => a.order - b.order);
        setCourseLessons(foundLessons);
        
        // Find next and previous lessons
        const currentIndex = foundLessons.findIndex(l => l.id === resolvedParams.lessonId);
        if (currentIndex > 0) {
          setPrevLesson(foundLessons[currentIndex - 1]);
        }
        
        if (currentIndex < foundLessons.length - 1) {
          setNextLesson(foundLessons[currentIndex + 1]);
        }
        
        // Check enrollment (using mock user id 'c1' for demonstration)
        const foundEnrollment = courseEnrollments.find(e => e.courseId === resolvedParams.id && e.userId === 'c1');
        setIsEnrolled(!!foundEnrollment);
        setEnrollment(foundEnrollment || null);
        
        // Check if this lesson is completed
        if (foundEnrollment && foundEnrollment.completedLessons.includes(resolvedParams.lessonId)) {
          setLessonCompleted(true);
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLessonData();
  }, [params]);
  
  const handleCompleteLesson = async () => {
    if (lessonCompleted) return;
    
    setIsCompleting(true);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state to reflect completion
      setLessonCompleted(true);
      
      // Update enrollment data
      if (enrollment) {
        const updatedCompletedLessons = [...enrollment.completedLessons, lesson.id];
        const updatedProgress = Math.round((updatedCompletedLessons.length / courseLessons.length) * 100);
        
        setEnrollment({
          ...enrollment,
          completedLessons: updatedCompletedLessons,
          progress: updatedProgress,
          lastAccessedAt: new Date()
        });
      }
      
      // If there's a next lesson, you could automatically navigate there
      // if (nextLesson) {
      //   router.push(`/courses/${course.id}/lessons/${nextLesson.id}`);
      // }
    } catch (error) {
      console.error("Error completing lesson:", error);
    } finally {
      setIsCompleting(false);
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
  
  if (!course || !lesson) {
    return notFound();
  }
  
  // Calculate progress for the course
  const progress = enrollment 
    ? Math.round((enrollment.completedLessons.length / courseLessons.length) * 100)
    : 0;
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link 
          href={`/courses/${course.id}`}
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Course
        </Link>
        
        <h1 className="text-2xl font-bold">{course.title}</h1>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg overflow-hidden bg-black">
            {/* This would be a video player in a real application */}
            <div className="aspect-video relative flex items-center justify-center bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </div>
              
              {lesson.isPreview && !isEnrolled && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                  <h3 className="text-xl font-bold mb-2">Preview Available</h3>
                  <p className="text-white/80 mb-4">Enroll in the course to watch the full content</p>
                  <Link
                    href={`/courses/${course.id}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                  >
                    Enroll Now
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{lesson.title}</h2>
            
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{lesson.durationMinutes} minutes</span>
              </div>
              
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Lesson {lesson.order} of {courseLessons.length}</span>
              </div>
              
              {lessonCompleted && (
                <div className="flex items-center gap-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Completed</span>
                </div>
              )}
            </div>
            
            <div className="text-muted-foreground mb-6">
              <p>{lesson.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {!lessonCompleted && isEnrolled && (
                <button
                  onClick={handleCompleteLesson}
                  disabled={isCompleting}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-70"
                >
                  {isCompleting ? "Updating..." : "Mark as Completed"}
                </button>
              )}
              
              {prevLesson && (
                <Link
                  href={`/courses/${course.id}/lessons/${prevLesson.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Previous Lesson
                </Link>
              )}
              
              {nextLesson && (
                <Link
                  href={`/courses/${course.id}/lessons/${nextLesson.id}`}
                  className={`inline-flex h-10 items-center justify-center rounded-md ${lessonCompleted ? 'bg-primary text-primary-foreground' : 'border'} px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90`}
                >
                  Next Lesson
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
          
          {/* Additional resources or downloads would go here */}
        </div>
        
        <div className="space-y-6">
          {/* Course Progress */}
          {isEnrolled && enrollment && (
            <CourseProgress
              progress={progress}
              totalLessons={courseLessons.length}
              completedLessons={enrollment.completedLessons.length}
              lastAccessedAt={enrollment.lastAccessedAt}
            />
          )}
          
          {/* Lesson List */}
          <LessonList
            lessons={courseLessons}
            courseId={course.id}
            currentLessonId={lesson.id}
            userProgress={enrollment ? {
              completedLessons: enrollment.completedLessons,
              currentLessonId: lesson.id
            } : undefined}
          />
        </div>
      </div>
    </div>
  );
} 