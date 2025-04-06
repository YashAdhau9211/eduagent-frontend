import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ChatHeader = () => {
    const { state } = useAppContext();
    const { chats, currentChatId } = state;

    const currentChat = chats.find(chat => chat.id === currentChatId);

    if (!currentChat) {
        return <header className="chat-header">No Chat Selected</header>;
    }

    return (
        <header className="chat-header">
            <h3>{currentChat.name || `Chat (${currentChat.id.substring(0,4)})`}</h3>
            <span className="chat-subject-badge">{currentChat.subject}</span>
            
        </header>
    );
};

export default ChatHeader;