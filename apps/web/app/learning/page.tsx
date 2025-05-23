"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { courses, lessons, courseEnrollments } from "@/lib/mock-data";
import { CourseGrid } from "@/components/courses/course-grid";

export default function LearningDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        // This would be an API call in a real application
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get enrollments for the current user (using mock user id 'c1' for demonstration)
        const userEnrollments = courseEnrollments.filter(enrollment => enrollment.userId === 'c1');
        
        // Get course details for each enrollment
        const userCourses = userEnrollments.map(enrollment => {
          const course = courses.find(c => c.id === enrollment.courseId);
          const courseLessons = lessons.filter(l => l.courseId === enrollment.courseId);
          
          if (!course) return null;
          
          const nextLesson = courseLessons
            .filter(lesson => !enrollment.completedLessons.includes(lesson.id))
            .sort((a, b) => a.order - b.order)[0];
          
          return {
            ...course,
            enrollment: {
              ...enrollment,
              progress: Math.round((enrollment.completedLessons.length / courseLessons.length) * 100),
              totalLessons: courseLessons.length,
              nextLesson
            }
          };
        }).filter(Boolean) as any[];
        
        setEnrolledCourses(userCourses);
        
        // Get user's enrolled course categories
        const userCourseCategories = userCourses
          .map(course => course.category)
          .filter(Boolean);
        
        // Get recommendations based on enrolled course categories
        // Exclude courses the user is already enrolled in
        const enrolledCourseIds = userCourses.map(course => course.id);
        const recommendations = courses
          .filter(course => 
            course && 
            !enrolledCourseIds.includes(course.id) && 
            ((course.category && userCourseCategories.includes(course.category)) || 
             (course.rating && course.rating >= 4.7))
          )
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6);
        
        setRecommendedCourses(recommendations);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEnrolledCourses();
  }, []);
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Learning</h1>
        <Link
          href="/courses"
          className="text-sm text-primary hover:underline"
        >
          Browse More Courses
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : enrolledCourses.length > 0 ? (
        <div className="space-y-12">
          {/* In Progress Courses */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses
                .filter(course => course.enrollment.progress < 100)
                .map(course => (
                  <div key={course.id} className="rounded-lg border bg-card overflow-hidden shadow-sm">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 9 6 6" />
                            <path d="m15 9-6 6" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs py-1 px-2 rounded-full">
                        {course.enrollment.progress}% Complete
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                      
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${course.enrollment.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        <p className="mb-1">
                          {course.enrollment.completedLessons.length} of {course.enrollment.totalLessons} lessons completed
                        </p>
                        <p>
                          Last accessed: {new Date(course.enrollment.lastAccessedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {course.enrollment.nextLesson ? (
                        <Link
                          href={`/courses/${course.id}/lessons/${course.enrollment.nextLesson.id}`}
                          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                          Continue Learning
                        </Link>
                      ) : (
                        <Link
                          href={`/courses/${course.id}`}
                          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                          Go to Course
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Completed Courses */}
          {enrolledCourses.some(course => course.enrollment.progress === 100) && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Courses</h2>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses
                  .filter(course => course.enrollment.progress === 100)
                  .map(course => (
                    <div key={course.id} className="rounded-lg border bg-card overflow-hidden shadow-sm">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                              <path d="m9 9 6 6" />
                              <path d="m15 9-6 6" />
                            </svg>
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs py-1 px-2 rounded-full">
                          Completed
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                        
                        <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                          <div 
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-4">
                          <p className="mb-1">
                            All {course.enrollment.totalLessons} lessons completed
                          </p>
                          <p>
                            Completed on: {new Date(course.enrollment.lastAccessedAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/courses/${course.id}`}
                            className="inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
                          >
                            Review Course
                          </Link>
                          
                          {course.enrollment.certificateIssued ? (
                            <Link
                              href={course.enrollment.certificateUrl || '#'}
                              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                              target="_blank"
                            >
                              View Certificate
                            </Link>
                          ) : (
                            <Link
                              href={`/courses/${course.id}/completion`}
                              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                            >
                              Get Certificate
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Recommended Courses */}
          {recommendedCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
              <CourseGrid 
                courses={recommendedCourses}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">No courses yet</h2>
          <p className="text-muted-foreground mb-8">
            You haven't enrolled in any courses yet. Browse our courses to get started.
          </p>
          <Link
            href="/courses"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
} 