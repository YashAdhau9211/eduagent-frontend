const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('eduagent-theme');
    return savedTheme || 'dark'; 
};

const getInitialAuthToken = () => {
    try {
        return localStorage.getItem('eduagent-access-token');
    } catch (e) {
        console.error("Error reading auth token from localStorage", e);
        return null;
    }
};


export const initialState = {
    // --- Auth State ---
    isAuthenticated: false, // Initially not authenticated
    authToken: getInitialAuthToken(), // Load token on init (will verify with API)
    user: null, // Store user details (e.g., { id, username, email })
    isLoadingAuth: false, // For login/signup loading
    authError: null, // For login/signup errors
    // --- End Auth State ---

    subjects: [],
    selectedSubject: null,
    chats: [],
    currentChatId: null,
    currentChatHistory: [],
    latestQueryResponse: null, // Keep for now, but tabs use msg.responseData
    theme: getInitialTheme(),

    // Loading states
    isLoadingSubjects: false,
    isLoadingChats: false,
    isLoadingHistory: false,
    isUploadingKb: false,
    isSendingQuery: false,
    isCreatingChat: false,

    // Error state
    error: null,
};

