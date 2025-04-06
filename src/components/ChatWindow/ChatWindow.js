import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './messageList';
import ChatInput from './ChatInput';
import { useAppContext } from '../../context/AppContext';


const ChatWindow = () => {
     const { state } = useAppContext();
     const { currentChatId } = state;

    return (
        <main className="chat-window">
            <ChatHeader />
            {currentChatId ? (
                 <>
                    <MessageList />
                    <ChatInput />
                 </>
             ) : (
                 <div className="chat-placeholder">
                     <h2>Welcome to EduAgent.ai</h2>
                     <p>Please select a subject and then select or create a chat session from the sidebar to begin.</p>
                 </div>
             )}
        </main>
    );
};

export default ChatWindow;