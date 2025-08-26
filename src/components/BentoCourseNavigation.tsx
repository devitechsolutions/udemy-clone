import React from 'react';
import { ChevronRight, Play, CheckCircle, Circle, Clock, BookOpen } from 'lucide-react';
import { Course, Unit, Lesson, Progress } from '../types';
import { BentoCard } from './BentoCard';

interface BentoCourseNavigationProps {
  course: Course;
  currentLesson: string | null;
  progress?: Progress;
  onLessonSelect: (lessonId: string) => void;
}

export const BentoCourseNavigation: React.FC<BentoCourseNavigationProps> = ({
  course,
  currentLesson,
  progress,
  onLessonSelect
}) => {
  const [expandedUnits, setExpandedUnits] = React.useState<Set<string>>(
    new Set(course.units.map(unit => unit.id))
  );

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false;
  };

  const getUnitProgress = (unit: Unit) => {
    if (!progress) return 0;
    const completedLessons = unit.lessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length;
    return Math.round((completedLessons / unit.lessons.length) * 100);
  };

  return (
    <BentoCard className="p-0 overflow-hidden h-full">
      <div className="h-full flex flex-col">
        
        {/* Header */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">Course Content</h3>
              <div className="flex items-center space-x-3 text-xs sm:text-xs lg:text-sm text-gray-500">
                <span>{course.units.length} units</span>
                <span>•</span>
                <span>{course.units.reduce((acc, unit) => acc + unit.lessons.length, 0)} lessons</span>
                <span>•</span>
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
              <span className="text-xs sm:text-sm font-semibold text-orange-600">
                {progress?.progressPercentage || 0}%
              </span>
            </div>
            <div className="w-full h-1 sm:h-1.5 lg:h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${progress?.progressPercentage || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Units List */}
        <div className="flex-1 overflow-y-auto">
          {course.units.map((unit) => {
            const isExpanded = expandedUnits.has(unit.id);
            const unitProgress = getUnitProgress(unit);
            
            return (
              <div key={unit.id} className="border-b border-gray-50 last:border-b-0">
                
                {/* Unit Header */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full p-2 sm:p-3 lg:p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                      <h4 className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {unit.title}
                      </h4>
                      {unitProgress === 100 && (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      )}
                    </div>
                    
                    <p className="text-xs sm:text-xs lg:text-sm text-gray-500 mb-1 sm:mb-2 line-clamp-1">
                      {unit.description}
                    </p>
                    
                    {/* Unit Progress */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="flex-1 h-0.5 sm:h-0.5 lg:h-1 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${unitProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{unitProgress}%</span>
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ml-2 ${
                    isExpanded ? 'rotate-90' : ''
                  }`} />
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="bg-gray-25">
                    {unit.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = isLessonCompleted(lesson.id);
                      const isCurrent = currentLesson === lesson.id;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onLessonSelect(lesson.id)}
                          className={`w-full p-2 sm:p-3 lg:p-4 text-left hover:bg-gray-100 transition-colors border-l-2 ${
                            isCurrent 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            
                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                              ) : isCurrent ? (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                  <Play className="w-2 h-2 sm:w-3 sm:h-3 text-white ml-0.5" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-500">
                                    {lessonIndex + 1}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Lesson Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                                <h5 className={`text-xs sm:text-sm lg:text-base font-medium line-clamp-1 pr-2 ${
                                  isCurrent ? 'text-orange-600' : 'text-gray-900'
                                }`}>
                                  {lesson.title}
                                </h5>
                                <div className="flex items-center space-x-1 text-gray-400 flex-shrink-0">
                                  <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
                                  <span className="text-xs whitespace-nowrap">{lesson.duration}</span>
                                </div>
                              </div>
                              
                              {lesson.description && (
                                <p className="text-xs sm:text-xs lg:text-sm text-gray-500 line-clamp-1">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </BentoCard>
  );
};