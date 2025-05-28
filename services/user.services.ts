import { httpService } from './http.services';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
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

  async followUser(userId: string): Promise<void> {
    return httpService.post(`/api/users/${userId}/follow`);
  }

  async unfollowUser(userId: string): Promise<void> {
    return httpService.delete(`/api/users/${userId}/follow`);
  }
}

export const userService = UserService.getInstance();