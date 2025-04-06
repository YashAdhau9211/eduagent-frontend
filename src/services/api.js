import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.response.use(
    response => response,
    error => {
        
        console.error("API call error:", error.response || error.message || error);
        
        return Promise.reject({
            message: error.response?.data?.error || error.response?.data?.detail || 'An unexpected error occurred',
            status: error.response?.status,
            data: error.response?.data
        });
    }
);


export const fetchSubjects = async () => {
    const response = await apiClient.get('/subjects/');
    return response.data; 
};

export const uploadKnowledgeBase = async (subject, files) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    
    const response = await apiClient.post(`/subjects/${encodeURIComponent(subject)}/kb/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data; 
};

export const fetchChats = async () => {
    const response = await apiClient.get('/chats/');
    return response.data; 
};

export const createChat = async (data) => {
    
    const response = await apiClient.post('/chats/', data);
    return response.data; 
};

export const fetchChatDetail = async (chatId) => {
    const response = await apiClient.get(`/chats/${chatId}/`);
    return response.data; 
};

export const updateChat = async (chatId, data) => {
    
    const response = await apiClient.patch(`/chats/${chatId}/`, data);
    return response.data; 
};

export const deleteChat = async (chatId) => {
    await apiClient.delete(`/chats/${chatId}/`);
    
};

export const postQuery = async (data) => {
    
    const response = await apiClient.post('/query/', data);
    
    return response.data;
};

export default apiClient; 