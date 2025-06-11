import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"; // Import Card components for consistent styling

export function FeaturedBlogsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card // Use Card component to mimic BlogCard's structure
          key={index}
          className="overflow-hidden transition-all hover:shadow-md flex flex-col md:flex-row"
        >
          <div className="relative h-48 md:h-auto md:w-2/5">
            <Skeleton className="h-full w-full object-cover" />{" "}
            {/* Added object-cover for better image mimic */}
          </div>
          <div className="flex flex-1 flex-col md:w-3/5">
            <CardHeader className="p-4 pb-2">
              {" "}
              {/* Use CardHeader */}
              <div className="flex py-1 items-center gap-2 text-sm text-muted-foreground">
                <Skeleton className="h-4 w-20" /> {/* Skeleton for date */}
                <Skeleton className="h-4 w-4" /> {/* Skeleton for separator */}
                <Skeleton className="h-4 w-16" />{" "}
                {/* Skeleton for reading time */}
              </div>
              <h3 className="line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
                <Skeleton className="h-6 w-3/4" /> {/* Skeleton for title */}
              </h3>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-0">
              {" "}
              {/* Use CardContent */}
              <p className="line-clamp-2 text-sm text-muted-foreground">
                <Skeleton className="h-4 w-full" />{" "}
                {/* Skeleton for description line 1 */}
                <Skeleton className="h-4 w-5/6 mt-2" />{" "}
                {/* Skeleton for description line 2, added margin-top */}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              {" "}
              {/* Use CardFooter */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />{" "}
                {/* Skeleton for author avatar */}
                <Skeleton className="h-4 w-24" />{" "}
                {/* Skeleton for author name */}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Skeleton className="h-4 w-12" />{" "}
                {/* Skeleton for like count */}
                <Skeleton className="h-4 w-12" />{" "}
                {/* Skeleton for comment count */}
                <Skeleton className="h-4 w-12" />{" "}
                {/* Skeleton for view count */}
              </div>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
}
