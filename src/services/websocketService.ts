import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessage } from '../@type/chat';

class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private messageCallbacks: Map<number, (message: ChatMessage) => void> = new Map();
  private subscriptions: Map<number, any> = new Map();

  connect(onConnected?: () => void, onError?: (error: any) => void) {
    if (this.connected) {
      console.log('✅ WebSocket already connected');
      onConnected?.();
      return;
    }

    const wsUrl = `${import.meta.env.VITE_API_URL}/ws`;
    console.log('🔌 Connecting to WebSocket:', wsUrl);
    const socket = new SockJS(wsUrl);
    
    this.client = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket Connected');
      this.connected = true;
      onConnected?.();
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      this.connected = false;
      onError?.(frame);
    };

    this.client.onWebSocketClose = () => {
      console.log('WebSocket Disconnected');
      this.connected = false;
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.messageCallbacks.clear();
      this.subscriptions.clear();
    }
  }

  subscribeToRoom(roomId: number, callback: (message: ChatMessage) => void) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    // Unsubscribe if already subscribed
    if (this.subscriptions.has(roomId)) {
      this.unsubscribeFromRoom(roomId);
    }

    const topic = `/topic/rooms/${roomId}`;
    
    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        console.log(`📨 Message received in room ${roomId}:`, chatMessage);
        callback(chatMessage);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.subscriptions.set(roomId, subscription);
    this.messageCallbacks.set(roomId, callback);
    console.log(`✅ Subscribed to room ${roomId}`);
  }

  unsubscribeFromRoom(roomId: number) {
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(roomId);
      console.log(`❌ Unsubscribed from room ${roomId}`);
    }
    this.messageCallbacks.delete(roomId);
  }

  sendMessage(roomId: number, senderId: number, message: string) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const payload = {
      roomId,
      senderId,
      message,
    };

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(payload),
    });

    console.log('Message sent:', payload);
  }

  subscribeToUserQueue(userId: number, callback: () => void) {
    // TODO: Implement user-specific queue subscription
    // For now, this is a placeholder
    console.log(`📬 Subscribed to user queue for user ${userId}`);
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const websocketService = new WebSocketService();
