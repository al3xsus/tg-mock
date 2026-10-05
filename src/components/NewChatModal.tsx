import React, { useState } from 'react';
import { formatChatId } from '../utils/formatChatId';

interface NewChatModalProps {
  onClose: () => void;
  onCreate: (chatId: string, name: string) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ onClose, onCreate }) => {
  const [chatId, setChatId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedId = formatChatId(chatId);
    if (!formattedId) return;

    onCreate(formattedId, name.trim() || formattedId);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#17212b',
          padding: '24px',
          borderRadius: '12px',
          width: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h3 style={{ margin: 0, color: '#fff' }}>Новый чат</h3>
        <input
          placeholder="Telegram ID"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #242f3d', background: '#0e1621', color: '#fff' }}
        />
        <input
          placeholder="Имя контакта (опционально)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #242f3d', background: '#0e1621', color: '#fff' }}
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#242f3d', color: '#fff', cursor: 'pointer' }}
          >
            Отмена
          </button>
          <button
            type="submit"
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#5288c1', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
          >
            Создать
          </button>
        </div>
      </form>
    </div>
  );
};
