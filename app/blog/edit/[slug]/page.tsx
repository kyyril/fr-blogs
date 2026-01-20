import { Metadata } from "next";
import { EditBlogWrapper } from "@/components/blog/edit-blog-wrapper";


export const metadata: Metadata = {
  title: "Edit Blog - synblog",
  description: "Edit your blog post on synblog",
};

interface EditBlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const resolvedParams = await params;
  console.log(resolvedParams.slug, "paramsss");

  return <EditBlogWrapper slug={resolvedParams.slug} />;
}
