import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { fetchChats, createChat, deleteChat } from '../../services/api';
import LoadingSpinner from '../common/loadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

const ChatList = () => {
    const { state, dispatch } = useAppContext();
    const { chats, currentChatId, selectedSubject, isLoadingChats, isCreatingChat } = state;

    useEffect(() => {
        const loadChats = async () => {
            dispatch({ type: 'FETCH_CHATS_START' });
            try {
                const fetchedChats = await fetchChats();
                dispatch({ type: 'FETCH_CHATS_SUCCESS', payload: fetchedChats });
            } catch (error) {
                dispatch({ type: 'FETCH_CHATS_FAIL', payload: error.message || 'Failed to load chats' });
            }
        };
        loadChats();
    }, [dispatch]);

    const handleSelectChat = (chatId) => {
        if (chatId !== currentChatId) {
            dispatch({ type: 'SELECT_CHAT', payload: chatId });
        }
    };

    const handleNewChat = async () => {
        if (!selectedSubject) {
             alert("Please select a subject before creating a new chat.");
             return;
        }
        dispatch({ type: 'CREATE_CHAT_START' });
         try {
             const newChat = await createChat({ subject: selectedSubject /*, name: Optional */ });
             dispatch({ type: 'CREATE_CHAT_SUCCESS', payload: newChat });
             
             dispatch({ type: 'SELECT_CHAT', payload: newChat.id });
         } catch (error) {
             dispatch({ type: 'CREATE_CHAT_FAIL', payload: error.message || 'Failed to create chat' });
         }
    };

    const handleDeleteChat = async (chatId, event) => {
        event.stopPropagation(); 
        if (!window.confirm("Are you sure you want to delete this chat?")) return;

        dispatch({ type: 'DELETE_CHAT_START', payload: { chatId } }); 
        try {
            await deleteChat(chatId);
            dispatch({ type: 'DELETE_CHAT_SUCCESS', payload: { chatId } }); 
        } catch (error) {
            dispatch({ type: 'DELETE_CHAT_FAIL', payload: error.message || 'Failed to delete chat' });
        }
    };

    
    const filteredChats = chats.filter(chat => chat.subject === selectedSubject);


    return (
        <div className="chat-list">
            <h4>Chat Sessions</h4>
            <ErrorDisplay context="chats" />
            <ErrorDisplay context="create_chat" />
            <ErrorDisplay context="delete_chat" />

            <button onClick={handleNewChat} disabled={!selectedSubject || isCreatingChat}>
                 {isCreatingChat ? <><LoadingSpinner size="16px"/> Creating...</> : '+ New Chat'}
            </button>

            {isLoadingChats && !isCreatingChat ? ( // Don't show main spinner if just creating
                <LoadingSpinner />
            ) : (
                <ul>
                    {/* Only show chats for the selected subject */}
                    {filteredChats.length === 0 && selectedSubject && <li>No chats for {selectedSubject} yet.</li>}
                    {!selectedSubject && <li>Select a subject to see chats.</li>}

                    {filteredChats.map(chat => (
                        <li
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            className={chat.id === currentChatId ? 'active' : ''}
                        >
                            {chat.name || `Chat (${chat.id.substring(0, 4)})`}
                            <button
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                className="delete-chat-btn"
                                title="Delete Chat"
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChatList;