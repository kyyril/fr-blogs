import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  blogService,
  CreateBlogDto,
  BlogsResponse,
  BlogInteractionResponse,
} from "@/services/blog.services";
import { BlogPost } from "@/lib/types/data.interface";

export const useBlog = () => {
  const queryClient = useQueryClient();

  const getBlogs = (page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: ["blogs", page, limit],
      queryFn: () => blogService.getBlogs(page, limit),
    });
  };

  const getBlogById = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<BlogPost>({
      queryKey: ["blog", id],
      queryFn: () => blogService.getBlogById(id),
      enabled: options?.enabled !== false && !!id,
    });
  };

  const searchBlogs = (query: string, page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: ["blogs", "search", query, page, limit],
      queryFn: () => blogService.searchBlogs(query, page, limit),
      enabled: !!query,
    });
  };

  const getBlogsByCategory = (category: string, page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: ["blogs", "category", category, page, limit],
      queryFn: () => blogService.getBlogsByCategory(category, page, limit),
    });
  };

  // New method to get blog interaction status
  const getBlogInteraction = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<BlogInteractionResponse>({
      queryKey: ["blog", "interaction", id],
      queryFn: () => blogService.getBlogInteraction(id),
      enabled: options?.enabled !== false && !!id,
    });
  };

  const createBlog = useMutation({
    mutationFn: (data: CreateBlogDto) => blogService.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBlogDto> }) =>
      blogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const deleteBlog = useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const recordView = useMutation({
    mutationFn: (id: string) => blogService.recordView(id),
  });

  // New mutations for like/bookmark functionality
  const toggleLike = useMutation({
    mutationFn: (id: string) => blogService.toggleLike(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["blog", "interaction", id],
      });

      // Snapshot the previous value
      const previousInteraction =
        queryClient.getQueryData<BlogInteractionResponse>([
          "blog",
          "interaction",
          id,
        ]);

      // Optimistically update to the new value
      if (previousInteraction) {
        queryClient.setQueryData<BlogInteractionResponse>(
          ["blog", "interaction", id],
          {
            ...previousInteraction,
            liked: !previousInteraction.liked,
            likeCount: previousInteraction.liked
              ? previousInteraction.likeCount - 1
              : previousInteraction.likeCount + 1,
          }
        );
      }

      // Return a context object with the snapshotted value
      return { previousInteraction };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousInteraction) {
        queryClient.setQueryData(
          ["blog", "interaction", id],
          context.previousInteraction
        );
      }
    },
    onSettled: (data, error, id) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["blog", "interaction", id] });
    },
  });

  const toggleBookmark = useMutation({
    mutationFn: (id: string) => blogService.toggleBookmark(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["blog", "interaction", id],
      });

      // Snapshot the previous value
      const previousInteraction =
        queryClient.getQueryData<BlogInteractionResponse>([
          "blog",
          "interaction",
          id,
        ]);

      // Optimistically update to the new value
      if (previousInteraction) {
        queryClient.setQueryData<BlogInteractionResponse>(
          ["blog", "interaction", id],
          {
            ...previousInteraction,
            bookmarked: !previousInteraction.bookmarked,
            bookmarkCount: previousInteraction.bookmarkCount
              ? previousInteraction.bookmarked
                ? previousInteraction.bookmarkCount - 1
                : previousInteraction.bookmarkCount + 1
              : previousInteraction.bookmarked
              ? 0
              : 1,
          }
        );
      }

      // Return a context object with the snapshotted value
      return { previousInteraction };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousInteraction) {
        queryClient.setQueryData(
          ["blog", "interaction", id],
          context.previousInteraction
        );
      }
    },
    onSettled: (data, error, id) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["blog", "interaction", id] });
    },
  });

  return {
    getBlogs,
    searchBlogs,
    getBlogById,
    getBlogsByCategory,
    getBlogInteraction, // New method
    createBlog,
    updateBlog,
    deleteBlog,
    recordView,
    toggleLike, // New mutation
    toggleBookmark, // New mutation
  };
};
