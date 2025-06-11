"use client";
import { useState, useEffect } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import { useBlog } from "@/hooks/useBlog";
import { BlogPost } from "@/lib/types/data.interface";

interface BlogListProps {
  featured?: boolean;
  category?: string;
  limit?: number;
  isProfile?: boolean;
  blog?: BlogPost[]; // Static blog list for profile pages
  currentUser?: any; // Current authenticated user
  profileUser?: any; // Profile owner user
}

export function BlogList({
  featured = false,
  category,
  limit,
  isProfile = false,
  blog: staticBlogs,
  currentUser,
  profileUser,
}: BlogListProps) {
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  // Use appropriate hook based on category filter - only when not using static blogs
  const { getBlogs, getBlogsByCategory } = useBlog();

  // Determine which query to use - only when not using static blogs
  const shouldUseQuery = !staticBlogs;
  const query = shouldUseQuery
    ? category
      ? getBlogsByCategory(category, currentPage, limit || 9)
      : getBlogs(currentPage, limit || 9)
    : { data: null, isLoading: false, error: null, isFetching: false };

  const { data, isLoading, error, isFetching } = query;

  // Initialize with static blogs if provided
  useEffect(() => {
    if (staticBlogs) {
      setAllBlogs(staticBlogs);
      setHasMore(false); // No pagination for static blogs
    }
  }, [staticBlogs]);

  // Update blogs when data changes (for dynamic loading)
  useEffect(() => {
    if (data?.featuredBlogs && shouldUseQuery) {
      if (currentPage === 1) {
        setAllBlogs(data.featuredBlogs);
      } else {
        setAllBlogs((prev) => [...prev, ...data.featuredBlogs]);
      }

      // Check if there are more pages
      const totalPages = Math.ceil(data.total / data.limit);
      setHasMore(data.page < totalPages);
    }
  }, [data, currentPage, shouldUseQuery]);

  // Auto-load more when scrolling into view (infinite scroll) - only for dynamic loading
  useEffect(() => {
    if (inView && hasMore && !isFetching && !limit && shouldUseQuery) {
      loadMore();
    }
  }, [inView, hasMore, isFetching, limit, shouldUseQuery]);

  const loadMore = () => {
    if (hasMore && !isFetching && shouldUseQuery) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  console.log("All Blogs:", allBlogs);

  // Handle error state
  if (error && currentPage === 1) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div>
          <p className="text-muted-foreground">
            Failed to load blogs. Please try again.
          </p>
          <Button
            variant="link"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!isLoading && allBlogs.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div>
          <p className="text-muted-foreground">
            {isProfile
              ? "No blogs published yet."
              : category
              ? `No blogs found in "${category}" category.`
              : "No blogs found."}
          </p>
          {category && !isProfile && (
            <Button
              variant="link"
              className="mt-2"
              onClick={() => {
                setCurrentPage(1);
                setAllBlogs([]);
                // You might want to emit an event to clear category filter
              }}
            >
              View all blogs
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            featured={featured}
            isProfile={isProfile}
            currentUser={currentUser}
            profileUser={profileUser}
          />
        ))}

        {/* Loading skeletons - only for dynamic loading */}
        {(isLoading || isFetching) &&
          shouldUseQuery &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="overflow-hidden rounded-lg border shadow"
            >
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

      {/* Load more button - visible only if hasMore is true and not at the limit and using dynamic loading */}
      {hasMore && !limit && allBlogs.length > 0 && shouldUseQuery && (
        <div className="mt-8 flex justify-center" ref={ref}>
          <Button
            onClick={loadMore}
            disabled={isFetching}
            variant="outline"
            className="min-w-[150px]"
          >
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
