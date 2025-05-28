import { httpService } from "./http.services";
import { tokenService } from "./token.services";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
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

  async googleLogin(credential: string): Promise<LoginResponse> {
    const response = await httpService.post<LoginResponse>("/api/auth/google", {
      credential,
    });

    tokenService.setToken(response.token);

    return response;
  }

  logout(): void {
    tokenService.removeToken();
    window.location.href = "/auth/login";
  }
}

export const authService = AuthService.getInstance();
