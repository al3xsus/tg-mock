import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMe = message.sender === 'me';

  return (
    <div className={`message-bubble ${isMe ? 'me' : 'them'}`}>
      <span className="message-text">{message.text}</span>
      <span className="message-footer">{message.timestamp}</span>
    </div>
  );
};