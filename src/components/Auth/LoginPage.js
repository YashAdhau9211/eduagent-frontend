// src/components/Auth/LoginPage.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { loginUser } from '../../services/api';
import LoadingSpinner from '../common/loadingSpinner'; // Corrected path casing

const LoginPage = () => {
    const { state, dispatch } = useAppContext();
    const { isLoadingAuth, authError } = state; // Get authError from state
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });

    // Clear previous auth errors when component mounts or form data changes
    useEffect(() => {
        dispatch({ type: 'AUTH_FAIL', payload: null }); // Clear error on mount/change
    }, [dispatch]); // Run only once on mount

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (authError) { // Clear error when user starts typing again
             dispatch({ type: 'AUTH_FAIL', payload: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'AUTH_START' });
        try {
            const data = await loginUser(formData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: data });
            navigate('/');
        } catch (error) {
            // Dispatch the error message received from the API service
            dispatch({ type: 'AUTH_FAIL', payload: error.message || 'Login failed' });
        }
    };

    return (
        <div className="auth-page">
            <h2>Login to EduAgent.ai</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={isLoadingAuth}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoadingAuth}
                    />
                </div>
                {/* Display the authError if it exists */}
                {authError && <p className="error-message">{authError}</p>}
                <button type="submit" disabled={isLoadingAuth}>
                    {isLoadingAuth ? <LoadingSpinner size="16px" /> : 'Login'}
                </button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginPage;