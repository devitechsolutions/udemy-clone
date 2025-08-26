import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Menu, X, Award } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';
import { CourseNavigation } from '../components/CourseNavigation';
import { LessonNotes } from '../components/LessonNotes';
import { useCourse } from '../context/CourseContext';

export const CoursePage: React.FC = () => {
  const {
    currentCourse,
    currentLesson,
    setCurrentLesson,
    markLessonComplete,
    addNote,
    getCourseProgress,
    notes
  } = useCourse();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Mock user ID for demo
  const userId = '1';

  if (!currentCourse || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Course Selected</h2>
          <p className="text-gray-600">Please select a course to start learning.</p>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(currentCourse.id, userId);
  const currentLessonData = getCurrentLessonData();
  const allLessons = getAllLessons();
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson);

  function getCurrentLessonData() {
    for (const unit of currentCourse.units) {
      const lesson = unit.lessons.find(l => l.id === currentLesson);
      if (lesson) return lesson;
    }
    return null;
  }

  function getAllLessons() {
    return currentCourse.units.flatMap(unit => unit.lessons);
  }

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLesson(nextLesson.id);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLesson = allLessons[currentLessonIndex - 1];
      setCurrentLesson(previousLesson.id);
    }
  };

  const handleVideoComplete = () => {
    if (!progress?.completedLessons.includes(currentLesson)) {
      markLessonComplete(currentCourse.id, currentLesson, userId);
      
      // Check if course is completed
      const totalLessons = allLessons.length;
      const completedLessons = (progress?.completedLessons.length || 0) + 1;
      
      if (completedLessons === totalLessons) {
        setShowCompletionModal(true);
      } else {
        // Auto-advance to next lesson after 3 seconds
        setTimeout(() => {
          goToNextLesson();
        }, 3000);
      }
    }
  };

  const handleAddNote = (content: string, timestamp: number) => {
    addNote({
      lessonId: currentLesson,
      userId,
      content,
      timestamp
    });
  };

  if (!currentLessonData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600">The requested lesson could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed left-0 top-0 h-full w-80 z-50">
            <CourseNavigation
              course={currentCourse}
              currentLesson={currentLesson}
              progress={progress}
              onLessonSelect={(lessonId) => {
                setCurrentLesson(lessonId);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <CourseNavigation
          course={currentCourse}
          currentLesson={currentLesson}
          progress={progress}
          onLessonSelect={setCurrentLesson}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-gray-900 truncate mx-4">
              {currentLessonData.title}
            </h1>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-black p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <VideoPlayer
              videoUrl={currentLessonData.videoUrl}
              onProgress={(time) => setCurrentTime(time)}
              onComplete={handleVideoComplete}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 bg-gray-50 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Lesson Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentLessonData.title}
                      </h1>
                      <p className="text-gray-600 leading-relaxed">
                        {currentLessonData.description}
                      </p>
                    </div>
                    
                    {progress?.completedLessons.includes(currentLesson) && (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                      onClick={goToPreviousLesson}
                      disabled={currentLessonIndex === 0}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    
                    <div className="text-sm text-gray-500">
                      Lesson {currentLessonIndex + 1} of {allLessons.length}
                    </div>
                    
                    <button
                      onClick={goToNextLesson}
                      disabled={currentLessonIndex === allLessons.length - 1}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes Section */}
                <LessonNotes
                  lessonId={currentLesson}
                  notes={notes}
                  onAddNote={handleAddNote}
                  currentTime={currentTime}
                />
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                
                {/* Course Progress */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Course Completion</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {progress?.progressPercentage || 0}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress?.progressPercentage || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {progress?.completedLessons.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {allLessons.length - (progress?.completedLessons.length || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Remaining</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instructor</span>
                      <span className="font-medium text-gray-900">{currentCourse.instructor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium text-gray-900">{currentCourse.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students</span>
                      <span className="font-medium text-gray-900">{currentCourse.studentsCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium text-gray-900">{currentCourse.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-6">
              You've successfully completed <strong>{currentCourse.title}</strong>
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                View Certificate
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};