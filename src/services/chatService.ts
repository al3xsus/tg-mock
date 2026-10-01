import type { Message, GreenApiCredentials } from '../types';

type MessageCallback = (message: Message) => void;

class ChatService {
  private subscribers: MessageCallback[] = [];
  private credentials: GreenApiCredentials | null = null;
  private isPolling = false;

  setCredentials(credentials: GreenApiCredentials) {
    this.credentials = credentials;
    if (!this.isPolling) {
      this.startPolling();
    }
  }

  subscribe(callback: MessageCallback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notifySubscribers(message: Message) {
    this.subscribers.forEach((callback) => callback(message));
  }

  async sendMessage(chatId: string, text: string): Promise<Message> {
    if (!this.credentials) {
      throw new Error('Креды GREEN-API не настроены');
    }

    const { apiUrl, idInstance, apiTokenInstance } = this.credentials;
    const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        message: text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка отправки сообщения: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.idMessage,
      chatId,
      sender: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  private async startPolling() {
    this.isPolling = true;

    while (this.isPolling) {
      if (!this.credentials) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      try {
        await this.receiveNotification();
      } catch (error) {
        console.error('Ошибка при получении уведомления:', error);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  private async receiveNotification() {
    if (!this.credentials) return;

    const { apiUrl, idInstance, apiTokenInstance } = this.credentials;
    const receiveUrl = `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`;

    const response = await fetch(receiveUrl);
    if (!response.ok) return;

    const data = await response.json();

    if (!data || !data.receiptId) return;

    const { receiptId, body } = data;

    if (body?.typeWebhook === 'incomingMessageReceived') {
      const chatId = body.senderData?.chatId;
      const senderPhoneNumber = body.senderData?.senderPhoneNumber; // ИЗВЛЕКАЕМ НОМЕР ТЕЛЕФОНА
      
      const textMessage =
        body.messageData?.textMessageData?.textMessage ||
        body.messageData?.extendedTextMessageData?.text;

      if (chatId && textMessage) {
        const date = body.timestamp ? new Date(body.timestamp * 1000) : new Date();
        const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.notifySubscribers({
          id: body.idMessage || String(Date.now()),
          chatId,
          senderPhoneNumber, 
          sender: 'them',
          text: textMessage,
          timestamp,
        });
      }
    }

    await this.deleteNotification(receiptId);
  }

  private async deleteNotification(receiptId: number) {
    if (!this.credentials) return;

    try {
      const { apiUrl, idInstance, apiTokenInstance } = this.credentials;
      const deleteUrl = `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

      await fetch(deleteUrl, { method: 'DELETE' });
    } catch (e) {
      console.error('Не удалось удалить уведомление:', e);
    }
  }
}

export const chatService = new ChatService();