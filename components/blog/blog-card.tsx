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

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    category: string;
    createdAt: Date;
    readTime: number;
    author: {
      name: string;
      avatar: string;
    };
    stats: {
      likes: number;
      comments: number;
      views: number;
    };
  };
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
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
            src={blog.coverImage}
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
          {blog.category}
        </Badge>
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "md:w-3/5" : ""}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {formatDistanceToNow(blog.createdAt, { addSuffix: true })}
            </span>
            <span>•</span>
            <span>{blog.readTime} min read</span>
          </div>
          <Link href={`/blog/${blog.id}`} className="group">
            <h3 className="line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
              {blog.title}
            </h3>
          </Link>
        </CardHeader>

        <CardContent className="flex-1 p-4 pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {blog.excerpt}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
              <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{blog.author.name}</span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <Heart className="h-3.5 w-3.5" />
              <span>{blog.stats.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{blog.stats.comments}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Eye className="h-3.5 w-3.5" />
              <span>{blog.stats.views}</span>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
