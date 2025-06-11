import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Eye, PenIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/types/data.interface";
import { useAuth } from "@/hooks/useAuth";

interface BlogCardProps {
  blog: BlogPost;
  featured?: boolean;
  isProfile?: boolean;
  currentUser?: any; // User object from auth
  profileUser?: any; // Profile owner user object
}

export function BlogCard({
  blog,
  featured = false,
  isProfile = false,
  currentUser,
  profileUser,
}: BlogCardProps) {
  const { user: authUser } = useAuth();

  // Use passed currentUser or fallback to hook
  const user = currentUser || authUser;

  let createdAt = new Date(blog.date);

  // Determine if current user can edit this blog
  const canEdit = user?.id === blog.authorId;

  // When isProfile is true, use profileUser data for author info
  // Otherwise use blog.author data
  const authorInfo =
    isProfile && profileUser
      ? {
          name: profileUser.name,
          avatar: profileUser.avatar,
          id: profileUser.id,
        }
      : {
          name: blog.author?.name || "Anonymous",
          avatar: blog.author?.avatar,
          id: blog.author?.id,
        };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${
        featured ? "flex flex-col md:flex-row" : ""
      }`}
    >
      <div
        className={`relative ${featured ? "h-48 md:h-auto md:w-2/5" : "h-48"}`}
      >
        {/* Show edit button only if user can edit and it's on profile page */}
        {canEdit && isProfile && (
          <div className="absolute right-4 top-4 z-10">
            <Link href={`/blog/edit/${blog.id}`}>
              <div className="rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background">
                <PenIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </div>
            </Link>
          </div>
        )}
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
          {blog.categories?.[0] || "General"}
        </Badge>
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "md:w-3/5" : ""}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {/* <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span> */}
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
          {/* Author info - only show if not on profile page or if viewing someone else's profile */}
          {(!isProfile || (isProfile && user?.id !== profileUser?.id)) && (
            <Link
              href={`/profile/${authorInfo.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={authorInfo.avatar} alt={authorInfo.name} />
                <AvatarFallback>{authorInfo.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{authorInfo.name}</span>
            </Link>
          )}

          {/* When on own profile, show a placeholder or hide author info */}
          {isProfile && user?.id === profileUser?.id && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your post</span>
            </div>
          )}

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
