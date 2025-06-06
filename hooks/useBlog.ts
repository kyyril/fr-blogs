import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  blogService,
  CreateBlogDto,
  BlogsResponse,
} from "@/services/blog.services";
import { Blog } from "@/lib/types/data.interface";

export const useBlog = () => {
  const queryClient = useQueryClient();

  const getBlogs = (page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: ["blogs", page, limit],
      queryFn: () => blogService.getBlogs(page, limit),
    });
  };

  // const getBlogBySlug = (slug: string, options?: { enabled?: boolean }) => {
  //   return useQuery<Blog>({
  //     queryKey: ["blog", "slug", slug],
  //     queryFn: () => blogService.getBlogBySlug(slug),
  //     enabled: options?.enabled !== false && !!slug,
  //   });
  // };

  const getBlogById = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<Blog>({
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

  return {
    getBlogs,
    // getBlogBySlug,
    searchBlogs,
    getBlogById,
    getBlogsByCategory,
    createBlog,
    updateBlog,
    deleteBlog,
    recordView,
  };
};
