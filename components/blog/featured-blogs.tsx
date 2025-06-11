"use client";

"use client";

import { BlogCard } from "@/components/blog/blog-card";
import { useBlog } from "@/hooks/useBlog";

export function FeaturedBlogs() {
  const { getBlogFeatured } = useBlog();
  const { data: featuredBlogs, isLoading, isError } = getBlogFeatured(2);

  if (isLoading) {
    return <div>Loading featured blogs...</div>;
  }

  if (isError || !featuredBlogs) {
    return <div>Error loading featured blogs.</div>;
  }
  console.log("Featured Blogs Data:", featuredBlogs);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {featuredBlogs?.featuredBlogs?.map((blog) => (
        <BlogCard key={blog.id} blog={blog} featured={true} />
      ))}
    </div>
  );
}
