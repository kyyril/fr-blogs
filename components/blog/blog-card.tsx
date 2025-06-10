import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/types/data.interface";

export function BlogCard({
  blog,
  featured = false,
}: {
  blog: BlogPost;
  featured?: boolean;
}) {
  let createdAt = new Date(blog.date);
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${
        featured ? "flex flex-col md:flex-row" : ""
      }`}
    >
      <div
        className={`relative ${featured ? "h-48 md:h-auto md:w-2/5" : "h-48"}`}
      >
        <Link href={`/blog/${blog.id}`}>
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 40vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
          />
        </Link>
        <Badge className="absolute left-3 top-3 bg-background/80 backdrop-blur-sm">
          {blog.categories[0] || "General"}
        </Badge>
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "md:w-3/5" : ""}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
            <span>•</span>
            <span>{blog.readingTime || 0} min read</span>
          </div>
          <Link href={`/blog/${blog.id}`} className="group">
            <h3 className="line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
              {blog.title || "Untitled Blog Post"}
            </h3>
          </Link>
        </CardHeader>

        <CardContent className="flex-1 p-4 pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {blog.description || "No description available."}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={blog.author?.avatar} alt={blog.author?.name} />
              <AvatarFallback>{blog.author?.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {blog.author?.name || "Anonymous"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <Heart className="h-3.5 w-3.5" />
              <span>{blog.likeCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{blog.commentCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Eye className="h-3.5 w-3.5" />
              <span>{blog.viewCount || 0}</span>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
