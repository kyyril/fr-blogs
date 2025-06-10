import { User, UpdateProfileData } from "@/lib/types/data.interface";
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

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const formData = new FormData();

    // Add text fields
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    formData.append("country", data.country);
    formData.append("twitterAcc", data.twitterAcc);
    formData.append("githubAcc", data.githubAcc);
    formData.append("linkedinAcc", data.linkedinAcc);
    formData.append("anotherAcc", data.anotherAcc);
    // Add avatar if present
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    return httpService.put<User>("/api/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const userService = UserService.getInstance();
