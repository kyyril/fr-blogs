"use client";

import { useEffect } from "react";
import {
  Heart,
  Share2,
  Bookmark,
  MessageSquare,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  BookmarkCheck,
  FileHeart as HeartFilled,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useBlog } from "@/hooks/useBlog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { BlogPost } from "@/lib/types/data.interface";

interface BlogActionsProps {
  blog: BlogPost;
}

export function BlogActions({ blog }: BlogActionsProps) {
  const { user } = useAuth();
  const { getBlogInteraction, toggleLike, toggleBookmark } = useBlog();

  const {
    data: interaction,
    isLoading,
    isError,
  } = getBlogInteraction(blog.id, {
    enabled: !!user, // Only fetch if user is logged in
  });

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like this blog",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleLike.mutateAsync(blog.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark this blog",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleBookmark.mutateAsync(blog.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://synblog.vercel.app/blog/${blog.slug}`
    );
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard",
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
        disabled={isLoading || toggleLike.isPending}
      >
        {interaction?.liked ? (
          <HeartFilled className="h-4 w-4 text-destructive" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
        <span>{interaction?.likeCount ?? 0}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleBookmark}
        disabled={isLoading || toggleBookmark.isPending}
      >
        {interaction?.bookmarked ? (
          <BookmarkCheck className="h-4 w-4 text-primary" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        <span>{interaction?.bookmarkCount ?? 0}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() =>
          document
            .querySelector("#comments")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <MessageSquare className="h-4 w-4" />
        <span>{blog.commentCount || 0}</span>
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
          <DropdownMenuItem onClick={() => handleShare("Twitter")}>
            <Twitter className="mr-2 h-4 w-4" />
            <span>Twitter</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("Facebook")}>
            <Facebook className="mr-2 h-4 w-4" />
            <span>Facebook</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("LinkedIn")}>
            <Linkedin className="mr-2 h-4 w-4" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
