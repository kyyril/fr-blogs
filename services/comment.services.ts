import { httpService } from './http.services';

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
}

export class CommentService {
  private static instance: CommentService;

  private constructor() {}

  public static getInstance(): CommentService {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }
    return CommentService.instance;
  }

  async createComment(blogId: string, content: string): Promise<Comment> {
    return httpService.post<Comment>(`/api/blogs/${blogId}/comments`, { content });
  }

  async getComments(blogId: string, page = 1, limit = 10): Promise<CommentsResponse> {
    return httpService.get<CommentsResponse>(
      `/api/blogs/${blogId}/comments?page=${page}&limit=${limit}`
    );
  }
}

export const commentService = CommentService.getInstance();