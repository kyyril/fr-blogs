import { BlogList } from "@/components/blog/blog-list";
import { CategoryFilter } from "@/components/blog/category-filter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Blogs - synblog",
  description:
    "Discover stories, ideas, and expertise from writers on any topic",
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; tags?: string }>;
}) {
  const { category, search, tags } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">All Blogs</h1>
        <p className="text-muted-foreground">
          {category
            ? `Browse all posts in ${category}`
            : tags
            ? `Browse all posts tagged with ${tags}`
            : search
            ? `Search results for "${search}"`
            : "Discover stories, ideas, and expertise from writers on any topic"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-20">
            <CategoryFilter />
          </div>
        </aside>

        <div>
          <BlogList category={category} tags={tags} />
        </div>
      </div>
    </div>
  );
}
