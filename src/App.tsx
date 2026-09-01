import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EODForm from './pages/EODForm';
import TeamGoals from './pages/TeamGoals';
import Documentation from './pages/Documentation';
import Users from './pages/admin/Users';
import AllSubmissions from './pages/admin/AllSubmissions';
import EODCompliance from './pages/admin/EODCompliance';
import Settings from './pages/admin/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ---- public ---- */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/eod-form" element={
        <ProtectedRoute>
          <EODForm />
        </ProtectedRoute>
      } />
      <Route path="/documentation" element={
        <ProtectedRoute>
          <Documentation />
        </ProtectedRoute>
      } />
      <Route path="/team-goals" element={
        <ProtectedRoute>
          <TeamGoals />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/admin/all-submissions" element={
        <ProtectedRoute>
          <AllSubmissions />
        </ProtectedRoute>
      } />
      <Route path="/admin/eod-compliance" element={
        <ProtectedRoute>
          <EODCompliance />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;