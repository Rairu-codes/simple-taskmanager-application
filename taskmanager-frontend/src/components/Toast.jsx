import React from 'react'
import { useEffect } from 'react';
import '../Toast.css';

function Toast({ message, type, onClose }) {
    // Auto-close toast after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        // Cleanup timer on unmount
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' && '✓'}
            {type === 'error' && '✕'}
            {type === 'info' && 'ℹ'}
        </span>
                <span className="toast-message">{message}</span>
            </div>
            <button className="toast-close" onClick={onClose}>
                ×
            </button>
        </div>
    );
}
export default Toast
