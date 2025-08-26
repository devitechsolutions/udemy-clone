export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor';
  enrolledCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  instructorAvatar: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  duration: string;
  lessonsCount: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  units: Unit[];
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  unitId: string;
  isCompleted?: boolean;
  transcript?: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'code';
  url: string;
}

export interface Progress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  currentLesson: string;
  progressPercentage: number;
  lastWatched: string;
  certificateEarned?: boolean;
}

export interface Note {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  timestamp: number;
  createdAt: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}