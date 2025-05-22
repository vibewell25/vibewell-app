"use client";

import { useState } from "react";
import Link from "next/link";

interface LessonListProps {
  lessons: any[];
  courseId: string;
  currentLessonId?: string;
  userProgress?: {
    completedLessons: string[];
    currentLessonId?: string;
  };
}

export function LessonList({ lessons, courseId, currentLessonId, userProgress }: LessonListProps) {
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
  
  const isLessonCompleted = (lessonId: string) => {
    return userProgress?.completedLessons.includes(lessonId) || false;
  };
  
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Course Content</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {lessons.length} lessons • {lessons.reduce((acc, lesson) => acc + lesson.durationMinutes, 0)} minutes
        </p>
      </div>
      
      <div className="divide-y">
        {sortedLessons.map((lesson) => {
          const isActive = lesson.id === currentLessonId;
          const isCompleted = isLessonCompleted(lesson.id);
          
          return (
            <div 
              key={lesson.id} 
              className={`p-4 ${isActive ? 'bg-muted' : ''}`}
            >
              <Link
                href={`/courses/${courseId}/lessons/${lesson.id}`}
                className="flex items-start gap-3"
              >
                <div className="mt-1 flex-shrink-0">
                  {isCompleted ? (
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs text-muted-foreground">
                      {lesson.order}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                    {lesson.title}
                  </h4>
                  
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{lesson.durationMinutes} min</span>
                    </div>
                    
                    {lesson.isPreview && (
                      <span className="bg-muted px-1.5 py-0.5 rounded text-xs">Preview</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
} 