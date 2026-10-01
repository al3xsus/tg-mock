import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import type { Chat } from '../types';
import { NewChatModal } from './NewChatModal';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onCreateChat: (chatId: string, name: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div className="search-wrapper" style={{ flex: 1 }}>
          <Search size={18} color="#7f91a4" />
          <input type="text" placeholder="Поиск..." />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: '#2b5278',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="Создать чат"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="avatar">
              {chat.name.charAt(0).toUpperCase()}
              {chat.isOnline && <span className="online-badge" />}
            </div>
            <div className="chat-info">
              <div className="chat-top-row">
                <span className="chat-name">{chat.name}</span>
                <span className="chat-time">{chat.lastMessageTime}</span>
              </div>
              <p className="chat-last-message">{chat.lastMessage || 'Нет сообщений'}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <NewChatModal
          onClose={() => setIsModalOpen(false)}
          onCreate={onCreateChat}
        />
      )}
    </aside>
  );
};