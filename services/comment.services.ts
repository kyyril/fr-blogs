import { Comment } from "@/lib/types/data.interface";
import { httpService } from "./http.services";

export interface CommentsResponse {
  comments: Comment[];
  pagination: {
    total: number;
    pages: number;
    current: number;
  };
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

  async createComment(
    blogId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    return httpService.post<Comment>(`/api/blogs/${blogId}/comments`, {
      content,
      parentId,
    });
  }

  async getComments(
    blogId: string,
    page = 1,
    limit = 10
  ): Promise<CommentsResponse> {
    return httpService.get<CommentsResponse>(
      `/api/blogs/${blogId}/comments?page=${page}&limit=${limit}`
    );
  }

  async updateComment(commentId: string, content: string): Promise<Comment> {
    return httpService.patch<Comment>(`/api/comments/${commentId}`, {
      content,
    });
  }

  async deleteComment(commentId: string): Promise<void> {
    return httpService.delete(`/api/comments/${commentId}`);
  }
}

export const commentService = CommentService.getInstance();
