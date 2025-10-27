import React from 'react';

const LoadingIndicator = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClass = {
    small: 'loading-spinner-sm',
    medium: 'loading-spinner-md',
    large: 'loading-spinner-lg'
  }[size] || 'loading-spinner-md';

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`} />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingIndicator;