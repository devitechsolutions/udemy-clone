// API Service Layer for Backend Communication
export class ApiService {
  private baseUrl = '/api';

  // Course Management
  async getCourses() {
    const response = await fetch(`${this.baseUrl}/courses`);
    return response.json();
  }

  async getCourse(id: string) {
    const response = await fetch(`${this.baseUrl}/courses/${id}`);
    return response.json();
  }

  async createCourse(courseData: any) {
    const response = await fetch(`${this.baseUrl}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    return response.json();
  }

  async updateCourse(id: string, courseData: any) {
    const response = await fetch(`${this.baseUrl}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    return response.json();
  }

  async deleteCourse(id: string) {
    const response = await fetch(`${this.baseUrl}/courses/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // User Management
  async getUsers() {
    const response = await fetch(`${this.baseUrl}/users`);
    return response.json();
  }

  async createUser(userData: any) {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async updateUser(id: string, userData: any) {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async deleteUser(id: string) {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Progress Management
  async getUserProgress(userId: string) {
    const response = await fetch(`${this.baseUrl}/progress/${userId}`);
    return response.json();
  }

  async updateProgress(userId: string, courseId: string, progressData: any) {
    const response = await fetch(`${this.baseUrl}/progress/${userId}/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData)
    });
    return response.json();
  }

  // Analytics
  async getAnalytics() {
    const response = await fetch(`${this.baseUrl}/analytics`);
    return response.json();
  }

  // Notes Management
  async getNotes(lessonId: string) {
    const response = await fetch(`${this.baseUrl}/notes/${lessonId}`);
    return response.json();
  }

  async createNote(noteData: any) {
    const response = await fetch(`${this.baseUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    return response.json();
  }

  async deleteNote(noteId: string) {
    const response = await fetch(`${this.baseUrl}/notes/${noteId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
}

export const apiService = new ApiService();