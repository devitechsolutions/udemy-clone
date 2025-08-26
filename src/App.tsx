import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { BentoCoursePage } from './pages/BentoCoursePage';
import { AdminPage } from './pages/AdminPage';
import { AdminRoute } from './components/AdminRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <CourseProvider>
          <Router>
            <Routes>
              <Route path="/" element={<BentoCoursePage />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CourseProvider>
      </AuthProvider>
    </div>
  );
}

export default App;