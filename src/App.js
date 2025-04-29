import React, { useEffect } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import { AppProvider, useAppContext } from './context/AppContext';
import { loadUser } from './services/api';


import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import LoginPage from './components/Auth/LoginPage'; 
import SignupPage from './components/Auth/SignupPage'; 
import ProtectedRoute from './components/Auth/ProtectedRoute'; 

// 4. Import CSS
import './App.css';


const MainAppLayout = () => {
    const { state } = useAppContext();
    const { theme } = state;

    // Apply theme class to body when this layout is active
    useEffect(() => {
        const body = document.body;
        body.classList.remove('theme-light', 'theme-dark');
        body.classList.add(`theme-${theme}`);
    }, [theme]);

    return (
        <div className="app-container">
            <Sidebar />
            <ChatWindow />
        </div>
    );
};


const AuthHandler = ({ children }) => {
    const { state, dispatch } = useAppContext();
    // Get token from initial state (which reads from localStorage)
    const { authToken, user, isLoadingAuth } = state;

     useEffect(() => {
        
        if (authToken && !user && !isLoadingAuth) {
             console.log("[AuthHandler] Token found, attempting to load user...");
             dispatch({ type: 'AUTH_START' }); // Set loading state
             loadUser()
                 .then(data => {
                     // Assuming loadUser returns { user: {...} } on success
                     console.log("[AuthHandler] User loaded successfully:", data.user);
                     dispatch({ type: 'LOAD_USER_SUCCESS', payload: data });
                 })
                 .catch(error => {
                     // This usually means the token was invalid or expired (e.g., 401)
                     console.error("[AuthHandler] Failed to load user with token:", error);
                     // Dispatch AUTH_FAIL to clear token and set isAuthenticated to false
                     dispatch({ type: 'AUTH_FAIL', payload: 'Session invalid or expired. Please log in again.' });
                 });
         } else if (!authToken && !isLoadingAuth) {
             
             console.log("[AuthHandler] No token found. User needs to log in.");
         }
        
         
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken, dispatch]); 

     
     return children;
 };



function App() {
    return (
        // Provide App Context to the entire application
        <AppProvider>
            {/* Set up the Router */}
            <BrowserRouter>
                {/* AuthHandler wraps Routes to check token on load */}
                <AuthHandler>
                    {/* Define application routes */}
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        {/* Protected Route for the main application */}
                        <Route
                            path="/*" // Matches root '/' and any other unspecified path
                            element={
                                <ProtectedRoute>
                                    {/* Render the main layout if authenticated */}
                                    <MainAppLayout />
                                </ProtectedRoute>
                            }
                        />

                         {/* Optional: Redirect base path if needed, though "/*" handles it */}
                         { <Route path="/" element={<Navigate to="/app" replace />} />}
                         {/* Or make "/" the protected route directly */}

                    </Routes>
                </AuthHandler>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;