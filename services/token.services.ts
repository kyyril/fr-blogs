import Cookies from "js-cookie";

export class TokenService {
  private static instance: TokenService;
  private readonly TOKEN_KEY = "auth_token";

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  setToken(token: string): void {
    // Add validation to prevent undefined tokens
    if (!token || typeof token !== "string") {
      console.error("Invalid token provided to setToken:", token);
      return;
    }

    try {
      // Use btoa for browser compatibility instead of Buffer
      const encodedToken = btoa(token);
      Cookies.set(this.TOKEN_KEY, encodedToken, {
        expires: 7, // Token expires in 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } catch (error) {
      console.error("Error encoding token:", error);
    }
  }

  getToken(): string | null {
    try {
      const encodedToken = Cookies.get(this.TOKEN_KEY);
      if (!encodedToken) return null;

      // Use atob for browser compatibility instead of Buffer
      return atob(encodedToken);
    } catch (error) {
      console.error("Error decoding token:", error);
      this.removeToken(); // Remove corrupted token
      return null;
    }
  }

  removeToken(): void {
    Cookies.remove(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && token.length > 0;
  }
}

export const tokenService = TokenService.getInstance();
