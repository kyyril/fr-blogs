"use client";

import dynamic from "next/dynamic";
import BlogDetailSkeleton from "@/components/blog/Loading/BlogDetailSkeleton";
import { BlogPost } from "@/lib/types/data.interface";

const DynamicBlogDetailClient = dynamic(
  () =>
    import("@/components/blog/blog-detail-client").then(
      (mod) => mod.BlogDetailClient
    ),
  {
    ssr: false,
    loading: () => <BlogDetailSkeleton />,
  }
);

interface BlogDetailClientWrapperProps {
  blog: BlogPost;
}

export function BlogDetailClientWrapper({
  blog,
}: BlogDetailClientWrapperProps) {
  return <DynamicBlogDetailClient blog={blog} />;
}
