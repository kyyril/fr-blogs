import { Skeleton } from "@/components/ui/skeleton"; // Adjust path as needed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileLoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 space-y-8">
        {/* Cover Image Skeleton */}
        <Skeleton className="relative h-48 w-full overflow-hidden rounded-lg md:h-64" />

        {/* Profile Information Skeleton */}
        <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left">
          <div className="absolute -top-16 sm:-top-20">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-background sm:h-40 sm:w-40" />
          </div>

          <div className="mt-16 w-full sm:mt-0 sm:ml-44">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <Skeleton className="h-8 w-48 mb-2" /> {/* Name skeleton */}
                <Skeleton className="h-5 w-36" /> {/* Email skeleton */}
              </div>

              {/* Button Skeleton */}
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>

            {/* Bio Skeleton */}
            <Skeleton className="mt-4 h-6 w-full max-w-lg" />
            <Skeleton className="mt-2 h-6 w-full max-w-md" />

            <div className="mt-4 flex items-center justify-center gap-6 sm:justify-start">
              {/* Blog Count Skeleton */}
              <div className="text-center">
                <Skeleton className="h-7 w-10 mx-auto mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
              {/* Followers Count Skeleton */}
              <div className="text-center">
                <Skeleton className="h-7 w-10 mx-auto mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              {/* Following Count Skeleton */}
              <div className="text-center">
                <Skeleton className="h-7 w-10 mx-auto mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Social Links Skeleton */}
            <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-8">
        <div className="grid w-full grid-cols-3 gap-2">
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
        </div>
        <div className="mt-6">
          {/* Content area skeleton for blogs/followers/following */}
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
