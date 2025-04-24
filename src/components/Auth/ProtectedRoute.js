import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { state } = useAppContext();
    const { isAuthenticated, isLoadingAuth } = state; // Also check loading state
    const location = useLocation();

    // Optional: Show a loading indicator while initial auth check happens
    // This prevents flicker if loadUser takes time
    // You might need a separate isLoadingInitialAuth state flag for this
    if (isLoadingAuth && !isAuthenticated) {
        return <div>Loading session...</div>; // Or a spinner
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // Render the protected component
};

export default ProtectedRoute;