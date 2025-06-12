import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { blogService } from "@/services/blog.services";
import { BlogDetailClient } from "@/components/blog/blog-detail-client";
import NotFound from "@/components/blog/not-found";
import { Suspense } from "react";
import BlogDetailSkeleton from "@/components/blog/Loading/BlogDetailSkeleton";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const blog = await blogService.getBlogById(resolvedParams.slug);
    console.log("Generating metadata for blog:", blog);
    let createdAt = new Date(blog.date).toISOString();
    return {
      title: `${blog.title} - Blogify`,
      description: blog.description,
      openGraph: {
        title: blog.title,
        description: blog.description,
        type: "article",
        publishedTime: createdAt,
        authors: [blog.author.name],
        images: [
          {
            url: blog.image,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.description,
        images: [blog.image],
      },
    };
  } catch (error) {
    return {
      title: "Blog Not Found - Blogify",
      description: "The requested blog could not be found.",
    };
  }
}

// Separate component for blog content
async function BlogContent({ params }: { params: Promise<{ slug: string }> }) {
  let blog;

  try {
    const resolvedParams = await params;
    blog = await blogService.getBlogById(resolvedParams.slug);
  } catch (error) {
    return <NotFound />;
  }

  if (!blog) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Blog Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {blog.categories.map((category, index) => (
            <Badge key={index}>{category}</Badge>
          ))}
        </div>

        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          {blog.title}
        </h1>

        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground md:text-lg">
          {blog.description}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${blog.author.id}`}
              className="hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage
                  src={blog.author.avatar || ""}
                  alt={blog.author.name}
                />
                <AvatarFallback>
                  {blog.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="text-left">
              <Link
                href={`/profile/${blog.author.id}`}
                className="hover:text-primary transition-colors"
              >
                <p className="text-sm font-medium cursor-pointer">
                  {blog.author.name}
                </p>
              </Link>
              <p className="text-xs text-muted-foreground">Author</p>
            </div>
          </div>

          <Separator className="hidden h-6 sm:block" orientation="vertical" />

          <div className="text-sm text-muted-foreground">
            <span>{format(new Date(blog.date), "MMMM d, yyyy")}</span>
            <span className="mx-2">•</span>
            <span>{blog.readingTime} min read</span>
            <span className="mx-2">•</span>
            <span>{blog.viewCount} views</span>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {blog.tags.map((tag, index) => (
              <Badge key={index} className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Blog Cover Image */}
      <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      {/* Client-side components with blog data */}
      <BlogDetailClient blog={blog} />
    </div>
  );
}

export default function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogContent params={params} />
    </Suspense>
  );
}
