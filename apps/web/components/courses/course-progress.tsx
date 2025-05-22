"use client";

import { useState, useEffect } from "react";

interface CourseProgressProps {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt?: Date;
}

export function CourseProgress({
  progress,
  totalLessons,
  completedLessons,
  lastAccessedAt
}: CourseProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    // Animate the progress bar
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  // Format last accessed date
  const formatLastAccessed = (date?: Date) => {
    if (!date) return "Never";
    
    // Check if date is today
    const today = new Date();
    const accessDate = new Date(date);
    
    if (today.toDateString() === accessDate.toDateString()) {
      return `Today at ${accessDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if date is yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === accessDate.toDateString()) {
      return `Yesterday at ${accessDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, show the full date
    return accessDate.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Your Progress</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{progress}% Complete</span>
            <span>{completedLessons} of {totalLessons} lessons</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${animatedProgress}%` }}
            ></div>
          </div>
        </div>
        
        {progress === 100 ? (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <span className="font-medium">Congratulations!</span> You've completed this course.
              {/* <a href="#" className="block text-green-700 underline mt-1">Download your certificate</a> */}
            </div>
          </div>
        ) : progress > 0 ? (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <span className="font-medium">Keep going!</span> You're making great progress on this course.
              {lastAccessedAt && (
                <div className="text-xs mt-1">Last accessed: {formatLastAccessed(lastAccessedAt)}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md text-sm flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <div>
              <span className="font-medium">Ready to start?</span> Begin your learning journey by clicking on the first lesson.
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-bold">{totalLessons}</div>
            <div className="text-xs text-muted-foreground">Total Lessons</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-bold">{completedLessons}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
} 