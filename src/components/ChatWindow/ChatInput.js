import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { postQuery } from '../../services/api';
import LoadingSpinner from '../common/loadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

const ChatInput = () => {
    const { state, dispatch } = useAppContext();
    const { currentChatId, selectedSubject, isSendingQuery } = state;
    const [inputText, setInputText] = useState('');

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSend = async () => {
        const question = inputText.trim();
        if (!question || !currentChatId || !selectedSubject || isSendingQuery) {
            return;
        }

        // 1. Dispatch optimistic user message
        dispatch({ type: 'ADD_USER_MESSAGE', payload: { role: 'user', content: question } });

        // 2. Start query process
        dispatch({ type: 'QUERY_START' });
        setInputText(''); 

        try {
            // 3. Call API
            const response = await postQuery({
                question: question,
                subject: selectedSubject,
                chat_id: currentChatId
            });

            // 4. Dispatch success with response data (reducer adds assistant message)
            dispatch({ type: 'QUERY_SUCCESS', payload: { response } });

        } catch (error) {
            // 5. Dispatch failure
             // The reducer might add an error message to the chat, or just set global error
            dispatch({ type: 'QUERY_FAIL', payload: error.message || 'Failed to get answer' });
        }
    };

    const handleKeyDown = (event) => {
        // Send on Enter, allow Shift+Enter for newline
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default newline behavior
            handleSend();
        }
    };

    return (
        <div className="chat-input-area">
             <ErrorDisplay context="query" />
            <textarea
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={currentChatId ? `Ask a question about ${selectedSubject}... (Shift+Enter for newline)` : 'Select a chat first'}
                rows="3"
                disabled={!currentChatId || isSendingQuery}
            />
            <button onClick={handleSend} disabled={!currentChatId || !inputText.trim() || isSendingQuery}>
                {isSendingQuery ? <LoadingSpinner size="16px" /> : 'Send'}
            </button>
        </div>
    );
};

export default ChatInput;