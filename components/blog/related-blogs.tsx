'use client';

import { BlogCard } from '@/components/blog/blog-card';
import { mockBlogs } from '@/lib/mock-data';

interface RelatedBlogsProps {
  currentBlogId: string;
  category: string;
}

export function RelatedBlogs({ currentBlogId, category }: RelatedBlogsProps) {
  // Filter blogs by category and exclude the current blog
  const relatedBlogs = mockBlogs
    .filter((blog) => blog.category === category && blog.id !== currentBlogId)
    .slice(0, 3);

  if (relatedBlogs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-muted-foreground">No related blogs found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {relatedBlogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}