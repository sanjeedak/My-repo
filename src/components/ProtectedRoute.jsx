import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Use the loading state

  // While checking for authentication, show a loading indicator
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // After loading, if there's no user, redirect to sign-in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If the user is logged in, show the protected content
  return children;
};

export default ProtectedRoute;