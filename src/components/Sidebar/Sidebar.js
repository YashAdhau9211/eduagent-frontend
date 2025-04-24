// src/components/Sidebar/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { logoutUser } from '../../services/api';

// --- ADD THESE IMPORTS ---
import SubjectSelector from './SubjectSelector';
import KnowledgeBaseUploader from './KnowledgeBaseUploader';
import ChatList from './ChatList';
import ThemeToggler from './ThemeToggler';
import ErrorDisplay from '../common/ErrorDisplay'; // Assuming ErrorDisplay is in common
// --- END ADDED IMPORTS ---


const Sidebar = () => {
    const { state, dispatch } = useAppContext();
    const { user, isAuthenticated } = state; // Also get isAuthenticated
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("Logging out...");
        await logoutUser();
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    };

    return (
        <aside className="sidebar">
             <h2>EduAgent.ai</h2>
             {user && <p className="user-greeting">Welcome, {user.username}!</p>}

             {/* Now ErrorDisplay is defined */}
             <ErrorDisplay />
            {/* Now SubjectSelector is defined */}
            <SubjectSelector />
            <hr />
            {/* Now KnowledgeBaseUploader is defined */}
            <KnowledgeBaseUploader />
            <hr />
            {/* Now ChatList is defined */}
            <ChatList />

            {/* Use isAuthenticated from state */}
            {isAuthenticated && (
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            )}
            {/* Now ThemeToggler is defined */}
            <ThemeToggler />
        </aside>
    );
};

export default Sidebar;