import { httpService } from "./http.services";
import { tokenService } from "./token.services";

export interface LoginResponse {
  token?: string; // Make token optional since it might not be in response
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

      // Only set token if it exists in the response
      if (response.token) {
        tokenService.setToken(response.token);
      } else {
        console.warn(
          "No token received from server. Login might still be successful."
        );
        // If your backend doesn't return a token but login is successful,
        // you might want to generate a session token or handle it differently
        // For now, we'll create a simple session indicator
        tokenService.setToken(`session_${Date.now()}_${response.user.id}`);
      }

      return response;
    } catch (error: any) {
      console.error("Google login error:", error);
      // Log the full error response for debugging
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      throw error;
    }
  }

  logout(): void {
    tokenService.removeToken();
    // Clear any other stored user data
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
}

export const authService = AuthService.getInstance();
