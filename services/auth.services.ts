import { httpService } from "./http.services";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    bio?: string;
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
        }
      );

      console.log("Auth response:", response);
      return response;
    } catch (error: any) {
      console.error("Google login error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await httpService.post("/api/auth/logout");

      // Clear any stored user data
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear local data and redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  }

  // Check if user is authenticated by making a request to a protected endpoint
  async checkAuth(): Promise<boolean> {
    try {
      // You can create a simple /api/auth/me endpoint to check authentication
      await httpService.get("/api/auth/me");
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
