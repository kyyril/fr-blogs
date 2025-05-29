import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService, CommentsResponse } from "@/services/comment.services";

export const useComment = (blogId: string) => {
  const queryClient = useQueryClient();

  const getComments = (page = 1, limit = 10) => {
    return useQuery<CommentsResponse>({
      queryKey: ["comments", blogId, page, limit],
      queryFn: () => commentService.getComments(blogId, page, limit),
    });
  };

  const createComment = useMutation({
    mutationFn: (content: string) =>
      commentService.createComment(blogId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
  });

  return {
    getComments,
    createComment,
  };
};
