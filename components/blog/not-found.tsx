import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">Blog Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/blog">Back to Blogs</Link>
        </Button>
      </div>
    </div>
  );
}
