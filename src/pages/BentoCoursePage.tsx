import React, { useState } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Download, FileText, ExternalLink, File, BookOpen as BookIcon } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Header } from '../components/Header';
import { AppleVideoPlayer } from '../components/AppleVideoPlayer';
import { BentoCourseNavigation } from '../components/BentoCourseNavigation';
import { QuickActionsCard } from '../components/QuickActionsCard';
import { InstructorCard } from '../components/InstructorCard';
import { AchievementCard } from '../components/AchievementCard';
import { BentoCard } from '../components/BentoCard';
import { useCourse } from '../context/CourseContext';

export const BentoCoursePage: React.FC = () => {
  const {
    currentCourse,
    currentLesson,
    setCurrentLesson,
    markLessonComplete,
    getCourseProgress,
    notes,
    addNote
  } = useCourse();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showNotesModal, setShowNotesModal] = useState(false);

  const exportNotesToWord = async () => {
    try {
      if (!currentCourse || !currentLessonData) return;
      
      const currentUnit = getCurrentUnit();
      
      // Get actual notes for this lesson
      const lessonNotes = notes
        .filter(note => note.lessonId === currentLesson)
        .sort((a, b) => a.timestamp - b.timestamp);
      
      if (lessonNotes.length === 0) {
        alert('No notes to export for this lesson.');
        return;
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              children: [
                new TextRun({
                  text: `${currentUnit?.title || 'Unit'} - ${currentLessonData.title}`,
                  bold: true,
                  size: 32,
                  color: "2563EB"
                })
              ],
              heading: HeadingLevel.HEADING_1
            }),
            
            // Course info
            new Paragraph({
              children: [
                new TextRun({
                  text: `Course: ${currentCourse.title}`,
                  size: 24
                })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `Exported: ${new Date().toLocaleDateString()}`,
                  size: 20,
                  color: "6B7280"
                })
              ]
            }),
            
            new Paragraph({ text: "" }), // Empty line
            
            // Notes header
            new Paragraph({
              children: [
                new TextRun({
                  text: "Lesson Notes",
                  bold: true,
                  size: 28
                })
              ],
              heading: HeadingLevel.HEADING_2
            }),
            
            // Notes content
            ...lessonNotes.map((note, index) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Note ${index + 1} - ${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60).toString().padStart(2, '0')}`,
                    bold: true,
                    size: 22,
                    color: "EA580C"
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Created: ${new Date(note.createdAt).toLocaleString()}`,
                    size: 18,
                    color: "6B7280",
                    italics: true
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: note.content,
                    size: 20
                  })
                ]
              }),
              new Paragraph({ text: "" }) // Empty line between notes
            ]).flat()
          ]
        }]
      });

      const buffer = await Packer.toBlob(doc);
      const fileName = `${currentUnit?.title || 'Unit'} - ${currentLessonData.title} - Notes.docx`;
      saveAs(buffer, fileName);
      
    } catch (error) {
      console.error('Error exporting notes:', error);
      alert('Failed to export notes. Please try again.');
    }
  };

  // Mock user ID for demo
  const userId = '1';

  if (!currentCourse || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  function getCurrentUnit() {
    for (const unit of currentCourse.units) {
      const lesson = unit.lessons.find(l => l.id === currentLesson);
      if (lesson) return unit;
    }
    return null;
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
      
      // Auto-advance to next lesson after 2 seconds
      setTimeout(() => {
        goToNextLesson();
      }, 2000);
    }
  };

  const handleAddNote = (noteContent: string) => {
    if (noteContent.trim()) {
      addNote({ 
        lessonId: currentLesson, 
        userId, 
        content: noteContent.trim(), 
        timestamp: Math.floor(currentTime) 
      });
    }
  };

  if (!currentLessonData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600">The requested lesson could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header 
        onBack={() => console.log('Navigate back to course catalog')}
        showBackButton={true}
      />
      
      {/* Mobile Navigation Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden">
          <div className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-full overflow-hidden">
              <BentoCourseNavigation
                course={currentCourse}
                currentLesson={currentLesson}
                progress={progress}
                onLessonSelect={(lessonId) => {
                  setCurrentLesson(lessonId);
                  setIsMobileNavOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 lg:p-8 pt-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Course Header - Only visible on desktop */}
          <div className="hidden lg:block mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                      {currentCourse.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      {currentCourse.level}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {currentCourse.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4 max-w-3xl">
                    {currentCourse.description}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>{currentCourse.duration}</span>
                    <span>{currentCourse.lessonsCount} lessons</span>
                    <span>{currentCourse.studentsCount.toLocaleString()} students</span>
                    <span>⭐ {currentCourse.rating}/5</span>
                  </div>
                </div>
                <img
                  src={currentCourse.thumbnail}
                  alt={currentCourse.title}
                  className="w-32 h-20 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="p-3 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1 mx-4 text-center">
                <h1 className="font-semibold text-gray-900 truncate text-lg">
                  {currentLessonData.title}
                </h1>
                <p className="text-sm text-gray-500 truncate">
                  {currentCourse.title}
                </p>
              </div>
              <div className="w-12" />
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            
            {/* Video Player - Hero Card */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 xl:col-span-4 order-1">
              <BentoCard className="p-3 sm:p-4 lg:p-6 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex-1 mb-3 sm:mb-4 lg:mb-6">
                    <AppleVideoPlayer
                      videoUrl={currentLessonData.videoUrl}
                      onProgress={(time) => setCurrentTime(time)}
                      onComplete={handleVideoComplete}
                    />
                  </div>
                
                  {/* Notes Section */}
                  <div className="mb-3 sm:mb-4 lg:mb-6 p-3 sm:p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center space-x-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Lesson Notes</span>
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      {/* Quick Note Input */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add a quick note at current timestamp..."
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              handleAddNote(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button 
                          className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            if (input && input.value.trim()) {
                              handleAddNote(input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Recent Notes Preview */}
                      <div className="space-y-1">
                        {/* Show actual lesson notes */}
                        {notes
                          .filter(note => note.lessonId === currentLesson)
                          .slice(-2) // Show last 2 notes
                          .map((note) => (
                            <div key={note.id} className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg text-xs">
                              <div className="flex items-center space-x-1 text-orange-600 font-medium min-w-0">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{Math.floor(note.timestamp / 60)}:{(note.timestamp % 60).toString().padStart(2, '0')}</span>
                              </div>
                              <p className="text-gray-700 flex-1 line-clamp-1">{note.content}</p>
                            </div>
                          ))}
                        
                        {/* Show message if no notes */}
                        {notes.filter(note => note.lessonId === currentLesson).length === 0 && (
                          <div className="text-center py-2 text-gray-400 text-xs">
                            No notes yet for this lesson
                          </div>
                        )}
                      </div>
                      
                      {/* View All Notes Link */}
                      <button 
                        className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
                        onClick={() => setShowNotesModal(true)}
                      >
                        <span>View all notes for this lesson</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                {/* Resources Section */}
                {currentLessonData.resources && currentLessonData.resources.length > 0 && (
                  <div className="mb-3 sm:mb-4 lg:mb-6 p-3 sm:p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">Lesson Resources</h3>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                        {currentLessonData.resources.length} files
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {currentLessonData.resources.map((resource) => {
                        const getResourceIcon = (type: string) => {
                          switch (type) {
                            case 'pdf':
                              return <FileText className="w-4 h-4 text-red-500" />;
                            case 'link':
                              return <ExternalLink className="w-4 h-4 text-blue-500" />;
                            case 'code':
                              return <File className="w-4 h-4 text-green-500" />;
                            default:
                              return <BookIcon className="w-4 h-4 text-gray-500" />;
                          }
                        };

                        const getResourceColor = (type: string) => {
                          switch (type) {
                            case 'pdf':
                              return 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700';
                            case 'link':
                              return 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700';
                            case 'code':
                              return 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700';
                            default:
                              return 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700';
                          }
                        };

                        return (
                          <button
                            key={resource.id}
                            onClick={() => {
                              if (resource.type === 'link') {
                                window.open(resource.url, '_blank');
                              } else {
                                // For downloadable files, create a download link
                                const link = document.createElement('a');
                                link.href = resource.url;
                                link.download = resource.title;
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left ${getResourceColor(resource.type)}`}
                          >
                            <div className="flex-shrink-0">
                              {getResourceIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm line-clamp-1">
                                {resource.title}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs opacity-75 capitalize">
                                  {resource.type === 'link' ? 'External Link' : `${resource.type.toUpperCase()} File`}
                                </span>
                                {resource.type !== 'link' && (
                                  <div className="flex items-center space-x-1">
                                    <Download className="w-3 h-3" />
                                    <span className="text-xs">Download</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {resource.type === 'link' ? (
                                <ExternalLink className="w-4 h-4 opacity-50" />
                              ) : (
                                <Download className="w-4 h-4 opacity-50" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Quick Download All Button */}
                    {currentLessonData.resources.filter(r => r.type !== 'link').length > 1 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium">
                          <Download className="w-4 h-4" />
                          <span>Download All Resources</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                  {/* Lesson Info */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {currentLessonData.title}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-2 lg:line-clamp-none">
                        {currentLessonData.description}
                      </p>
                    </div>
                  
                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100">
                      <button
                        onClick={goToPreviousLesson}
                        disabled={currentLessonIndex === 0}
                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium">Prev</span>
                      </button>
                    
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        {currentLessonIndex + 1} of {allLessons.length}
                      </div>
                    
                      <button
                        onClick={goToNextLesson}
                        disabled={currentLessonIndex === allLessons.length - 1}
                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Course Navigation */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 xl:col-span-2 order-2">
              <BentoCourseNavigation
                course={currentCourse}
                currentLesson={currentLesson}
                progress={progress}
                onLessonSelect={setCurrentLesson}
              />
            </div>

            {/* Achievement Card */}
            <div className="col-span-1 sm:col-span-1 lg:col-span-1 xl:col-span-1 order-6">
              <AchievementCard
                completedLessons={progress?.completedLessons.length || 0}
                totalLessons={allLessons.length}
                streak={3} // Mock streak data - in real app this would come from user progress
                totalWatchTime={145} // Mock watch time in minutes
              />
            </div>

          </div>
        </div>
      </div>

      {/* Footer - Only visible on desktop */}
      <footer className="hidden lg:block bg-white/80 backdrop-blur-xl border-t border-gray-200/50 mt-12">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">L</span>
                </div>
                <span className="font-semibold text-gray-900">LearnHub</span>
              </div>
              <div className="text-sm text-gray-500">
                © 2024 LearnHub. All rights reserved.
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button className="hover:text-gray-900 transition-colors">Help</button>
              <button className="hover:text-gray-900 transition-colors">Privacy</button>
              <button className="hover:text-gray-900 transition-colors">Terms</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {getCurrentUnit()?.title || 'Unit'} Notes
                  </h2>
                  <p className="text-gray-600">{currentLessonData?.title}</p>
                </div>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="p-2 rounded-xl bg-white/80 hover:bg-white transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto min-h-0">
              
              {/* Add New Note Section */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Add note at {Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <textarea
                    placeholder="Write your note here..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        handleAddNote(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button 
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium"
                    onClick={(e) => {
                      const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                      if (textarea && textarea.value.trim()) {
                        handleAddNote(textarea.value);
                        textarea.value = '';
                      }
                    }}
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* All Notes List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">All Notes for "{currentLessonData?.title}"</h3>
                  <span className="text-sm text-gray-500">
                    {notes.filter(note => note.lessonId === currentLesson).length} notes
                  </span>
                </div>
                
                {/* Show actual notes or empty state */}
                <div className="space-y-4">
                  {notes
                    .filter(note => note.lessonId === currentLesson)
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((note, index) => (
                      <div key={note.id} className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-orange-600">
                                {Math.floor(note.timestamp / 60)}:{(note.timestamp % 60).toString().padStart(2, '0')}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(note.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{note.content}</p>
                      </div>
                    ))}
                  
                  {/* Empty state */}
                  {notes.filter(note => note.lessonId === currentLesson).length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">No notes yet</p>
                      <p className="text-sm">Add your first note using the input above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {notes.filter(note => note.lessonId === currentLesson).length} notes
                  {notes.filter(note => note.lessonId === currentLesson).length > 0 && (
                    <span> • Last updated {new Date(Math.max(...notes.filter(note => note.lessonId === currentLesson).map(note => new Date(note.createdAt).getTime()))).toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <button
                      onClick={exportNotesToWord}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Export Notes
                    </button>
                  </button>
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};