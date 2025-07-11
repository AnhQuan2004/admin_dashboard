
const API_BASE_URL = 'http://13.229.93.67:3000/api';

export interface User {
  _id: string;
  createdAt: string;
  email: string;
  fullName: string;
}

export interface QuizResult {
  _id: string;
  completedAt: string;
  domainId: string;
  domainTitle: string;
  email: string;
  recommendation: {
    level: string;
    message: string;
  };
  scores: {
    anxiety: number;
    depression: number;
    stress: number;
    total: number;
  };
  userInfo: {
    email: string;
    fullName: string;
    userId: string;
  };
}

export interface ChatConversation {
  _id: string;
  conversations: Array<{
    botResponse: string;
    botStatus: string;
    timestamp: string;
    userMessage: string;
    userStatus: string;
  }>;
  createdAt: string;
  sessionId: string;
  userInfo: {
    email: string;
    fullName: string;
    userId: string;
  };
}

class ApiService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getUsers(): Promise<{ users: User[]; total: number }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/users`);
  }

  async getQuizResults(): Promise<QuizResult[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/quiz/results`);
  }

  async getChatConversations(): Promise<ChatConversation[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/chat/expert`);
  }
}

export const apiService = new ApiService();
