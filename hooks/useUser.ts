import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.services";
import { User } from "@/lib/types/data.interface";

interface FollowStatusResponse {
  is_following: boolean;
}

export const useUser = () => {
  const queryClient = useQueryClient();

  const getProfile = (userId: string) => {
    return useQuery<User>({
      queryKey: ["user", userId],
      queryFn: () => userService.getProfile(userId),
      enabled: !!userId, // Only run query if userId is provided
    });
  };

  const followUser = useMutation({
    mutationFn: (userId: string) => userService.followUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate user profile to update follower count
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      // Invalidate current user's profile if needed
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });

  const unfollowUser = useMutation({
    mutationFn: (userId: string) => userService.unfollowUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate user profile to update follower count
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      // Invalidate current user's profile if needed
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error unfollowing user:", error);
    },
  });

  const followStatus = useMutation({
    mutationFn: (userId: string): Promise<FollowStatusResponse> =>
      userService.followStatus(userId),
    onError: (error) => {
      console.error("Error checking follow status:", error);
    },
  });

  // Query to get current user's own profile
  const getCurrentUserProfile = () => {
    return useQuery<User>({
      queryKey: ["current-user"],
      queryFn: () => userService.getCurrentUserProfile(), // You might need to add this method
    });
  };

  return {
    getProfile,
    followUser,
    unfollowUser,
    followStatus,
    getCurrentUserProfile,
  };
};
