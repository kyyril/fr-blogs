"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BlogActions } from "@/components/blog/blog-actions";
import { BlogComments } from "@/components/blog/blog-comments";
import { RelatedBlogs } from "@/components/blog/related-blogs";
import { Blog } from "@/lib/types/data.interface";
import { useBlog } from "@/hooks/useBlog";

interface BlogDetailClientProps {
  blog: Blog;
}

export function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const { recordView } = useBlog();

  useEffect(() => {
    // Record blog view when component mounts
    recordView.mutate(blog.id);
  }, [blog.id, recordView]);

  return (
    <>
      {/* Blog Actions */}
      <BlogActions blog={blog} />

      {/* Blog Content */}
      <article className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
        <div
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="blog-content"
        />
      </article>

      {/* Blog Actions (Bottom) */}
      <div className="my-8">
        <BlogActions blog={blog} />
      </div>

      {/* Author Bio */}
      <div className="mb-12 rounded-lg bg-muted p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={blog.author.avatar || ""}
              alt={blog.author.name}
            />
            <AvatarFallback className="text-lg">
              {blog.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold">{blog.author.name}</h3>
            <p className="mb-3 text-muted-foreground">
              {blog.author.bio ||
                `${blog.author.name} is a passionate writer and contributor to our blog community. Follow for more insightful content and updates.`}
            </p>
            <Button variant="outline" size="sm">
              Follow
            </Button>
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
          category={blog.categories[0]} // Use first category for related blogs
        />
      </div>
    </>
  );
}
