const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('eduagent-theme');
    return savedTheme || 'dark'; 
};


export const initialState = {
    subjects: [],
    selectedSubject: null,
    chats: [],
    currentChatId: null,
    currentChatHistory: [],
    latestQueryResponse: null,

    
    theme: getInitialTheme(), 
    
    isLoadingSubjects: false,
    isLoadingChats: false,
    isLoadingHistory: false,
    isUploadingKb: false,
    isSendingQuery: false,
    isCreatingChat: false,

    // Error state
    error: null,
};