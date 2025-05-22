"use client";

import { useState } from "react";
import Link from "next/link";

interface CourseGridProps {
  courses: any[];
  title?: string;
  showFilters?: boolean;
}

export function CourseGrid({ courses, title, showFilters = false }: CourseGridProps) {
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("default");
  
  // Extract unique categories and levels from courses
  const categories = Array.from(new Set(courses.map(course => course.category)));
  const levels = Array.from(new Set(courses.map(course => course.level)));
  
  const applyFilters = () => {
    let result = [...courses];
    
    if (activeCategory) {
      result = result.filter(course => course.category === activeCategory);
    }
    
    if (activeLevel) {
      result = result.filter(course => course.level === activeLevel);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.enrolledCount - a.enrolledCount);
        break;
      default:
        // Default sorting (could be by popularity or featured)
        break;
    }
    
    setFilteredCourses(result);
  };
  
  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category);
    setTimeout(() => {
      applyFilters();
    }, 0);
  };
  
  const handleLevelFilter = (level: string | null) => {
    setActiveLevel(level);
    setTimeout(() => {
      applyFilters();
    }, 0);
  };
  
  const handleSort = (option: string) => {
    setSortOption(option);
    setTimeout(() => {
      applyFilters();
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      
      {showFilters && (
        <div className="space-y-4 border-b pb-4">
          {/* Category filters */}
          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Level filters */}
          <div>
            <h3 className="text-sm font-medium mb-2">Level</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleLevelFilter(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeLevel === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All Levels
              </button>
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelFilter(level)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeLevel === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sorting options */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
              className="py-1 px-2 rounded border text-sm"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      )}
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-video relative overflow-hidden">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground opacity-50">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 9 6 6" />
                      <path d="m15 9-6 6" />
                    </svg>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8">
                  <div className="flex justify-between items-center">
                    <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <span className="bg-white/90 text-black text-xs px-2 py-1 rounded flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {course.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">
                  <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
                    {course.title}
                  </Link>
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold">${course.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">{course.durationHours} hours • {course.totalLessons} lessons</span>
                </div>
                
                <div className="mt-4">
                  <Link
                    href={`/courses/${course.id}`}
                    className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
} 