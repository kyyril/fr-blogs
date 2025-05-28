'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Heart, Reply, MoreVertical, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { mockComments, mockUser } from '@/lib/mock-data';

interface BlogCommentsProps {
  blogId: string;
}

export function BlogComments({ blogId }: BlogCommentsProps) {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      createdAt: new Date(),
      author: {
        id: mockUser.id,
        name: mockUser.name,
        image: mockUser.image,
      },
      likes: 0,
      replies: [],
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    const reply = {
      id: `reply-${Date.now()}`,
      content: replyContent,
      createdAt: new Date(),
      author: {
        id: mockUser.id,
        name: mockUser.name,
        image: mockUser.image,
      },
      likes: 0,
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likes + 1,
        };
      }
      return comment;
    });

    setComments(updatedComments);
  };

  return (
    <div id="comments" className="space-y-6">
      {/* Comment Form */}
      <div className="mb-8 space-y-4 rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <Avatar className="mt-1 h-8 w-8">
            <AvatarImage src={mockUser.image} alt={mockUser.name} />
            <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
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
          <Button onClick={handlePostComment}>
            <Send className="mr-2 h-4 w-4" />
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="mt-1 h-8 w-8">
                  <AvatarImage src={comment.author.image} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Report</DropdownMenuItem>
                        <DropdownMenuItem>Copy text</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Heart className="mr-1 h-3 w-3" />
                      {comment.likes > 0 && <span>{comment.likes}</span>}
                    </Button>
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

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="mt-1 h-6 w-6">
                          <AvatarImage src={mockUser.image} alt={mockUser.name} />
                          <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder={`Reply to ${comment.author.name}...`}
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
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4">
                      <Separator className="my-2" />
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Avatar className="mt-1 h-6 w-6">
                            <AvatarImage src={reply.author.image} alt={reply.author.name} />
                            <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{reply.author.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Report</DropdownMenuItem>
                                  <DropdownMenuItem>Copy text</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-muted-foreground"
                            >
                              <Heart className="mr-1 h-3 w-3" />
                              {reply.likes > 0 && <span>{reply.likes}</span>}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}