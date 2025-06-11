"use client";

import { useBlog } from "@/hooks/useBlog";
import { BlogList } from "./blog-list";
import { BlogCard } from "./blog-card";

interface RelatedBlogsProps {
  currentBlogId: string;
  category: string;
}

export function RelatedBlogs({ currentBlogId, category }: RelatedBlogsProps) {
  const { getBlogsByCategory } = useBlog();

  const {
    data: relatedBlogsData,
    isLoading,
    isError,
  } = getBlogsByCategory(category);

  const relatedBlogs = relatedBlogsData?.blogs || [];

  if (isLoading) {
    return <p>Loading related blogs...</p>;
  }

  if (isError) {
    return <p>Error loading related blogs.</p>;
  }

  if (relatedBlogs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-muted-foreground">No related blogs found.</p>
      </div>
    );
  }
  console.log("Related Blogs Data:", relatedBlogs);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Pass the related blogs data to the BlogList component */}
      {relatedBlogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} isRelated={true} />
      ))}
    </div>
  );
}
