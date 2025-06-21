'use client';

import { BlogForm } from "@/components/blog/blog-form";
import { RouteGuard } from "@/components/auth/route-guard";

interface EditBlogWrapperProps {
  slug: string;
}

export function EditBlogWrapper({ slug }: EditBlogWrapperProps) {
  return (
    <RouteGuard requireAuth={true}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Edit Your Blog</h1>
        <BlogForm slug={slug} isEditing />
      </div>
    </RouteGuard>
  );
}
