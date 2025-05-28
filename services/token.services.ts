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
    const encodedToken = Buffer.from(token).toString("base64");
    Cookies.set(this.TOKEN_KEY, encodedToken);
  }

  getToken(): string | null {
    const encodedToken = Cookies.get(this.TOKEN_KEY);
    if (!encodedToken) return null;
    return Buffer.from(encodedToken, "base64").toString("ascii");
  }

  removeToken(): void {
    Cookies.remove(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const tokenService = TokenService.getInstance();
