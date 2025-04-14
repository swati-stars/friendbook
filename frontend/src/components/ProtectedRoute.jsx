// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Protects routes that require any logged-in user
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  if (!userInfo || !userInfo.token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Render the child component (e.g., UserProfilePage)
};

// Protects routes that require an admin user
const AdminRoute = ({ children }) => {
   const location = useLocation();
   const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

   if (!userInfo || !userInfo.token) {
       return <Navigate to="/login" state={{ from: location }} replace />;
   }

   if (userInfo.role !== 'admin') {
        // Redirect non-admins, maybe to home or profile page
        // You could show a "Not Authorized" message page instead
        return <Navigate to="/" replace />; // Or navigate('/profile')
   }


  return children; // Render the child component (e.g., AdminDashboardPage)
};


export { ProtectedRoute, AdminRoute };