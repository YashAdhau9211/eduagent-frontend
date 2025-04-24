import React, { useEffect } from 'react';
// 1. Import React Router components
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 2. Import Context and API
import { AppProvider, useAppContext } from './context/AppContext';
import { loadUser } from './services/api';

// 3. Import Page/Layout Components
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import LoginPage from './components/Auth/LoginPage'; // Assuming path is correct
import SignupPage from './components/Auth/SignupPage'; // Assuming path is correct
import ProtectedRoute from './components/Auth/ProtectedRoute'; // Assuming path is correct

// 4. Import CSS
import './App.css';

// --- Helper Components ---

// Component for the main application layout (Sidebar + ChatWindow)
// This will be rendered inside the ProtectedRoute
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

// Component to handle the initial check for an existing token
// and attempt to load user data on app start.
const AuthHandler = ({ children }) => {
    const { state, dispatch } = useAppContext();
    // Get token from initial state (which reads from localStorage)
    const { authToken, user, isLoadingAuth } = state;

     useEffect(() => {
        // Only run check if:
        // 1. A token exists from localStorage.
        // 2. We don't already have user data loaded.
        // 3. We aren't already in the middle of an auth operation.
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
             // Optional: If no token, ensure auth state is definitively logged out
             // This handles cases where localStorage might be cleared manually
             // dispatch({ type: 'LOGOUT' }); // Could cause loops if not careful, rely on initial state mostly
             console.log("[AuthHandler] No token found. User needs to log in.");
         }
         // Run this effect only once when the component mounts,
         // or if the initial authToken state changes (which it shouldn't after first load).
         // Dispatch is stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [authToken, dispatch]); // Only depend on initial token presence & dispatch

     // Render the routes while the check might be in progress
     // ProtectedRoute will handle redirection based on isAuthenticated state
     return children;
 };


// --- Main App Component ---
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