'use client';

import { BlogCard } from '@/components/blog/blog-card';
import { mockBlogs } from '@/lib/mock-data';

export function FeaturedBlogs() {
  // In a real app, you would fetch featured blogs from an API
  const featuredBlogs = mockBlogs.filter((blog) => blog.id === '1' || blog.id === '2');

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {featuredBlogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} featured={true} />
      ))}
    </div>
  );
}