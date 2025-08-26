// Mock Server Implementation (In production, this would be a real backend)
import { Course, User, Progress, Note } from '../types';

class MockServer {
  private courses: Course[] = [];
  private users: User[] = [];
  private progress: Progress[] = [];
  private notes: Note[] = [];

  constructor() {
    this.initializeMockData();
    this.setupRoutes();
  }

  private initializeMockData() {
    // Initialize with existing mock data from CourseContext
    this.courses = [
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
              }
            ]
          }
        ],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      }
    ];

    this.users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'student@example.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'student',
        enrolledCourses: ['1']
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'instructor@example.com',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'instructor'
      }
    ];
  }

  private setupRoutes() {
    // This would be implemented with Express.js or similar in a real backend
    console.log('Mock server routes initialized');
  }

  // Course CRUD operations
  getCourses() {
    return { success: true, data: this.courses };
  }

  getCourse(id: string) {
    const course = this.courses.find(c => c.id === id);
    return course ? { success: true, data: course } : { success: false, error: 'Course not found' };
  }

  createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) {
    const newCourse: Course = {
      ...courseData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.courses.push(newCourse);
    return { success: true, data: newCourse };
  }

  updateCourse(id: string, courseData: Partial<Course>) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      return { success: false, error: 'Course not found' };
    }
    
    this.courses[index] = {
      ...this.courses[index],
      ...courseData,
      updatedAt: new Date().toISOString()
    };
    
    return { success: true, data: this.courses[index] };
  }

  deleteCourse(id: string) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      return { success: false, error: 'Course not found' };
    }
    
    this.courses.splice(index, 1);
    return { success: true, message: 'Course deleted successfully' };
  }

  // User CRUD operations
  getUsers() {
    return { success: true, data: this.users };
  }

  createUser(userData: Omit<User, 'id'>) {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.users.push(newUser);
    return { success: true, data: newUser };
  }

  updateUser(id: string, userData: Partial<User>) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: 'User not found' };
    }
    
    this.users[index] = { ...this.users[index], ...userData };
    return { success: true, data: this.users[index] };
  }

  deleteUser(id: string) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: 'User not found' };
    }
    
    this.users.splice(index, 1);
    return { success: true, message: 'User deleted successfully' };
  }

  // Analytics
  getAnalytics() {
    const totalCourses = this.courses.length;
    const totalUsers = this.users.length;
    const totalStudents = this.users.filter(u => u.role === 'student').length;
    const totalInstructors = this.users.filter(u => u.role === 'instructor').length;
    const totalEnrollments = this.users.reduce((acc, user) => acc + (user.enrolledCourses?.length || 0), 0);

    return {
      success: true,
      data: {
        totalCourses,
        totalUsers,
        totalStudents,
        totalInstructors,
        totalEnrollments,
        averageRating: this.courses.reduce((acc, course) => acc + course.rating, 0) / totalCourses || 0,
        totalRevenue: this.courses.reduce((acc, course) => acc + (course.price * course.studentsCount), 0)
      }
    };
  }
}

export const mockServer = new MockServer();