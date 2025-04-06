import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ErrorDisplay = ({ context }) => {
    const { state, dispatch } = useAppContext();

    
    if (!state.error || (context && state.error.context !== context)) {
        return null;
    }

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '10px 0', position: 'relative' }}>
            <strong>Error{state.error.context ? ` (${state.error.context})` : ''}:</strong> {state.error.message || 'An unknown error occurred.'}
            <button onClick={clearError} style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontWeight: 'bold' }}>X</button>
        </div>
    );
};

export default ErrorDisplay;