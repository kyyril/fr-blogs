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
    mutationFn: ({
      content,
      parentId,
    }: {
      content: string;
      parentId?: string;
    }) => commentService.createComment(blogId, content, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
  });

  const updateComment = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentService.updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
  });

  return {
    getComments,
    createComment,
    updateComment,
    deleteComment,
  };
};
