import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, User } from '@/services/user.services';

export const useUser = () => {
  const queryClient = useQueryClient();

  const getProfile = (userId: string) => {
    return useQuery<User>({
      queryKey: ['user', userId],
      queryFn: () => userService.getProfile(userId),
    });
  };

  const followUser = useMutation({
    mutationFn: (userId: string) => userService.followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  const unfollowUser = useMutation({
    mutationFn: (userId: string) => userService.unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  return {
    getProfile,
    followUser,
    unfollowUser,
  };
};