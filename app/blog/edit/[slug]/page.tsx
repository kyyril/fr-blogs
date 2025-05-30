import { Metadata } from "next";
import { BlogForm } from "@/components/blog/blog-form";

export const metadata: Metadata = {
  title: "Edit Blog - Blogify",
  description: "Edit your blog post on Blogify",
};

interface EditBlogPageProps {
  params: {
    slug: string;
  };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  console.log(params.slug, "paramsss");
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Your Blog</h1>
      <BlogForm slug={params.slug} isEditing />
    </div>
  );
}
