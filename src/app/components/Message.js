import React from 'react';

const Message = ({ message, type }) => {
  return (
    <div className={`message ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Message;
