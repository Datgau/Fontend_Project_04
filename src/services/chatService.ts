import api from './api';
import type { ChatMessage, Conversation, CreateRoomRequest } from '../@type/chat';

export const chatService = {
  // Lấy danh sách conversations của user
  async getConversations(userId: number): Promise<Conversation[]> {
    const response = await api.get(`/chat/conversations/${userId}`);
    return response.data;
  },

  // Lấy messages của một room
  async getMessages(roomId: number, page: number = 0, size: number = 50): Promise<ChatMessage[]> {
    const response = await api.get(`/chat/rooms/${roomId}/messages`, {
      params: { page, size }
    });
    return response.data;
  },

  // Tạo hoặc lấy room 1-1
  async getOrCreateOneToOne(userA: number, userB: number): Promise<number> {
    // Use URL params instead of config params to avoid issues with retry
    const response = await api.post(`/chat/rooms/1to1?userA=${userA}&userB=${userB}`);
    return response.data;
  },

  // Tạo group room
  async createGroupRoom(request: CreateRoomRequest): Promise<number> {
    const response = await api.post('/chat/rooms', request);
    return response.data;
  },

  // Gửi message qua REST (fallback nếu WebSocket fail)
  async sendMessage(roomId: number, senderId: number, message: string): Promise<ChatMessage> {
    const response = await api.post('/chat/messages', {
      roomId,
      senderId,
      message
    });
    return response.data;
  },

  // Get all users with pagination
  async getAllUsers(page: number = 0, size: number = 20): Promise<import('../@type/chat').UserSearchResult[]> {
    const response = await api.get(`/chat/users`, {
      params: { page, size }
    });
    return response.data;
  },

  // Mark messages as read
  async markMessagesAsRead(roomId: number, userId: number): Promise<void> {
    await api.post(`/chat/rooms/${roomId}/read`, null, {
      params: { userId }
    });
  }
};
