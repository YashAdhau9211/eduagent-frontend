import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ThemeToggler = () => {
    const { state, dispatch } = useAppContext();
    const { theme } = state;

    const handleToggle = () => {
        dispatch({ type: 'TOGGLE_THEME' });
    };

    return (
        <button onClick={handleToggle} className="theme-toggle-btn">
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            
        </button>
    );
};

export default ThemeToggler;