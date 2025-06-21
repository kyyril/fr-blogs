"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BlogActions } from "@/components/blog/blog-actions";
import { BlogComments } from "@/components/blog/blog-comments";
import { RelatedBlogs } from "@/components/blog/related-blogs";
import { useBlog } from "@/hooks/useBlog";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { MDXRenderer } from "@/components/blog/MDXRenderer";
import { TableOfContents } from "./TableOfContents";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { List } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlogPost } from "@/lib/types/data.interface";

interface BlogDetailClientProps {
  blog: BlogPost;
}

export function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const { recordView } = useBlog();
  const { followUser, unfollowUser, followStatus } = useUser();
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatusLoading, setFollowStatusLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Record blog view when component mounts
    recordView.mutate(blog.id);
  }, [blog.id]);

  // Check follow status for the blog author
  useEffect(() => {
    if (currentUser && blog?.author?.id !== currentUser.id) {
      setFollowStatusLoading(true);
      followStatus.mutate(blog.author?.id, {
        onSuccess: (data: any) => {
          setIsFollowing(data.is_following);
          setFollowStatusLoading(false);
        },
        onError: () => {
          setFollowStatusLoading(false);
        },
      });
    }
  }, [currentUser, blog.author?.id]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;

    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(blog.author?.id);
        setIsFollowing(false);
      } else {
        await followUser.mutateAsync(blog.author?.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const isOwnBlog = currentUser?.id === blog.author?.id;

  return (
    <>
      {/* Global Reading Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Mobile TOC Button - Fixed Position */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full shadow-lg"
            >
              <List className="h-4 w-4 mr-2" />
              Contents
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className={cn(
              "w-[300px] sm:w-[400px]",
              "bg-background/60 dark:bg-background/40", // Glassmorphism background
              "backdrop-blur-xl", // Strong blur effect
              "border-border/50", // Subtle border
              "[&_[data-radix-scroll-area-viewport]]:!block", // Fix for scroll area
              // Enhanced shadow and rounded corners
              "shadow-[0_0_1rem_rgba(0,0,0,.1)] dark:shadow-[0_0_1rem_rgba(0,0,0,.3)]",
              "rounded-l-2xl"
            )}
          >
            <SheetHeader>
              <SheetTitle className="text-foreground/90">
                Table of Contents
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <TableOfContents content={blog.content} isMobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Layout with Sidebar TOC */}
      <div className="relative lg:grid lg:grid-cols-[1fr_250px] lg:gap-8">
        <div>
          {/* Blog Actions */}
          <BlogActions blog={blog} />

          {/* Blog Content with MDXRenderer */}
          <article className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
            <MDXRenderer content={blog.content} />
          </article>

          {/* Blog Actions (Bottom) */}
          <div className="my-8">
            <BlogActions blog={blog} />
          </div>

          {/* Author Bio */}
          <div className="mb-12 rounded-lg bg-muted p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Link
                href={`/profile/${blog.author?.id}`}
                className="hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-16 w-16 cursor-pointer">
                  <AvatarImage
                    src={blog.author?.avatar || ""}
                    alt={blog.author?.name}
                  />
                  <AvatarFallback className="text-lg">
                    {blog.author?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1">
                <Link
                  href={`/profile/${blog.author?.username || blog.author?.id}`}
                  className="hover:text-primary transition-colors"
                >
                  <h3 className="mb-1 text-lg font-semibold cursor-pointer">
                    {blog.author?.name}
                  </h3>
                </Link>

                <p className="mb-3 text-muted-foreground">
                  {blog.author?.bio ||
                    `${blog.author?.name} is a passionate writer and contributor to our blog community. Follow for more insightful content and updates.`}
                </p>

                <div className="flex items-center gap-3">
                  {/* Follow/Unfollow Button */}
                  {!isOwnBlog && currentUser && (
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={handleFollowToggle}
                      disabled={
                        followUser.isPending ||
                        unfollowUser.isPending ||
                        followStatusLoading
                      }
                    >
                      {followUser.isPending || unfollowUser.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {followStatusLoading
                        ? "Loading..."
                        : isFollowing
                        ? "Unfollow"
                        : "Follow"}
                    </Button>
                  )}

                  {/* View Profile Button */}
                  <Link
                    href={`/profile/${
                      blog.author?.username || blog.author?.id
                    }`}
                  >
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Comments</h2>
            <BlogComments blogId={blog.id} />
          </div>

          {/* Related Blogs */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold">Related Blogs</h2>
            <RelatedBlogs
              currentBlogId={blog.id}
              category={blog.categories[0]}
            />
          </div>
        </div>

        {/* Desktop TOC - Fixed Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            {" "}
            {/* Adjusted for header height */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "rounded-lg border",
                "bg-card/60 dark:bg-card/40",
                "backdrop-blur-md",
                "shadow-lg",
                "p-4",
                // Glass effect
                "border-border/50",
                "dark:shadow-[0_0_1rem_rgba(0,0,0,.2)]"
              )}
            >
              <TableOfContents content={blog.content} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
