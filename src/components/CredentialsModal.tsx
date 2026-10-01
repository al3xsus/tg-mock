import React, { useState } from 'react';
import type { GreenApiCredentials } from '../types';

interface Props {
  onSave: (creds: GreenApiCredentials) => void;
}

export const CredentialsModal: React.FC<Props> = ({ onSave }) => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idInstance && apiTokenInstance) {
      onSave({ apiUrl, idInstance, apiTokenInstance });
    }
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
        <h3 style={{ margin: 0, color: '#fff' }}>Авторизация GREEN-API</h3>
        <input
          readOnly={true}
          value={apiUrl}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #242f3d', background: '#0e1621', color: '#fff' }}
        />
        <input
          placeholder="idInstance"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #242f3d', background: '#0e1621', color: '#fff' }}
        />
        <input
          placeholder="apiTokenInstance"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #242f3d', background: '#0e1621', color: '#fff' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#5288c1',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Сохранить и подключиться
        </button>
      </form>
    </div>
  );
};