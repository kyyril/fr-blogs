'use client';

import { useState } from 'react';
import { BlogCard } from '@/components/blog/blog-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';
import { mockBlogs } from '@/lib/mock-data';

interface BlogListProps {
  featured?: boolean;
  category?: string;
  limit?: number;
}

export function BlogList({ featured = false, category, limit }: BlogListProps) {
  const [blogs, setBlogs] = useState(mockBlogs.slice(0, limit || 9));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  // This would normally be a useEffect hook that triggers data loading when inView becomes true
  // For now, we're just using mock data

  const filteredBlogs = category
    ? blogs.filter((blog) => blog.category.toLowerCase() === category.toLowerCase())
    : blogs;

  const loadMore = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newBlogs = mockBlogs.slice(blogs.length, blogs.length + 6);
      if (newBlogs.length === 0) {
        setHasMore(false);
      } else {
        setBlogs([...blogs, ...newBlogs]);
      }
      setIsLoading(false);
    }, 1000);
  };

  if (filteredBlogs.length === 0 && !isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div>
          <p className="text-muted-foreground">No blogs found in this category.</p>
          <Button variant="link" className="mt-2" onClick={() => setBlogs(mockBlogs)}>
            View all blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} featured={featured} />
        ))}

        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="overflow-hidden rounded-lg border shadow">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="mb-2 h-4 w-2/3" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-3/4" />
                <div className="mt-4 flex justify-between">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Load more button - visible only if hasMore is true and not at the limit */}
      {hasMore && !limit && (
        <div className="mt-8 flex justify-center" ref={ref}>
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            className="min-w-[150px]"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}