"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Reply,
  MoreVertical,
  Send,
  Edit,
  Trash,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useComment } from "@/hooks/useComment";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export interface PaginatedCommentsResponse {
  comments: Comment[];
  pagination: {
    total: number;
    pages: number;
    current: number;
  };
}

interface BlogCommentsProps {
  blogId: string;
}

export function BlogComments({ blogId }: BlogCommentsProps) {
  const { user: session } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [page, setPage] = useState(1);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);

  const { getComments, createComment, updateComment, deleteComment } =
    useComment(blogId);

  // Destructure comments and pagination from the response
  const { data, isLoading } = getComments(page);
  const comments = data?.comments || [];
  const pagination = data?.pagination;
  const router = useRouter();

  const handlePostComment = async () => {
    if (!newComment.trim() || !session) return;

    try {
      await createComment.mutateAsync({
        content: newComment,
      });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim() || !session) return;

    try {
      await createComment.mutateAsync({
        content: replyContent,
        parentId: commentId,
      });
      setReplyingTo(null);
      setReplyContent("");
      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateComment.mutateAsync({
        commentId,
        content: editContent,
      });
      setEditingComment(null);
      setEditContent("");
      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment.mutateAsync(commentId);
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const handleLoadMoreComments = async () => {
    if (!pagination || page >= pagination.pages) return;
    setLoadingMoreComments(true);
    try {
      setPage(page + 1);
    } finally {
      setLoadingMoreComments(false);
    }
  };

  const handleLoadMoreReplies = async (commentId: string) => {
    setLoadingReplies((prev) => new Set(prev).add(commentId));
    try {
      // Simulate loading more replies
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setExpandedReplies((prev) => new Set(prev).add(commentId));
    } finally {
      setLoadingReplies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleProfileClick = (comment: any, event: React.MouseEvent) => {
    event.stopPropagation();
    const profilePath = comment.author?.username || comment.authorId;
    router.push(`/profile/${profilePath}`);
  };

  return (
    <div id="comments" className="space-y-6">
      {/* Comment Form */}
      <div className="mb-8 space-y-4 rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <Avatar className="mt-1 h-8 w-8">
            <AvatarImage
              src={session?.avatar || ""}
              alt={session?.name || ""}
            />
            <AvatarFallback>{session?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handlePostComment}
            disabled={createComment.isPending || !newComment.trim()}
          >
            {createComment.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex gap-3">
                {/* Profile-clickable Author Info */}
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => handleProfileClick(comment, e)}
                >
                  <Avatar className="mt-1 h-8 w-8">
                    <AvatarImage
                      src={comment?.author?.avatar}
                      alt={comment?.author?.name}
                    />
                    <AvatarFallback>{comment?.author?.name[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => handleProfileClick(comment, e)}
                    >
                      <p className="text-sm font-medium">
                        {comment?.author?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {session?.id === comment.authorId && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingComment(comment.id);
                                setEditContent(comment.content);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(comment.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>Report</DropdownMenuItem>
                        <DropdownMenuItem>Copy text</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingComment(null);
                            setEditContent("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(comment.id)}
                          disabled={updateComment.isPending}
                        >
                          {updateComment.isPending ? (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          ) : null}
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-muted-foreground"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <Reply className="mr-1 h-3 w-3" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="mt-1 h-6 w-6">
                          <AvatarImage
                            src={session?.avatar || ""}
                            alt={session?.name || ""}
                          />
                          <AvatarFallback>{session?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder={`Reply to ${comment?.author?.name}...`}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px] resize-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReply(comment.id)}
                          disabled={createComment.isPending}
                        >
                          {createComment.isPending ? (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          ) : null}
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4">
                      <Separator className="my-2" />
                      {comment.replies
                        ?.slice(
                          0,
                          expandedReplies.has(comment.id) ? undefined : 3
                        )
                        .map((reply) => (
                          <div
                            key={reply.id}
                            className="flex gap-3 hover:bg-muted/50 rounded-lg p-2 transition-colors"
                          >
                            {/* Profile-clickable Reply Author */}
                            <div
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={(e) => handleProfileClick(reply, e)}
                            >
                              <Avatar className="mt-1 h-6 w-6">
                                <AvatarImage
                                  src={reply.author?.avatar}
                                  alt={reply.author?.name}
                                />
                                <AvatarFallback>
                                  {reply.author?.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={(e) => handleProfileClick(reply, e)}
                                >
                                  <p className="text-sm font-medium">
                                    {reply.author?.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                      new Date(reply.createdAt),
                                      { addSuffix: true }
                                    )}
                                  </p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Report</DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Copy text
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}

                      {/* Load More Replies Button */}
                      {comment.replies.length > 3 &&
                        !expandedReplies.has(comment.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground ml-9"
                            onClick={() => handleLoadMoreReplies(comment.id)}
                            disabled={loadingReplies.has(comment.id)}
                          >
                            {loadingReplies.has(comment.id) ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              `Show ${comment.replies.length - 3} more replies`
                            )}
                          </Button>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Load More Comments Button */}
        {pagination && pagination.current < pagination.pages && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={handleLoadMoreComments}
              disabled={loadingMoreComments}
            >
              {loadingMoreComments ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading more comments...
                </>
              ) : (
                `Load more comments (${
                  pagination.total - pagination.current * 10
                } remaining)`
              )}
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center text-sm text-muted-foreground">
            Showing {Math.min(pagination.current * 10, pagination.total)} of{" "}
            {pagination.total} comments
          </div>
        )}
      </div>
    </div>
  );
}
