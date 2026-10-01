import { useState } from 'react';
import './App.css';
import { useChat } from './hooks/useChat';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { CredentialsModal } from './components/CredentialsModal';
import { chatService } from './services/chatService';
import type { GreenApiCredentials } from './types';

export default function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const {
    chats,
    activeChatId,
    activeChat,
    currentMessages,
    selectChat,
    createChat,
    sendMessage,
  } = useChat();

  const handleSaveCredentials = (creds: GreenApiCredentials) => {
    chatService.setCredentials(creds);
    setIsConfigured(true);
  };

  return (
    <div className="app-container">
      {!isConfigured && <CredentialsModal onSave={handleSaveCredentials} />}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={selectChat}
        onCreateChat={createChat}
      />
      <ChatWindow
        activeChat={activeChat}
        messages={currentMessages}
        onSendMessage={sendMessage}
      />
    </div>
  );
}