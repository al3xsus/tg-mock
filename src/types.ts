export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  chatId: string;
  sender: 'me' | 'them'; 
  text: string;
  timestamp: string;    
  senderPhoneNumber?: string;
}

export interface GreenApiCredentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}