import dynamic from "next/dynamic";
import { CategoryList } from "@/components/blog/category-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { FeaturedBlogsSkeleton } from "@/components/blog/Loading/FeaturedBlogsSkeleton";
import { BlogListSkeleton } from "@/components/blog/Loading/BlogListSkeleton";

const DynamicFeaturedBlogs = dynamic(
  () =>
    import("@/components/blog/featured-blogs").then((mod) => mod.FeaturedBlogs),
  {
    loading: () => <FeaturedBlogsSkeleton />,
  }
);
const DynamicBlogList = dynamic(
  () => import("@/components/blog/blog-list").then((mod) => mod.BlogList),
  {
    loading: () => <BlogListSkeleton />,
  }
);

export const metadata: Metadata = {
  title: "synblog - Home",
  description:
    "Discover stories, ideas, and expertise from writers on any topic.",
  keywords: ["blog", "stories", "ideas", "expertise", "writing"],
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 text-center md:p-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Welcome to synblog
          </h1>
          <p className="mb-6 text-lg text-muted-foreground md:text-xl">
            Discover stories, ideas, and expertise from writers on any topic
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/blog/create">Start Writing</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">Explore Blogs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Featured Stories</h2>
          <Button variant="ghost" asChild>
            <Link href="/blog">View all</Link>
          </Button>
        </div>
        <DynamicFeaturedBlogs />
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">
          Explore Categories
        </h2>
        <CategoryList />
      </section>

      {/* Recent Blogs Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Recent Stories</h2>
          <Button variant="ghost" asChild>
            <Link href="/blog">View all</Link>
          </Button>
        </div>
        <DynamicBlogList featured={false} limit={6} />
      </section>
    </div>
  );
}
