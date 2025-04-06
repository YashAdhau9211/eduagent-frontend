import React from 'react';
import SubjectSelector from './SubjectSelector';
import KnowledgeBaseUploader from './KnowledgeBaseUploader';
import ChatList from './ChatList';
import ErrorDisplay from '../common/ErrorDisplay'; // Global error display
import ThemeToggler from './ThemeToggler';

const Sidebar = () => {
    return (
        <aside className="sidebar">
             <h2>EduAgent.ai</h2>
             {/* Display general errors here if not context-specific */}
             <ErrorDisplay />
            <SubjectSelector />
            <hr />
            <KnowledgeBaseUploader />
            <hr />
            <ChatList />
            <ThemeToggler />
        </aside>
    );
};

export default Sidebar;