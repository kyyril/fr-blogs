import Cookies from "js-cookie";
import {
  getAccessTokenCookieConfig,
  getRefreshTokenCookieConfig,
  debugCookies,
} from "@/lib/cookie-utils";

export class TokenService {
  private static instance: TokenService;
  private readonly ACCESS_TOKEN_KEY = "access_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    // Set access token
    this.setAccessToken(accessToken);

    // Set refresh token if provided
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }

  setAccessToken(token: string): void {
    // Add validation to prevent undefined tokens
    if (!token || typeof token !== "string") {
      console.error("Invalid access token provided:", token);
      return;
    }

    try {
      // Decode the JWT to get the expiration time
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expires = new Date(payload.exp * 1000); // Convert seconds to milliseconds

      // Get optimal cookie configuration
      const cookieConfig = getAccessTokenCookieConfig();

      // Store token directly without encoding to match middleware expectations
      Cookies.set(this.ACCESS_TOKEN_KEY, token, {
        ...cookieConfig,
        expires: expires, // Override with JWT expiration
      });

      console.log("Access token set successfully");
      debugCookies(
        { [this.ACCESS_TOKEN_KEY]: token },
        "TokenService.setAccessToken"
      );
    } catch (error) {
      console.error("Error setting access token:", error);
    }
  }

  setRefreshToken(token: string): void {
    // Add validation to prevent undefined tokens
    if (!token || typeof token !== "string") {
      console.error("Invalid refresh token provided:", token);
      return;
    }

    try {
      // Get optimal cookie configuration
      const cookieConfig = getRefreshTokenCookieConfig();

      // Store refresh token with longer expiration (7 days)
      Cookies.set(this.REFRESH_TOKEN_KEY, token, cookieConfig);

      console.log("Refresh token set successfully");
      debugCookies(
        { [this.REFRESH_TOKEN_KEY]: token },
        "TokenService.setRefreshToken"
      );
    } catch (error) {
      console.error("Error setting refresh token:", error);
    }
  }

  // Legacy method for backward compatibility
  setToken(token: string): void {
    this.setAccessToken(token);
  }

  getAccessToken(): string | null {
    try {
      const token = Cookies.get(this.ACCESS_TOKEN_KEY);
      if (!token) return null;

      // Return token directly since we're no longer encoding it
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      this.removeAccessToken(); // Remove corrupted token
      return null;
    }
  }

  getRefreshToken(): string | null {
    try {
      const token = Cookies.get(this.REFRESH_TOKEN_KEY);
      if (!token) return null;

      return token;
    } catch (error) {
      console.error("Error getting refresh token:", error);
      this.removeRefreshToken(); // Remove corrupted token
      return null;
    }
  }

  // Legacy method for backward compatibility
  getToken(): string | null {
    return this.getAccessToken();
  }

  removeAccessToken(): void {
    Cookies.remove(this.ACCESS_TOKEN_KEY, { path: "/" });
  }

  removeRefreshToken(): void {
    Cookies.remove(this.REFRESH_TOKEN_KEY, { path: "/" });
  }

  removeTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  // Legacy method for backward compatibility
  removeToken(): void {
    this.removeTokens();
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && token.length > 0;
  }
}

export const tokenService = TokenService.getInstance();
