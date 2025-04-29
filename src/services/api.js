import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL || 'http://127.0.0.1:8000'; // Example: Root URL

const apiClient = axios.create({
    
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('eduagent-access-token');

        
        const publicUrls = [
            `${AUTH_BASE_URL}/auth/login/`, 
            `${AUTH_BASE_URL}/auth/register/`, 
            
        ];

        // Construct the full URL for comparison
        const fullUrl = config.baseURL && !config.url?.startsWith('http')
            ? `${config.baseURL}${config.url}`
            : config.url;

        // Check if the token exists and if the request URL is not public
        if (token && !publicUrls.some(url => fullUrl?.startsWith(url))) {
             console.log(`[API Interceptor] Adding token to request for: ${config.url}`); // Debug log
             config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log(`[API Interceptor] No token added for: ${config.url}`); // Debug log
        }

        return config; // Return the modified config
    },
    (error) => {
        // Handle request errors (e.g., network issues before sending)
        console.error("API Request Interceptor Error:", error);
        return Promise.reject(error);
    }
);



apiClient.interceptors.response.use(
    response => response, // Pass through successful responses
    error => {
        // Log the raw error object for detailed debugging if needed
        console.error("API call error Raw:", error);
        // Log the response data if available
        console.error("API call error Response Data:", error.response?.data);

        let errorMessage = "An unexpected error occurred."; // Default message

        
        if (error.response?.data) {
            const responseData = error.response.data;

            // 1. Check for 'detail' (common for non-field auth errors like bad credentials)
            if (responseData.detail) {
                errorMessage = responseData.detail;
            }
            // 2. Check for 'non_field_errors' (common for DRF form validation)
            else if (responseData.non_field_errors && Array.isArray(responseData.non_field_errors)) {
                errorMessage = responseData.non_field_errors.join(' '); // Join multiple non-field errors
            }
            // 3. Check if it's an object (likely field-specific validation errors)
            else if (typeof responseData === 'object') {
                const fieldErrors = [];
                for (const key in responseData) {
                    // Check if the value for the key is an array (standard DRF error format)
                    if (Array.isArray(responseData[key])) {
                        // Format as "Field: error1 error2"
                        // Capitalize field name for better readability
                        const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                        fieldErrors.push(`${fieldName}: ${responseData[key].join(' ')}`);
                    }
                    // Handle cases where the error might be a simple string under the key
                    else if (typeof responseData[key] === 'string') {
                         const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                         fieldErrors.push(`${fieldName}: ${responseData[key]}`);
                    }
                }
                // If we found field errors, join them
                if (fieldErrors.length > 0) {
                    errorMessage = fieldErrors.join('; ');
                }
                // As a fallback for objects, check for a simple 'error' key
                else if (responseData.error && typeof responseData.error === 'string') {
                     errorMessage = responseData.error;
                }
                // If it's an object but we couldn't parse specific errors, maybe stringify it? (Less ideal)
                // else { errorMessage = JSON.stringify(responseData); }
            }
            // 4. Check if the response data itself is just a plain string error
            else if (typeof responseData === 'string') {
                 errorMessage = responseData;
            }
        }
        
        else if (error.message) {
            errorMessage = error.message; // e.g., "Network Error"
        }
        

        console.error("API call error Formatted Message:", errorMessage);

        
        return Promise.reject({
            message: errorMessage, // Use the extracted/formatted message
            status: error.response?.status,
            data: error.response?.data // Keep original data if needed elsewhere
        });
    }
);




/**
 * Logs in a user.
 * @param {object} credentials - { username, password }
 * @returns {Promise<{token: string, user: object}>} - Object containing access token and user details.
 * @throws {Error} If login fails.
 */
export const loginUser = async (credentials) => {
    
    const response = await axios.post(`${AUTH_BASE_URL}/auth/login/`, credentials, {
         headers: { 'Content-Type': 'application/json' } // Ensure correct header for this call
    });
    
    if (response.data.access && response.data.user) {
        return { token: response.data.access, user: response.data.user };
    } else if (response.data.key) { // Example for DRF TokenAuthentication
         // If only a key is returned, you might need a separate call to get user details
         console.warn("Login returned only a token key. Implement loadUser separately.");
         return { token: response.data.key, user: null }; // Adjust as needed
    } else {
        throw new Error("Login response did not contain expected token/user data.");
    }
};

/**
 * Registers a new user.
 * @param {object} userData - 
 * @returns {Promise<object>} 
 * @throws {Error} 
 */
export const signupUser = async (userData) => {
    // Assuming signup endpoint is at /auth/register/ relative to AUTH_BASE_URL
    // Adjust URL path if needed
    const response = await axios.post(`${AUTH_BASE_URL}/auth/register/`, userData, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

/**
 
 * @returns {Promise<{user: object}>} - 
 * @throws {Error} 
 */
export const loadUser = async () => {
    
    const response = await apiClient.get(`${AUTH_BASE_URL}/auth/user/`); // apiClient uses interceptor
    
    return { user: response.data };
};

export const logoutUser = async () => {
    // Example: If you have a backend endpoint to invalidate tokens
    const token = localStorage.getItem('eduagent-refresh-token'); // If using refresh tokens
    if (token) {
        try {
            await axios.post(`${AUTH_BASE_URL}/auth/logout/`, { refresh: token } , {
                 headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.warn("Backend logout call failed:", error);
        }
    }
    console.log("Frontend logout initiated (backend call is optional).");
    // Actual token/state clearing happens in the reducer/component.
};



export const fetchSubjects = async () => {
    const response = await apiClient.get('/subjects/'); // Uses API_BASE_URL
    return response.data;
};

export const uploadKnowledgeBase = async (subject, files) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    console.log(`[uploadKnowledgeBase] Uploading ${files.length} files for subject: ${subject}`);

    try {
        
        const response = await apiClient.post(
            `/subjects/${encodeURIComponent(subject)}/kb/`,
            formData,
            {
                headers: {
                    
                    'Content-Type': undefined
                    
                }
            }
        );

        console.log("KB Upload Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("KB Upload Failed:", error?.message || error);
        throw error;
    }
};


export const fetchChats = async () => {
    // Interceptor will add token
    const response = await apiClient.get('/chats/');
    return response.data;
};

export const createChat = async (data) => {
    // Interceptor will add token
    const response = await apiClient.post('/chats/', data);
    return response.data;
};

export const fetchChatDetail = async (chatId) => {
    // Interceptor will add token
    const response = await apiClient.get(`/chats/${chatId}/`);
    return response.data;
};

export const updateChat = async (chatId, data) => {
    // Interceptor will add token
    const response = await apiClient.patch(`/chats/${chatId}/`, data);
    return response.data;
};

export const deleteChat = async (chatId) => {
    // Interceptor will add token
    await apiClient.delete(`/chats/${chatId}/`);
};

export const postQuery = async (data) => {
    // Interceptor will add token
    const response = await apiClient.post('/query/', data);
    return response.data;
};




export default apiClient; 