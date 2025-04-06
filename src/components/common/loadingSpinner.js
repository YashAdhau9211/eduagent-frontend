import React from 'react';

const LoadingSpinner = ({ size = '24px' }) => (
    <div style={{
        border: '4px solid rgba(0, 0, 0, 0.1)',
        width: size,
        height: size,
        borderRadius: '50%',
        borderLeftColor: '#09f',
        animation: 'spin 1s linear infinite',
        display: 'inline-block',
        margin: '0 5px',
    }}>
        <style>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

export default LoadingSpinner;