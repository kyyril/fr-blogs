// components/blog/blog-detail-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function BlogDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Blog Header */}
      <div className="mb-8 text-center">
        {/* Categories */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>

        {/* Title */}
        <Skeleton className="mx-auto mb-4 h-12 w-3/4 rounded-lg" />

        {/* Description */}
        <Skeleton className="mx-auto mb-6 h-6 w-2/3 rounded-lg" />

        {/* Author and Metadata */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Author Avatar and Info */}
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <Skeleton className="h-10 w-10 rounded-full" />
            </Avatar>
            <div className="text-left">
              <Skeleton className="h-4 w-24 mb-1 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>

          {/* Separator */}
          <Separator className="hidden h-6 sm:block" orientation="vertical" />

          {/* Date, Reading Time, Views */}
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-20 rounded" />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Blog Cover Image */}
      <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>

      {/* Blog Content */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full rounded" />
        ))}
      </div>
    </div>
  );
}
