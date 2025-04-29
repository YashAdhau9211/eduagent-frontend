import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { state } = useAppContext();
    const { isAuthenticated, isLoadingAuth } = state; // Also check loading state
    const location = useLocation();

    
    if (isLoadingAuth && !isAuthenticated) {
        return <div>Loading session...</div>; // Or a spinner
    }

    if (!isAuthenticated) {
        
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // Render the protected component
};

export default ProtectedRoute;