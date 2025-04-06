// src/context/reducer.js

export const reducer = (state, action) => {
    
    console.log("Dispatching:", action.type, action.payload);

    switch (action.type) {

        
        case 'TOGGLE_THEME': {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('eduagent-theme', newTheme); 
            return { ...state, theme: newTheme };
        }
        case 'SET_THEME': { 
             const themeToSet = action.payload === 'dark' ? 'dark' : 'light';
             localStorage.setItem('eduagent-theme', themeToSet); 
             return { ...state, theme: themeToSet };
        }
        


        
        case 'FETCH_SUBJECTS_START':
            return { ...state, isLoadingSubjects: true, error: null };
        case 'FETCH_SUBJECTS_SUCCESS':
            return { ...state, isLoadingSubjects: false, subjects: action.payload };
        case 'FETCH_SUBJECTS_FAIL':
            return { ...state, isLoadingSubjects: false, error: { message: action.payload, context: 'subjects' } };
        case 'SELECT_SUBJECT':
            return {
                ...state,
                selectedSubject: action.payload,
                currentChatId: null,
                currentChatHistory: [],
                latestQueryResponse: null,
                isLoadingHistory: false,
                error: null,
             };

        
        case 'KB_UPLOAD_START':
            return { ...state, isUploadingKb: true, error: null };
        case 'KB_UPLOAD_SUCCESS':
            return { ...state, isUploadingKb: false };
        case 'KB_UPLOAD_FAIL':
            return { ...state, isUploadingKb: false, error: { message: action.payload, context: 'kb_upload' } };

        // Chats
        case 'FETCH_CHATS_START':
            return { ...state, isLoadingChats: true, error: null };
        case 'FETCH_CHATS_SUCCESS':
            return { ...state, isLoadingChats: false, chats: action.payload };
        case 'FETCH_CHATS_FAIL':
            return { ...state, isLoadingChats: false, error: { message: action.payload, context: 'chats' } };

        case 'CREATE_CHAT_START':
             return { ...state, isCreatingChat: true, error: null };
        case 'CREATE_CHAT_SUCCESS':
            const newChats = [...state.chats, action.payload];
            return {
                ...state,
                isCreatingChat: false,
                chats: newChats,
            };
        case 'CREATE_CHAT_FAIL':
             return { ...state, isCreatingChat: false, error: { message: action.payload, context: 'create_chat' } };

        case 'DELETE_CHAT_START':
            return { ...state, isLoadingChats: true, error: null };
        case 'DELETE_CHAT_SUCCESS':
            const filteredChats = state.chats.filter(chat => chat.id !== action.payload.chatId);
            const isCurrentChatDeleted = state.currentChatId === action.payload.chatId;
            return {
                ...state,
                isLoadingChats: false,
                chats: filteredChats,
                currentChatId: isCurrentChatDeleted ? null : state.currentChatId,
                currentChatHistory: isCurrentChatDeleted ? [] : state.currentChatHistory,
                latestQueryResponse: isCurrentChatDeleted ? null : state.latestQueryResponse,
                isLoadingHistory: isCurrentChatDeleted ? false : state.isLoadingHistory,
            };
        case 'DELETE_CHAT_FAIL':
            return { ...state, isLoadingChats: false, error: { message: action.payload, context: 'delete_chat' } };

        // Active Chat & History
        case 'SELECT_CHAT':
            if (state.currentChatId === action.payload) return state;
            return {
                ...state,
                currentChatId: action.payload,
                currentChatHistory: [],
                latestQueryResponse: null,
                error: null,
            };
        case 'FETCH_HISTORY_START':
             return { ...state, isLoadingHistory: true, error: null };
        case 'FETCH_HISTORY_SUCCESS':
             const messages = Array.isArray(action.payload) ? action.payload : [];
             return { ...state, isLoadingHistory: false, currentChatHistory: messages };
        case 'FETCH_HISTORY_FAIL':
             return { ...state, isLoadingHistory: false, error: { message: action.payload, context: 'history' } };

       
        case 'QUERY_START':
            
            return { ...state, isSendingQuery: true, error: null, latestQueryResponse: null };
        case 'ADD_USER_MESSAGE':
            const userMessage = {
                ...action.payload,
                id: `temp-user-${Date.now()}`,
                timestamp: action.payload.timestamp || new Date().toISOString(),
                
                responseData: null,
            };
            return {
                ...state,
                currentChatHistory: [...state.currentChatHistory, userMessage],
            };
        case 'QUERY_SUCCESS': { 
                
                console.log('[Reducer QUERY_SUCCESS] Payload received:', action.payload);
                
                const assistantMessage = {
                    id: `temp-assistant-${Date.now()}`,
                    role: 'assistant',
                    content: action.payload.response?.final || "Error: Missing final answer content.", 
                    timestamp: new Date().toISOString(),
                    isError: !action.payload.response?.final, 
                    responseData: action.payload.response || null 
                 };
                 console.log('[Reducer QUERY_SUCCESS] Adding assistant message with responseData:', assistantMessage);
                

                return {
                    ...state,
                    isSendingQuery: false,
                    
                    latestQueryResponse: action.payload.response || null,
                    
                    currentChatHistory: [...state.currentChatHistory, assistantMessage],
                };
        } 
        case 'QUERY_FAIL': { 
            console.error('[Reducer QUERY_FAIL] Payload:', action.payload);
            const errorMessage = {
                id: `temp-error-${Date.now()}`,
                role: 'assistant',
                content: `Error: ${action.payload || 'An unknown error occurred during the query.'}`,
                timestamp: new Date().toISOString(),
                isError: true,
                
                responseData: null
            };
            return {
                ...state,
                isSendingQuery: false,
                error: { message: action.payload, context: 'query' },
                currentChatHistory: [...state.currentChatHistory, errorMessage],
                
                latestQueryResponse: null,
            };
        } 

         
        case 'CLEAR_ERROR':
            return { ...state, error: null };

        default:
            return state;
    }
};