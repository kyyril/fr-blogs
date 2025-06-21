import { httpService } from "./http.services";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    bio?: string;
    username?: string;
  };
  message?: string;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    try {
      const response = await httpService.post<LoginResponse>(
        "/api/auth/google",
        {
          token: idToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Auth response:", response);
      return response;
    } catch (error: any) {
      console.error("Google login error:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await httpService.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if server request fails
    }
  }

  // Get current user info (validates authentication)
  async getMe(): Promise<LoginResponse> {
    try {
      const response = await httpService.get<LoginResponse>("/api/auth/me");
      return response;
    } catch (error: any) {
      // If 401, try to refresh token
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await this.refreshToken();
          // If refresh succeeds, try getMe again
          const retryResponse = await httpService.get<LoginResponse>(
            "/api/auth/me"
          );
          return retryResponse;
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          throw error; // Throw original error
        }
      }
      throw error;
    }
  }

  // Refresh access token using refresh token
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await httpService.post<LoginResponse>(
        "/api/auth/refresh"
      );
      return response;
    } catch (error) {
      console.error("Refresh token error:", error);
      throw error;
    }
  }

  // Check if user is authenticated
  async checkAuth(): Promise<boolean> {
    try {
      await this.getMe();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
