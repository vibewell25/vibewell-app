import { Metadata } from "next";
import { CourseGrid } from "@/components/courses/course-grid";
import { courses } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Browse Courses | VibeWell",
  description: "Discover and enroll in beauty and wellness courses from top industry professionals",
};

export default function CoursesPage() {
  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Beauty & Wellness Courses</h1>
        <p className="text-muted-foreground">
          Learn professional techniques and enhance your skills with our expert-led courses.
        </p>
      </div>
      
      <div className="my-8">
        <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Beauty Courses" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
            <div className="px-8 py-6 max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Expand Your Skills
              </h2>
              <p className="text-white/90 mb-4 hidden sm:block">
                Learn from industry experts and advance your career with professional beauty and wellness education.
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Explore Top Courses
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <CourseGrid 
        courses={courses} 
        showFilters={true}
      />
    </div>
  );
} 