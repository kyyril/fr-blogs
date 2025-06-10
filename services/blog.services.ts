import { BlogPost } from "@/lib/types/data.interface";
import { httpService } from "./http.services";

export interface BlogsResponse {
  blogs: BlogPost[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateBlogDto {
  title: string;
  description: string;
  content: string;
  categories: string[];
  tags: string[];
  readingTime: number;
  featured: boolean;
  image: File;
}

export interface BlogInteractionResponse {
  liked: boolean;
  bookmarked: boolean;
  likeCount: number;
  bookmarkCount?: number;
}

export interface ToggleLikeResponse {
  message: string;
  liked: boolean;
  likeCount: number;
}

export interface ToggleBookmarkResponse {
  message: string;
  bookmarked: boolean;
  bookmarkCount: number;
}

export class BlogService {
  private static instance: BlogService;

  private constructor() {}

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  async createBlog(data: CreateBlogDto): Promise<BlogPost> {
    const formData = new FormData();
    // Append fields individually with proper handling
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "categories" || key === "tags") {
          // Ensure arrays are properly stringified
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (key === "image" && value instanceof File) {
          // Handle file upload
          formData.append(key, value);
        } else {
          // Handle other fields
          formData.append(key, String(value));
        }
      }
    });
    // Don't override Content-Type header - let browser set it automatically with boundary
    return httpService.post<BlogPost>("/api/blogs", formData);
  }

  async updateBlog(
    id: string,
    data: Partial<CreateBlogDto>
  ): Promise<BlogPost> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "categories" || key === "tags") {
          // Ensure arrays are properly stringified
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (key === "image" && value instanceof File) {
          // Handle file upload
          formData.append(key, value);
        } else {
          // Handle other fields
          formData.append(key, String(value));
        }
      }
    });
    // Don't override Content-Type header - let browser set it automatically with boundary
    return httpService.put<BlogPost>(`/api/blogs/blog/${id}`, formData);
  }

  async deleteBlog(id: string): Promise<void> {
    return httpService.delete(`/api/blogs/blog/${id}`);
  }

  async getBlogs(page = 1, limit = 10): Promise<BlogsResponse> {
    return httpService.get<BlogsResponse>(
      `/api/blogs?page=${page}&limit=${limit}`
    );
  }

  async getBlogById(id: string): Promise<BlogPost> {
    return httpService.get<BlogPost>(`/api/blogs/blog/${id}`);
  }

  async searchBlogs(
    query: string,
    page = 1,
    limit = 10
  ): Promise<BlogsResponse> {
    return httpService.get<BlogsResponse>(
      `/api/blogs/search?query=${query}&page=${page}&limit=${limit}`
    );
  }

  async getBlogsByCategory(
    category: string,
    page = 1,
    limit = 10
  ): Promise<BlogsResponse> {
    return httpService.get<BlogsResponse>(
      `/api/blogs/category/${category}?page=${page}&limit=${limit}`
    );
  }

  async recordView(id: string): Promise<void> {
    return httpService.post(`/api/blogs/blog/${id}/view`);
  }

  // New methods for like/bookmark functionality
  async getBlogInteraction(id: string): Promise<BlogInteractionResponse> {
    return httpService.get<BlogInteractionResponse>(
      `/api/blogs/blog/${id}/interaction`
    );
  }

  async toggleLike(id: string): Promise<ToggleLikeResponse> {
    return httpService.post<ToggleLikeResponse>(`/api/blogs/blog/${id}/like`);
  }

  async toggleBookmark(id: string): Promise<ToggleBookmarkResponse> {
    return httpService.post<ToggleBookmarkResponse>(
      `/api/blogs/blog/${id}/bookmark`
    );
  }
}

export const blogService = BlogService.getInstance();
