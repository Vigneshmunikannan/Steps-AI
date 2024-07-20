import React from 'react';
const MessageComponent = ({ type, message }) => {
  const colorClass = type === 'success' ? 'success' : 'error';
  return (
    <div className={`message-container ${colorClass}`}>
      {message}
    </div>
  );
};

export default MessageComponent;
