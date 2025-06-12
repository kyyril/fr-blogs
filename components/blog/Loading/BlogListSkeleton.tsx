import { Skeleton } from "@/components/ui/skeleton";

export function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="overflow-hidden rounded-lg border shadow"
        >
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="mb-2 h-4 w-2/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-3/4" />
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
