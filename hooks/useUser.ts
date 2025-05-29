import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.services";
import { User } from "@/lib/types/data.interface";

export const useUser = () => {
  const queryClient = useQueryClient();

  const getProfile = (userId: string) => {
    return useQuery<User>({
      queryKey: ["user", userId],
      queryFn: () => userService.getProfile(userId),
    });
  };

  const followUser = useMutation({
    mutationFn: (userId: string) => userService.followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  const unfollowUser = useMutation({
    mutationFn: (userId: string) => userService.unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  const followStatus = useMutation({
    mutationFn: (userId: string) => userService.followStatus(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  return {
    getProfile,
    followUser,
    unfollowUser,
    followStatus,
  };
};
