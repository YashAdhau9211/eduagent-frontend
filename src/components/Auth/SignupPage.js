// src/components/Auth/SignupPage.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { signupUser } from '../../services/api';
import LoadingSpinner from '../common/loadingSpinner'; // Corrected path casing

const SignupPage = () => {
    const { state, dispatch } = useAppContext();
    const { isLoadingAuth, authError } = state; // Get authError
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
    });

    // Clear previous auth errors when component mounts
     useEffect(() => {
        dispatch({ type: 'AUTH_FAIL', payload: null }); // Clear error on mount
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
         if (authError) { // Clear error when user starts typing again
             dispatch({ type: 'AUTH_FAIL', payload: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirm) {
            // Use AUTH_FAIL to set the error message in state
            dispatch({ type: 'AUTH_FAIL', payload: 'Passwords do not match' });
            return;
        }
        dispatch({ type: 'AUTH_START' });
        try {
            await signupUser({
                username: formData.username,
                email: formData.email,
                password1: formData.password, // Use correct keys for backend
                password2: formData.password_confirm,
             });
            dispatch({ type: 'SIGNUP_SUCCESS' });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            
            dispatch({ type: 'AUTH_FAIL', payload: error.message || 'Signup failed' });
        }
    };

    return (
         <div className="auth-page">
            <h2>Sign Up for EduAgent.ai</h2>
            <form onSubmit={handleSubmit}>
                 <div><label htmlFor="username">Username:</label><input id="username" type="text" name="username" value={formData.username} onChange={handleChange} required disabled={isLoadingAuth} /></div>
                 <div><label htmlFor="email">Email:</label><input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isLoadingAuth} /></div>
                 <div><label htmlFor="password">Password:</label><input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required disabled={isLoadingAuth} /></div>
                 <div><label htmlFor="password_confirm">Confirm Password:</label><input id="password_confirm" type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange} required disabled={isLoadingAuth} /></div>

                {/* Display the authError if it exists */}
                {authError && <p className="error-message">{authError}</p>}
                <button type="submit" disabled={isLoadingAuth}>
                    {isLoadingAuth ? <LoadingSpinner size="16px" /> : 'Sign Up'}
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default SignupPage;