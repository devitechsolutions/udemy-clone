import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Course, Progress, Note } from '../types';

interface CourseContextType {
  courses: Course[];
  progress: Progress[];
  notes: Note[];
  currentCourse: Course | null;
  currentLesson: string | null;
  setCurrentCourse: (course: Course) => void;
  setCurrentLesson: (lessonId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string, userId: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  getCourseProgress: (courseId: string, userId: string) => Progress | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

// Mock course data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Development Masterclass',
    description: 'Master React from fundamentals to advanced concepts with hands-on projects and real-world applications.',
    instructor: 'Sarah Wilson',
    instructorId: '2',
    instructorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 89.99,
    originalPrice: 149.99,
    rating: 4.9,
    studentsCount: 15420,
    duration: '42h 15m',
    lessonsCount: 156,
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['React', 'JavaScript', 'Frontend'],
    units: [
      {
        id: 'unit-1',
        title: 'React Fundamentals',
        description: 'Learn the core concepts of React development',
        order: 1,
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'Introduction to React',
            description: 'What is React and why use it for modern web development?',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '12:45',
            order: 1,
            unitId: 'unit-1'
          },
          {
            id: 'lesson-1-2',
            title: 'Setting up Development Environment',
            description: 'Install Node.js, npm, and create your first React application',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: '18:30',
            order: 2,
            unitId: 'unit-1'
          },
          {
            id: 'lesson-1-3',
            title: 'Understanding JSX',
            description: 'Learn JSX syntax and how it transforms into JavaScript',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '15:20',
            order: 3,
            unitId: 'unit-1'
          }
        ]
      },
      {
        id: 'unit-2',
        title: 'Components and Props',
        description: 'Building reusable components with props',
        order: 2,
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'Creating Your First Component',
            description: 'Build functional and class components from scratch',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '22:15',
            order: 1,
            unitId: 'unit-2'
          },
          {
            id: 'lesson-2-2',
            title: 'Props and Data Flow',
            description: 'Pass data between components using props effectively',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '19:45',
            order: 2,
            unitId: 'unit-2'
          }
        ]
      },
      {
        id: 'unit-3',
        title: 'State Management',
        description: 'Managing component state and lifecycle methods',
        order: 3,
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'useState Hook',
            description: 'Managing state in functional components with hooks',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '25:30',
            order: 1,
            unitId: 'unit-3'
          }
        ]
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
];

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses] = useState<Course[]>(mockCourses);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(mockCourses[0]);
  const [currentLesson, setCurrentLesson] = useState<string | null>('lesson-1-1');

  const markLessonComplete = (courseId: string, lessonId: string, userId: string) => {
    setProgress(prev => {
      const existingProgress = prev.find(p => p.courseId === courseId && p.userId === userId);
      
      if (existingProgress) {
        const updatedCompletedLessons = [...existingProgress.completedLessons];
        if (!updatedCompletedLessons.includes(lessonId)) {
          updatedCompletedLessons.push(lessonId);
        }
        
        const totalLessons = courses
          .find(c => c.id === courseId)
          ?.units.reduce((acc, unit) => acc + unit.lessons.length, 0) || 0;
        
        const progressPercentage = Math.round((updatedCompletedLessons.length / totalLessons) * 100);
        
        return prev.map(p => 
          p.courseId === courseId && p.userId === userId
            ? { 
                ...p, 
                completedLessons: updatedCompletedLessons,
                progressPercentage,
                lastWatched: new Date().toISOString()
              }
            : p
        );
      } else {
        const totalLessons = courses
          .find(c => c.id === courseId)
          ?.units.reduce((acc, unit) => acc + unit.lessons.length, 0) || 0;
        
        const newProgress: Progress = {
          courseId,
          userId,
          completedLessons: [lessonId],
          currentLesson: lessonId,
          progressPercentage: Math.round((1 / totalLessons) * 100),
          lastWatched: new Date().toISOString()
        };
        
        return [...prev, newProgress];
      }
    });
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const getCourseProgress = (courseId: string, userId: string): Progress | undefined => {
    return progress.find(p => p.courseId === courseId && p.userId === userId);
  };

  return (
    <CourseContext.Provider value={{
      courses,
      progress,
      notes,
      currentCourse,
      currentLesson,
      setCurrentCourse,
      setCurrentLesson,
      markLessonComplete,
      addNote,
      getCourseProgress
    }}>
      {children}
    </CourseContext.Provider>
  );
};