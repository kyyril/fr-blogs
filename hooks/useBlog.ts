import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  blogService,
  CreateBlogDto,
  BlogsResponse,
  BlogInteractionResponse,
  BookmarksResponse,
} from "@/services/blog.services";
import { BlogPost } from "@/lib/types/data.interface";

// ⚡ PERFORMANCE: Query key factory for consistent caching
export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (page: number, limit: number) => [...blogKeys.lists(), page, limit] as const,
  featured: (limit: number) => [...blogKeys.all, "featured", limit] as const,
  category: (category: string, page: number, limit: number) =>
    [...blogKeys.all, "category", category, page, limit] as const,
  tags: (tags: string, page: number, limit: number) =>
    [...blogKeys.all, "tags", tags, page, limit] as const,
  search: (query: string, page: number, limit: number) =>
    [...blogKeys.all, "search", query, page, limit] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
  interaction: (id: string) => ["blog", "interaction", id] as const,
  bookmarks: (page: number, limit: number) => ["bookmarks", page, limit] as const,
};

export const useBlog = () => {
  const queryClient = useQueryClient();

  // ⚡ PERFORMANCE: Prefetch next page
  const prefetchNextPage = async (currentPage: number, limit: number) => {
    await queryClient.prefetchQuery({
      queryKey: blogKeys.list(currentPage + 1, limit),
      queryFn: () => blogService.getBlogs(currentPage + 1, limit),
      staleTime: 1000 * 60 * 10,
    });
  };

  // ⚡ PERFORMANCE: Prefetch blog detail on hover
  const prefetchBlogDetail = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: blogKeys.detail(id),
      queryFn: () => blogService.getBlogById(id),
      staleTime: 1000 * 60 * 10,
    });
  };

  const getBlogs = (page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: blogKeys.list(page, limit),
      queryFn: () => blogService.getBlogs(page, limit),
      // ⚡ PERFORMANCE: Keep previous data while fetching new page
      placeholderData: (previousData) => previousData,
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  };

  const getBlogById = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<BlogPost>({
      queryKey: blogKeys.detail(id),
      queryFn: () => blogService.getBlogById(id),
      enabled: options?.enabled !== false && !!id,
      staleTime: 1000 * 60 * 15, // 15 minutes for detail pages
    });
  };

  const searchBlogs = (query: string, page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: blogKeys.search(query, page, limit),
      queryFn: () => blogService.searchBlogs(query, page, limit),
      enabled: !!query && query.length >= 2,
      staleTime: 1000 * 60 * 5, // 5 minutes for search results
      // ⚡ PERFORMANCE: Keep previous data while typing
      placeholderData: (previousData) => previousData,
    });
  };

  const getBlogsByCategory = (category: string, page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: blogKeys.category(category, page, limit),
      queryFn: () => blogService.getBlogsByCategory(category, page, limit),
      enabled: !!category,
      staleTime: 1000 * 60 * 10,
      placeholderData: (previousData) => previousData,
    });
  };

  const getBlogInteraction = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<BlogInteractionResponse>({
      queryKey: blogKeys.interaction(id),
      queryFn: () => blogService.getBlogInteraction(id),
      enabled: options?.enabled !== false && !!id,
      staleTime: 1000 * 60 * 2, // 2 minutes for interactions (more dynamic)
    });
  };

  const createBlog = useMutation({
    mutationFn: (data: CreateBlogDto) => blogService.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBlogDto> }) =>
      blogService.updateBlog(id, data),
    onSuccess: (_, { id }) => {
      // ⚡ PERFORMANCE: Only invalidate the specific blog
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });

  const deleteBlog = useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });

  const recordView = useMutation({
    mutationFn: (id: string) => blogService.recordView(id),
    // ⚡ PERFORMANCE: Fire and forget, no need to wait or invalidate
  });

  // ⚡ PERFORMANCE: Optimistic updates for instant UI feedback
  const toggleLike = useMutation({
    mutationFn: (id: string) => blogService.toggleLike(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.interaction(id) });

      const previousInteraction = queryClient.getQueryData<BlogInteractionResponse>(
        blogKeys.interaction(id)
      );

      // ⚡ Instant UI update
      if (previousInteraction) {
        queryClient.setQueryData<BlogInteractionResponse>(
          blogKeys.interaction(id),
          {
            ...previousInteraction,
            liked: !previousInteraction.liked,
            likeCount: previousInteraction.liked
              ? previousInteraction.likeCount - 1
              : previousInteraction.likeCount + 1,
          }
        );
      }

      return { previousInteraction };
    },
    onError: (_, id, context) => {
      if (context?.previousInteraction) {
        queryClient.setQueryData(
          blogKeys.interaction(id),
          context.previousInteraction
        );
      }
    },
    onSettled: (_, __, id) => {
      // ⚡ Background sync - don't block UI
      queryClient.invalidateQueries({ queryKey: blogKeys.interaction(id) });
    },
  });

  const toggleBookmark = useMutation({
    mutationFn: (id: string) => blogService.toggleBookmark(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.interaction(id) });

      const previousInteraction = queryClient.getQueryData<BlogInteractionResponse>(
        blogKeys.interaction(id)
      );

      // ⚡ Instant UI update
      if (previousInteraction) {
        queryClient.setQueryData<BlogInteractionResponse>(
          blogKeys.interaction(id),
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

      return { previousInteraction };
    },
    onError: (_, id, context) => {
      if (context?.previousInteraction) {
        queryClient.setQueryData(
          blogKeys.interaction(id),
          context.previousInteraction
        );
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.interaction(id) });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const getUserBookmarks = (page = 1, limit = 10) => {
    return useQuery<BookmarksResponse>({
      queryKey: blogKeys.bookmarks(page, limit),
      queryFn: () => blogService.getUserBookmarks(page, limit),
      staleTime: 1000 * 60 * 5,
    });
  };

  const getBlogFeatured = (limit = 5) => {
    return useQuery<BlogsResponse>({
      queryKey: blogKeys.featured(limit),
      queryFn: () => blogService.getBlogFeatured(limit),
      staleTime: 1000 * 60 * 15, // 15 minutes - featured rarely changes
    });
  };

  const getBlogsByTags = (tags: string, page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: blogKeys.tags(tags, page, limit),
      queryFn: () => blogService.getBlogsByTags(tags, page, limit),
      enabled: !!tags,
      staleTime: 1000 * 60 * 10,
      placeholderData: (previousData) => previousData,
    });
  };

  return {
    // Queries
    getUserBookmarks,
    getBlogFeatured,
    getBlogs,
    searchBlogs,
    getBlogById,
    getBlogsByCategory,
    getBlogsByTags,
    getBlogInteraction,
    // Mutations
    createBlog,
    updateBlog,
    deleteBlog,
    recordView,
    toggleLike,
    toggleBookmark,
    // ⚡ PERFORMANCE: Expose prefetch functions
    prefetchBlogDetail,
    prefetchNextPage,
  };
};
