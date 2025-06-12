import { Metadata } from "next";
import { BlogForm } from "@/components/blog/blog-form";

export const metadata: Metadata = {
  title: "Edit Blog - Blogify",
  description: "Edit your blog post on Blogify",
};

interface EditBlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const resolvedParams = await params;
  console.log(resolvedParams.slug, "paramsss");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Your Blog</h1>
      <BlogForm slug={resolvedParams.slug} isEditing />
    </div>
  );
}
