import React, { useEffect } from 'react'; // Import useEffect
import { AppProvider, useAppContext } from './context/AppContext'; // Import useAppContext
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import './App.css';


function AppContent() {
    const { state } = useAppContext();
    const { theme } = state;

    
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
}



function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;