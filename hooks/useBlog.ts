import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService, Blog, CreateBlogDto, BlogsResponse } from '@/services/blog.services';

export const useBlog = () => {
  const queryClient = useQueryClient();

  const getBlogs = (page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: ['blogs', page, limit],
      queryFn: () => blogService.getBlogs(page, limit),
    });
  };

  const getBlogBySlug = (slug: string) => {
    return useQuery<Blog>({
      queryKey: ['blog', slug],
      queryFn: () => blogService.getBlogBySlug(slug),
    });
  };

  const searchBlogs = (query: string, page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: ['blogs', 'search', query, page, limit],
      queryFn: () => blogService.searchBlogs(query, page, limit),
      enabled: !!query,
    });
  };

  const getBlogsByCategory = (category: string, page = 1, limit = 10) => {
    return useQuery<BlogsResponse>({
      queryKey: ['blogs', 'category', category, page, limit],
      queryFn: () => blogService.getBlogsByCategory(category, page, limit),
    });
  };

  const createBlog = useMutation({
    mutationFn: (data: CreateBlogDto) => blogService.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBlogDto> }) =>
      blogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const deleteBlog = useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const recordView = useMutation({
    mutationFn: (id: string) => blogService.recordView(id),
  });

  return {
    getBlogs,
    getBlogBySlug,
    searchBlogs,
    getBlogsByCategory,
    createBlog,
    updateBlog,
    deleteBlog,
    recordView,
  };
};