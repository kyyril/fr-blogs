import { Blog } from "@/lib/types/data.interface";
import { httpService } from "./http.services";

export interface BlogsResponse {
  blogs: Blog[];
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

export class BlogService {
  private static instance: BlogService;

  private constructor() {}

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  async createBlog(data: CreateBlogDto): Promise<Blog> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "categories" || key === "tags") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    return httpService.post<Blog>("/api/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async updateBlog(id: string, data: Partial<CreateBlogDto>): Promise<Blog> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "categories" || key === "tags") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    return httpService.put<Blog>(`/api/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async deleteBlog(id: string): Promise<void> {
    return httpService.delete(`/api/blogs/${id}`);
  }

  async getBlogs(page = 1, limit = 10): Promise<BlogsResponse> {
    return httpService.get<BlogsResponse>(
      `/api/blogs?page=${page}&limit=${limit}`
    );
  }

  async getBlogBySlug(slug: string): Promise<Blog> {
    return httpService.get<Blog>(`/api/blogs/${slug}`);
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
    return httpService.post(`/api/blogs/${id}/view`);
  }
}

export const blogService = BlogService.getInstance();
