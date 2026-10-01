import React, { useEffect, useRef } from 'react';
import type { Chat, Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  activeChat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  activeChat,
  messages,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeChat) {
    return (
      <main className="chat-window">
        <div className="empty-chat">Выберите чат, чтобы начать общение</div>
      </main>
    );
  }

  return (
    <main className="chat-window">
      <header className="chat-header">
        <div className="avatar">{activeChat.name.charAt(0).toUpperCase()}</div>
        <div>
          <div className="chat-name">{activeChat.name}</div>
          <div className={`chat-status ${activeChat.isOnline ? 'online' : ''}`}>
            {activeChat.isOnline ? 'в сети' : 'был(а) недавно'}
          </div>
        </div>
      </header>

      <div className="message-list">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={onSendMessage} />
    </main>
  );
};