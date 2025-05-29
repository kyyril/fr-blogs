import { User } from "@/lib/types/data.interface";
import { httpService } from "./http.services";

interface FollowStatusResponse {
  is_following: boolean;
}

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getProfile(userId: string): Promise<User> {
    return httpService.get<User>(`/api/users/${userId}`);
  }

  async getCurrentUserProfile(): Promise<User> {
    return httpService.get<User>(`/api/users/me`);
  }

  async followUser(userId: string): Promise<void> {
    return httpService.post(`/api/users/${userId}/follow`);
  }

  async unfollowUser(userId: string): Promise<void> {
    return httpService.delete(`/api/users/${userId}/unfollow`);
  }

  async followStatus(userId: string): Promise<FollowStatusResponse> {
    return httpService.get<FollowStatusResponse>(
      `/api/users/${userId}/follow-status`
    );
  }

  // async updateProfile(data: Partial<User>): Promise<User> {
  //   return httpService.put<User>(`/api/users/me`, data);
  // }

  // async uploadAvatar(file: File): Promise<{ avatar: string }> {
  //   const formData = new FormData();
  //   formData.append("avatar", file);
  //   return httpService.post<{ avatar: string }>(
  //     `/api/users/me/avatar`,
  //     formData
  //   );
  // }
}

export const userService = UserService.getInstance();
