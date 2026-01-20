"use client";

import { BlogCard } from "@/components/blog/blog-card";
import { FeaturedBlogsSkeleton } from "@/components/blog/Loading/FeaturedBlogsSkeleton";
import { useFeaturedBlogs } from "@/hooks/use-graphql";

/**
 * FeaturedBlogs component using GraphQL
 * 
 * This component demonstrates how to use GraphQL for fetching data.
 * It replaces REST API calls with Apollo Client's useQuery hook.
 */
export function FeaturedBlogsGraphQL() {
    const { featuredBlogs, loading, error } = useFeaturedBlogs(2);

    if (loading) {
        return <FeaturedBlogsSkeleton />;
    }

    if (error) {
        console.error("GraphQL Error:", error);
        return <div>Error loading featured blogs.</div>;
    }

    if (!featuredBlogs || featuredBlogs.length === 0) {
        return <div>No featured blogs available.</div>;
    }

    // Transform GraphQL data to match existing BlogCard props
    const transformedBlogs = featuredBlogs.map((blog: any) => ({
        ...blog,
        // Map categories from objects to strings if needed
        categories: blog.categories?.map((c: any) =>
            typeof c === 'string' ? c : c.name
        ) || [],
        // Map tags from objects to strings if needed  
        tags: blog.tags?.map((t: any) =>
            typeof t === 'string' ? t : t.name
        ) || [],
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {transformedBlogs.map((blog: any) => (
                <BlogCard key={blog.id} blog={blog} featured={true} />
            ))}
        </div>
    );
}
