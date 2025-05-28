'use client';

import { useState } from 'react';
import { Heart, Share2, Bookmark, MessageSquare, Copy, Twitter, Facebook, Linkedin, BookmarkCheck, FileHeart as HeartFilled } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';

interface BlogActionsProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    stats: {
      likes: number;
      comments: number;
      views: number;
    };
  };
}

export function BlogActions({ blog }: BlogActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blog.stats.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    // In a real app, this would be an API call
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    // In a real app, this would be an API call
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
      description: isBookmarked
        ? 'This blog has been removed from your bookmarks'
        : 'This blog has been added to your bookmarks',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://blogify.com/blog/${blog.slug}`);
    toast({
      title: 'Link copied',
      description: 'The link has been copied to your clipboard',
    });
  };

  const handleShare = (platform: string) => {
    // In a real app, this would open a share dialog
    toast({
      title: `Shared on ${platform}`,
      description: `The blog has been shared on ${platform}`,
    });
  };

  return (
    <div className="my-6 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleLike}
      >
        {isLiked ? (
          <HeartFilled className="h-4 w-4 text-destructive" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
        <span>{likes}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => document.querySelector('#comments')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{blog.stats.comments}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleBookmark}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-4 w-4 text-primary" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline-block">Share</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy link</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('Twitter')}>
            <Twitter className="mr-2 h-4 w-4" />
            <span>Twitter</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('Facebook')}>
            <Facebook className="mr-2 h-4 w-4" />
            <span>Facebook</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('LinkedIn')}>
            <Linkedin className="mr-2 h-4 w-4" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}