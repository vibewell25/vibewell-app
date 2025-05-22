"use client";

import { useState } from "react";
import Link from "next/link";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    durationHours: number;
    totalLessons: number;
    category?: string;
    level?: string;
    enrolledCount?: number;
    rating?: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
      <Link href={`/courses/${course.id}`} className="block">
        <div className="aspect-video bg-muted relative overflow-hidden">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
          
          {course.level && (
            <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs py-1 px-2 rounded">
              {course.level}
            </div>
          )}
          
          {course.category && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs py-1 px-2 rounded">
              {course.category}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
          
          {course.description && (
            <p className="text-muted-foreground text-sm mt-1 mb-3 line-clamp-2">
              {course.description}
            </p>
          )}
          
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{course.durationHours} hours</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
              <span>{course.totalLessons} lessons</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="font-bold text-primary">${course.price.toFixed(2)}</div>
            
            {course.rating && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-yellow-500">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="font-medium">{course.rating.toFixed(1)}</span>
                {course.enrolledCount && (
                  <span className="text-xs text-muted-foreground">({course.enrolledCount})</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
} 