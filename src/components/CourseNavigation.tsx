import React from 'react';
import { ChevronDown, ChevronRight, Play, CheckCircle, Circle, Book, Clock } from 'lucide-react';
import { Course, Unit, Lesson, Progress } from '../types';

interface CourseNavigationProps {
  course: Course;
  currentLesson: string | null;
  progress?: Progress;
  onLessonSelect: (lessonId: string) => void;
}

export const CourseNavigation: React.FC<CourseNavigationProps> = ({
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

  const getTotalProgress = () => {
    if (!progress) return 0;
    return progress.progressPercentage;
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      
      {/* Course Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Book className="w-4 h-4" />
            <span>{course.units.length} units</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Course Progress</span>
            <span className="text-sm text-blue-400 font-medium">{getTotalProgress()}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${getTotalProgress()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Units and Lessons */}
      <div className="flex-1 overflow-y-auto">
        {course.units.map((unit) => {
          const isExpanded = expandedUnits.has(unit.id);
          const unitProgress = getUnitProgress(unit);
          
          return (
            <div key={unit.id} className="border-b border-gray-800">
              
              {/* Unit Header */}
              <button
                onClick={() => toggleUnit(unit.id)}
                className="w-full p-4 text-left hover:bg-gray-800 transition-colors flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {unit.title}
                    </span>
                    {unitProgress === 100 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                    {unit.description}
                  </p>
                  
                  {/* Unit Progress Bar */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-1 bg-gray-700 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${unitProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{unitProgress}%</span>
                  </div>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  )}
                </div>
              </button>

              {/* Lessons */}
              {isExpanded && (
                <div className="bg-gray-850">
                  {unit.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = isLessonCompleted(lesson.id);
                    const isCurrent = currentLesson === lesson.id;
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson.id)}
                        className={`w-full p-4 text-left hover:bg-gray-700 transition-colors border-l-2 ${
                          isCurrent 
                            ? 'border-blue-500 bg-gray-800' 
                            : 'border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          
                          {/* Lesson Status Icon */}
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : isCurrent ? (
                              <Play className="w-5 h-5 text-blue-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-500" />
                            )}
                          </div>

                          {/* Lesson Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-medium truncate ${
                                isCurrent ? 'text-blue-400' : 'text-white'
                              }`}>
                                {lessonIndex + 1}. {lesson.title}
                              </h4>
                              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                {lesson.duration}
                              </span>
                            </div>
                            
                            {lesson.description && (
                              <p className="text-sm text-gray-400 line-clamp-2">
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
  );
};