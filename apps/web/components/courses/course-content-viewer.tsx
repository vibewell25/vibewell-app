"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  videoUrl?: string;
  contentType: "video" | "text" | "quiz";
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  modules: Module[];
  totalLessons: number;
  completedLessons: number;
}

interface CourseContentViewerProps {
  courseId: string;
}

export function CourseContentViewer({ courseId }: CourseContentViewerProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "discussions" | "resources">("content");

  // Mock course data - in a real app this would come from an API
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockCourse: Course = {
          id: courseId,
          title: "Yoga Fundamentals: Building Your Practice",
          description: "Learn the core principles and poses of yoga to build a strong foundation for your practice.",
          instructor: {
            id: "i1",
            name: "Sarah Johnson",
            avatar: "/avatars/instructor-1.jpg"
          },
          modules: [
            {
              id: "m1",
              title: "Introduction to Yoga",
              description: "Understand the history and philosophy of yoga",
              lessons: [
                {
                  id: "l1",
                  title: "What is Yoga?",
                  description: "An overview of yoga and its benefits",
                  duration: 15,
                  videoUrl: "https://example.com/videos/intro-to-yoga.mp4",
                  contentType: "video",
                  completed: true
                },
                {
                  id: "l2",
                  title: "The History of Yoga",
                  description: "Explore the ancient origins of yoga practice",
                  duration: 20,
                  videoUrl: "https://example.com/videos/history-of-yoga.mp4",
                  contentType: "video",
                  completed: true
                }
              ]
            },
            {
              id: "m2",
              title: "Basic Poses",
              description: "Learn the fundamental poses for beginners",
              lessons: [
                {
                  id: "l3",
                  title: "Mountain Pose (Tadasana)",
                  description: "The foundation of all standing poses",
                  duration: 10,
                  videoUrl: "https://example.com/videos/mountain-pose.mp4",
                  contentType: "video",
                  completed: false
                },
                {
                  id: "l4",
                  title: "Downward Facing Dog",
                  description: "One of the most recognized yoga poses",
                  duration: 12,
                  videoUrl: "https://example.com/videos/downward-dog.mp4",
                  contentType: "video",
                  completed: false
                },
                {
                  id: "l5",
                  title: "Child's Pose",
                  description: "A resting pose for relaxation",
                  duration: 8,
                  videoUrl: "https://example.com/videos/childs-pose.mp4",
                  contentType: "video",
                  completed: false
                }
              ]
            },
            {
              id: "m3",
              title: "Breathing Techniques",
              description: "Proper breathing for yoga practice",
              lessons: [
                {
                  id: "l6",
                  title: "Basics of Pranayama",
                  description: "Introduction to breath control",
                  duration: 18,
                  videoUrl: "https://example.com/videos/pranayama-basics.mp4",
                  contentType: "video",
                  completed: false
                },
                {
                  id: "l7",
                  title: "Quiz: Yoga Fundamentals",
                  description: "Test your knowledge of basic yoga concepts",
                  duration: 10,
                  contentType: "quiz",
                  completed: false
                }
              ]
            }
          ],
          totalLessons: 7,
          completedLessons: 2
        };
        
        setCourse(mockCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  const handleModuleSelect = (moduleIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(0);
    setPlaybackProgress(0);
  };

  const handleLessonSelect = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
    setPlaybackProgress(0);
  };

  const handleMarkComplete = async () => {
    if (!course) return;
    
    try {
      // In a real app, this would be an API call to update the lesson status
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update the local state
      const updatedCourse = { ...course };
      const currentLesson = updatedCourse.modules[currentModuleIndex].lessons[currentLessonIndex];
      
      if (!currentLesson.completed) {
        currentLesson.completed = true;
        updatedCourse.completedLessons += 1;
      }
      
      setCourse(updatedCourse);
      
      // Move to next lesson if available
      const currentModule = course.modules[currentModuleIndex];
      if (currentLessonIndex < currentModule.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else if (currentModuleIndex < course.modules.length - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
        setCurrentLessonIndex(0);
      }
      
      setPlaybackProgress(0);
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
    }
  };

  const handlePlaybackProgress = (progress: number) => {
    setPlaybackProgress(progress);
    
    // Auto-mark as complete when progress reaches 95%
    if (progress >= 95 && course && !course.modules[currentModuleIndex].lessons[currentLessonIndex].completed) {
      handleMarkComplete();
    }
  };

  const saveNotes = async () => {
    // In a real app, this would save notes to the backend
    console.log("Saving notes:", notes);
    setShowNotes(false);
    
    // Show a success message
    alert("Notes saved successfully!");
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render error state if course couldn't be loaded
  if (!course) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground">Failed to load course content.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule.lessons[currentLessonIndex];
  const progressPercentage = Math.round((course.completedLessons / course.totalLessons) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar - Course Navigation */}
      <div className="w-full lg:w-1/4 lg:max-w-xs">
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-lg">{course.title}</h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
          </div>
          
          {/* Module and Lesson Navigation */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id} className="border-b">
                <button
                  onClick={() => handleModuleSelect(moduleIndex)}
                  className={`w-full p-3 text-left font-medium flex justify-between items-center ${
                    moduleIndex === currentModuleIndex ? "bg-muted/70" : ""
                  }`}
                >
                  <span>{module.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                  </span>
                </button>
                
                {moduleIndex === currentModuleIndex && (
                  <div className="pl-4 pr-2 pb-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(moduleIndex, lessonIndex)}
                        className={`w-full py-2 px-3 text-left text-sm rounded-md my-1 flex items-center gap-2 ${
                          lessonIndex === currentLessonIndex
                            ? "bg-primary text-primary-foreground"
                            : lesson.completed
                            ? "bg-muted text-muted-foreground"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        {lesson.completed ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        )}
                        <span className="flex-1 truncate">{lesson.title}</span>
                        <span className="text-xs">{lesson.duration}m</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          {/* Lesson Header */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">{currentLesson.title}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="p-2 rounded-md hover:bg-muted"
                  title="Take Notes"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={handleMarkComplete}
                  disabled={currentLesson.completed}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentLesson.completed
                      ? "bg-green-100 text-green-600 cursor-default"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {currentLesson.completed ? "Completed" : "Mark Complete"}
                </button>
              </div>
            </div>
            <p className="mt-1 text-muted-foreground">{currentLesson.description}</p>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "content"
                  ? "border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Lesson Content
            </button>
            <button
              onClick={() => setActiveTab("discussions")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "discussions"
                  ? "border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Discussions
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "resources"
                  ? "border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Resources
            </button>
          </div>
          
          {/* Content Area */}
          <div className="p-4">
            {activeTab === "content" && (
              <div>
                {currentLesson.contentType === "video" ? (
                  <div className="space-y-4">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        <p className="text-muted-foreground">Video Player</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{playbackProgress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${playbackProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Video Controls Placeholder */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => handlePlaybackProgress(Math.min(playbackProgress + 10, 100))}
                        className="px-3 py-1 bg-muted rounded-md text-sm"
                      >
                        Simulate Progress
                      </button>
                    </div>
                  </div>
                ) : currentLesson.contentType === "quiz" ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Quiz: {currentLesson.title}</h3>
                    <p>This is a placeholder for a quiz interface.</p>
                    
                    <div className="space-y-4 mt-4">
                      <div className="p-4 border rounded-md">
                        <p className="font-medium mb-2">Question 1: What is the primary benefit of regular yoga practice?</p>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-2" />
                            <span>Increased flexibility and strength</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-2" />
                            <span>Weight loss only</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-2" />
                            <span>Developing psychic abilities</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-2" />
                            <span>All of the above</span>
                          </label>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p>This is text-based content for the lesson.</p>
                  </div>
                )}
                
                {/* Notes Modal */}
                {showNotes && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-lg">
                      <h3 className="text-xl font-semibold mb-4">Lesson Notes</h3>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border rounded-md h-64 resize-none"
                        placeholder="Take notes on this lesson..."
                      />
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => setShowNotes(false)}
                          className="px-4 py-2 border rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveNotes}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "discussions" && (
              <div className="p-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Discussion functionality would be implemented here.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === "resources" && (
              <div className="space-y-4">
                <h3 className="font-medium">Lesson Resources</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>Yoga Fundamentals PDF Guide</span>
                  </li>
                  <li className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Pose Reference Images</span>
                  </li>
                  <li className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
                    </svg>
                    <span>Practice Schedule Template</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Lesson Navigation */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => {
              if (currentLessonIndex > 0) {
                setCurrentLessonIndex(currentLessonIndex - 1);
              } else if (currentModuleIndex > 0) {
                setCurrentModuleIndex(currentModuleIndex - 1);
                setCurrentLessonIndex(course.modules[currentModuleIndex - 1].lessons.length - 1);
              }
            }}
            disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous Lesson
          </button>
          
          <button
            onClick={() => {
              if (currentLessonIndex < currentModule.lessons.length - 1) {
                setCurrentLessonIndex(currentLessonIndex + 1);
              } else if (currentModuleIndex < course.modules.length - 1) {
                setCurrentModuleIndex(currentModuleIndex + 1);
                setCurrentLessonIndex(0);
              }
            }}
            disabled={
              currentModuleIndex === course.modules.length - 1 &&
              currentLessonIndex === currentModule.lessons.length - 1
            }
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
} 