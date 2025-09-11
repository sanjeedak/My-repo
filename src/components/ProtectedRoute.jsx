import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after a
    // successful sign-in.
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;