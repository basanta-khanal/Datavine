// API Client for DataVine.ai Backend
// Updated for production deployment - FIXED URL ISSUE

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In development (localhost), use local backend
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5001';
  }
  
  // In production, use Railway backend
  return 'https://datavine-production.up.railway.app';
};

const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('datavine_token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    // Security: Don't log sensitive data
    console.log('API Request URL:', url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle network errors gracefully
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request error:', error);
      
      // Return a graceful error response instead of throwing
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
        data: undefined
      };
    }
  }

  // Authentication
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    gender?: string;
  }): Promise<ApiResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.clearToken();
    return response;
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async googleLogin(email: string, name: string, googleId: string): Promise<ApiResponse> {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ email, name, googleId }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request('/auth/me');
  }

  // User Management
  async updateProfile(profileData: {
    name?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
  }): Promise<ApiResponse> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadProfilePicture(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseURL}/api/users/upload-profile-picture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    return response.json();
  }

  async removeProfilePicture(): Promise<ApiResponse> {
    return this.request('/users/remove-profile-picture', {
      method: 'DELETE',
    });
  }

  async getDashboard(): Promise<ApiResponse> {
    return this.request('/users/dashboard');
  }

  // Assessments
  async saveAssessmentResult(assessmentData: {
    testType: 'iq' | 'adhd' | 'asd' | 'anxiety';
    score: number;
    maxScore: number;
    answers: Array<{
      questionId: number;
      selectedAnswer: string;
      isCorrect: boolean;
      timeSpent: number;
    }>;
    detailedResults?: any;
  }): Promise<ApiResponse> {
    return this.request('/assessments/save-result', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  }

  async getAssessmentHistory(params?: {
    testType?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request(`/assessments/history${queryString}`);
  }

  async getAssessmentStats(): Promise<ApiResponse> {
    return this.request('/assessments/stats/overview');
  }

  async getPerformanceTrend(params?: {
    testType?: string;
    days?: number;
  }): Promise<ApiResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request(`/assessments/stats/performance-trend${queryString}`);
  }

  // AI Recommendations
  async generateRecommendations(data: {
    assessmentId: string;
    testType: string;
    score: number;
    answers: any[];
    detailedResults?: any;
  }): Promise<ApiResponse> {
    return this.request('/ai/generate-recommendations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRecommendations(assessmentId: string): Promise<ApiResponse> {
    return this.request(`/ai/recommendations/${assessmentId}`);
  }

  async analyzePatterns(): Promise<ApiResponse> {
    return this.request('/ai/analyze-patterns', {
      method: 'POST',
    });
  }

  // Payments
  async createPaymentIntent(data: {
    subscriptionType: 'basic' | 'premium' | 'enterprise';
    paymentMethod: 'card' | 'apple_pay';
  }): Promise<ApiResponse> {
    return this.request('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmSubscription(data: {
    paymentIntentId: string;
    subscriptionType: string;
  }): Promise<ApiResponse> {
    return this.request('/payments/confirm-subscription', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSubscriptionStatus(): Promise<ApiResponse> {
    return this.request('/payments/subscription-status');
  }

  async cancelSubscription(): Promise<ApiResponse> {
    return this.request('/payments/cancel-subscription', {
      method: 'POST',
    });
  }

  // Token Management
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('datavine_token', token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('datavine_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in components
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  subscription: {
    type: string;
    status: string;
    startDate: string;
    endDate?: string;
  };
  totalAssessments: number;
  averageScore: number;
  isSubscribed: boolean;
  createdAt: string;
}

export interface Assessment {
  id: string;
  testType: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: Array<{
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  completedAt: string;
  detailedResults?: any;
  aiRecommendations?: any;
}

export interface DashboardData {
  user: User;
  stats: {
    totalAssessments: number;
    averageScore: number;
    bestScore: number;
    improvement: number;
    performanceByType: {
      iq: number;
      adhd: number;
      asd: number;
      anxiety: number;
    };
  };
  recentActivity: Array<{
    id: string;
    testType: string;
    score: number;
    date: string;
  }>;
  subscription: any;
  isSubscribed: boolean;
}

export interface AIRecommendations {
  performanceAnalysis: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  resources: string[];
  timeline: string;
  motivation: string;
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  plan: {
    name: string;
    features: string[];
  };
}

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100); // Convert cents to dollars
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getPerformanceLevel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Average';
  if (score >= 50) return 'Below Average';
  return 'Needs Improvement';
};

export default apiClient; 