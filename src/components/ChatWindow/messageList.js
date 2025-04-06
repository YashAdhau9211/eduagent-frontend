import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { fetchChatDetail } from '../../services/api';
import ChatMessage from './ChatMessage'; 
import AnswerTabs from './AnswerTabs';   
import LoadingSpinner from '../common/loadingSpinner'; 
import ErrorDisplay from '../common/ErrorDisplay';   
import useScrollToBottom from '../../hooks/useScrollToBottom';

const MessageList = () => {
    const { state, dispatch } = useAppContext();
    const {
        currentChatId,
        currentChatHistory = [],
        isLoadingHistory,
        isSendingQuery,
    } = state;

    const messagesEndRef = useScrollToBottom(currentChatHistory);

    
    useEffect(() => {
        if (currentChatId) {
            const loadHistory = async () => {
                dispatch({ type: 'FETCH_HISTORY_START' });
                try {
                    const chatDetail = await fetchChatDetail(currentChatId);
                    
                    const processedMessages = (Array.isArray(chatDetail?.messages) ? chatDetail.messages : [])
                        .map(m => ({ ...m, responseData: m.responseData || null })) 
                        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                    dispatch({ type: 'FETCH_HISTORY_SUCCESS', payload: processedMessages });
                } catch (fetchError) {
                    console.error("Failed to fetch chat history:", fetchError);
                    dispatch({ type: 'FETCH_HISTORY_FAIL', payload: fetchError.message || 'Failed to load chat history' });
                }
            };
            loadHistory();
        } else {
             if (isLoadingHistory) {
                 dispatch({ type: 'FETCH_HISTORY_SUCCESS', payload: [] });
             }
        }
        
    }, [currentChatId, dispatch]);


    const historyToRender = Array.isArray(currentChatHistory) ? currentChatHistory : [];

    if (!currentChatId && !isLoadingHistory) {
        return <div className="message-list-placeholder">Select a chat to start messaging.</div>;
    }

    return (
        <div className="message-list" ref={messagesEndRef}>
             <ErrorDisplay context="history" />
             {isLoadingHistory && (
                 <div style={{textAlign: 'center', padding: '20px'}}>
                     <LoadingSpinner /> Loading history...
                 </div>
             )}

             {!isLoadingHistory && historyToRender.map((msg, index) => {
                 
                 if (!msg) {
                     console.warn(`Message at index ${index} is null or undefined.`);
                     return null;
                 }

                 const isAssistant = msg.role === 'assistant';

                 
                 const showTabs = isAssistant && msg.responseData && !msg.isError;


                 return (
                    <React.Fragment key={msg.id || `msg-${index}`}>
                         <ChatMessage message={msg} />
                         {/* Render tabs ONLY if showTabs is true for THIS message */}
                         {showTabs && <AnswerTabs responseData={msg.responseData} />}
                    </React.Fragment>
                 );
             })}

             {/* Typing Indicator */}
            {isSendingQuery && !isLoadingHistory && (
                <div className="message assistant-message typing-indicator">
                    <div className="message-content">
                        <LoadingSpinner size="16px"/> Assistant is thinking...
                    </div>
                </div>
            )}

            
            {!isLoadingHistory && historyToRender.length === 0 && currentChatId && (
                 <div className="message-list-placeholder" style={{padding: '20px'}}>
                     No messages in this chat yet. Ask a question below!
                 </div>
            )}
        </div>
    );
};

export default MessageList;