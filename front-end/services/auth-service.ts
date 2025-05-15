import axios from "axios"

// Define API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL 

// Define user interface
// auth-service.ts
export interface User {
  id: string
  username: string
  email: string
  ig_is_connected: string
  yt_is_connected: string
  // Removed createdAt
}

// Define auth response interface
export interface AuthResponse {
  user: User
  token: string
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auth service with methods for login, signup, logout, etc.
export const authService = {
  // Login user with email and password
  async login(email: string, password: string,yt_is_connected:string,ig_is_connected:string ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/user/login", { email, password });
      
      // Store token immediately after login
      localStorage.setItem("auth_token", response.data.token);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("User not found."); // ❌ Generic error
        }
        else if (error.response?.status === 403){
          throw new Error("Wrong Password");
        }
        throw new Error(error.response?.data?.detail || "Login failed");
      }
      throw new Error("Network error. Please check your connection.");
    }
  },

  // Register new user
  async signup(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/user/signup", {
        username,
        email,
        password,
      })

      // Store token in localStorage
      localStorage.setItem("auth_token", response.data.token)

      return response.data
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  },

  // Logout user
  logout(): void {
    localStorage.removeItem("auth_token")
  },

  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return null;
  
      // Verify token exists before making request
      const response = await api.get<User>("/user/me");
      
      // Add validation
      if (!response.data?.id) {
        this.logout();
        return null;
      }
      
      return response.data;
    } catch (error) {
      this.logout();  // Clear invalid tokens
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token")
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem("auth_token")
  },
}
