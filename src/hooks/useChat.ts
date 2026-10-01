import { useState, useEffect, useCallback } from 'react';
import type { Chat, Message } from '../types';
import { chatService } from '../services/chatService';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const createChat = useCallback((chatId: string, name?: string) => {
    setChats((prev) => {
      if (prev.some((c) => c.id === chatId)) return prev;
      return [{ id: chatId, name: name || chatId, isOnline: true }, ...prev];
    });
    setActiveChatId((current) => current || chatId);
  }, []);

  const updateLastMessage = useCallback((chatId: string, text: string, time: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: text, lastMessageTime: time }
          : chat
      )
    );
  }, []);

  useEffect(() => {
    const unsubscribe = chatService.subscribe((incoming) => {
      const chatId = incoming.chatId;

      setChats((prev) => {
        if (!prev.some((c) => c.id === chatId)) {
          return [{ id: chatId, name: chatId, isOnline: true }, ...prev];
        }
        return prev;
      });

      setMessages((prevMsgs) => {
        const currentMsgs = prevMsgs[chatId] || [];
        if (currentMsgs.some((m) => m.id === incoming.id)) {
          return prevMsgs;
        }
        return {
          ...prevMsgs,
          [chatId]: [...currentMsgs, incoming],
        };
      });

      updateLastMessage(chatId, incoming.text, incoming.timestamp);
    });

    return () => unsubscribe();
  }, [updateLastMessage]);

  const sendMessage = async (text: string) => {
    if (!activeChatId) return;

    try {
      const sentMessage = await chatService.sendMessage(activeChatId, text);

      setMessages((prev) => {
        const currentMsgs = prev[activeChatId] || [];
        if (currentMsgs.some((m) => m.id === sentMessage.id)) {
          return prev;
        }
        return {
          ...prev,
          [activeChatId]: [...currentMsgs, sentMessage],
        };
      });

      updateLastMessage(activeChatId, sentMessage.text, sentMessage.timestamp);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Не удалось отправить сообщение. Проверьте настройки GREEN-API.');
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const currentMessages = activeChatId ? messages[activeChatId] || [] : [];

  return {
    chats,
    activeChatId,
    activeChat,
    currentMessages,
    selectChat: setActiveChatId,
    createChat,
    sendMessage,
  };
}