import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import UploadResume from '../pages/UploadResume';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ATSResumeChecker from '../pages/Ats';

// ProtectedRoute: For routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

// PublicRoute: For login/signup, redirects authenticated users
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect root (/) based on authentication status
  const rootRedirect = currentUser ? <Home /> : <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route path="/" element={rootRedirect} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route path="/ats" element={<ATSResumeChecker />} />
      <Route
        path="/upload-resume"
        element={
          <ProtectedRoute>
            <UploadResume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;