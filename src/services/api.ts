const API_BASE_URL = "http://13.229.93.67:3000/api";

export interface User {
  _id: string;
  createdAt: string;
  email: string;
  fullName: string;
  isActive?: boolean;
}

export interface ExpertApplication {
  _id: string;
  fullName: string;
  personalEmail: string;
  phone: string;
  specialty: string;
  subSpecialty?: string;
  education: string;
  experience: number;
  bio: string;
  approach: string;
  city: string;
  address?: string;
  currentPosition?: string;
  workPlace?: string;
  dateOfBirth: string;
  gender: string;
  licenseNumber: string;
  languages: string[];
  availability: string[];
  hourlyRate?: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  accountCreated: boolean;
  expertAccountId?: string;
  expertEmail?: string;
  expertPassword?: string;
}

export interface Expert {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  qualifications?: string;
  isActive: boolean;
  approvedAt: string;
  createdAt: string;
  updatedAt?: string;
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
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
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

  async getExpertApplications(): Promise<ExpertApplication[]> {
    const response = await this.fetchWithErrorHandling(
      `${API_BASE_URL}/expert/applications`
    );
    return response.applications || [];
  }

  async getExpertApplication(appId: string): Promise<ExpertApplication> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/expert/application/${appId}`
    );
  }

  async approveExpertApplication(appId: string): Promise<ExpertApplication> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/expert/application/${appId}/approve`,
      {
        method: "PUT",
      }
    );
  }

  async rejectExpertApplication(appId: string): Promise<ExpertApplication> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/expert/application/${appId}/reject`,
      {
        method: "PUT",
      }
    );
  }

  async getExperts(): Promise<Expert[]> {
    const response = await this.fetchWithErrorHandling(
      `${API_BASE_URL}/experts`
    );
    return response.experts || [];
  }

  async getExpertProfile(expertEmail: string): Promise<Expert> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/expert/profile/${expertEmail}`
    );
  }

  async toggleExpertStatus(expertId: string): Promise<Expert> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/expert/${expertId}/toggle-status`,
      {
        method: "PUT",
      }
    );
  }
}

export const apiService = new ApiService();
