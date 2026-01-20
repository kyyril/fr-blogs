import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { tokenService } from "./token.services";
import { config } from "@/constants/config";

class HttpService {
  private static instance: HttpService;
  private api: AxiosInstance;
  // ⚡ PERFORMANCE: Request deduplication cache
  private pendingRequests: Map<string, Promise<any>> = new Map();

  private constructor() {
    this.api = axios.create({
      baseURL: config.apiBaseUrl || "http://localhost:5000",
      withCredentials: true,
      // ⚡ PERFORMANCE: Set reasonable timeout
      timeout: 10000,
    });

    // Request interceptor to ensure credentials are sent
    this.api.interceptors.request.use(
      (config) => {
        config.withCredentials = true;
        // Add Authorization header if token exists
        const token = tokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle authentication errors and token extraction
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Check if response contains tokens and set them
        if (response.data && typeof response.data === "object") {
          const { accessToken, refreshToken } = response.data;
          if (accessToken) {
            console.log("Setting tokens from HTTP response");
            tokenService.setTokens(accessToken, refreshToken);
          }
        }

        // Also check for tokens in Set-Cookie headers (for backend-set cookies)
        const setCookieHeader = response.headers["set-cookie"];
        if (setCookieHeader) {
          console.log("Backend set cookies detected:", setCookieHeader);
          // Extract tokens from Set-Cookie headers if needed
          setCookieHeader.forEach((cookie: string) => {
            if (cookie.includes("access_token=")) {
              const tokenMatch = cookie.match(/access_token=([^;]+)/);
              if (tokenMatch) {
                console.log("Found access_token in Set-Cookie header");
              }
            }
            if (cookie.includes("refresh_token=")) {
              const tokenMatch = cookie.match(/refresh_token=([^;]+)/);
              if (tokenMatch) {
                console.log("Found refresh_token in Set-Cookie header");
              }
            }
          });
        }

        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear auth state and redirect
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            tokenService.removeTokens();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }

  // ⚡ PERFORMANCE: GET with request deduplication
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const cacheKey = `GET:${url}:${JSON.stringify(config?.params || {})}`;

    // Return existing pending request if available
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Create new request and cache it
    const request = this.api.get<T>(url, config)
      .then(response => {
        this.pendingRequests.delete(cacheKey);
        return response.data;
      })
      .catch(error => {
        this.pendingRequests.delete(cacheKey);
        throw error;
      });

    this.pendingRequests.set(cacheKey, request);
    return request;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }
}

export const httpService = HttpService.getInstance();
