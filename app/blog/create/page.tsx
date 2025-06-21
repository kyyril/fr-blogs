"use client";

import { Metadata } from "next";
import { BlogForm } from "@/components/blog/blog-form";
import { RouteGuard } from "@/components/auth/route-guard";

// Note: metadata export doesn't work with 'use client', so we'll handle this differently
// export const metadata: Metadata = {
//   title: "Create Blog - synblog",
//   description: "Create a new blog post on synblog",
// };

export default function CreateBlogPage() {
  return (
    <RouteGuard requireAuth={true}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Create New Blog</h1>
        <BlogForm />
      </div>
    </RouteGuard>
  );
}
