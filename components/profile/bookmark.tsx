import React, { useState } from "react";
import {
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  User,
  BookmarkX,
  Loader2,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function BookmarksComponent({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { getUserBookmarks, toggleBookmark } = useBlog();

  const {
    data: bookmarksData,
    isLoading,
    error,
    refetch,
  } = getUserBookmarks(currentPage, limit);

  const bookmarks = bookmarksData?.bookmarks || [];
  const pagination = bookmarksData?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleRemoveBookmark = async (blogId: string) => {
    try {
      await toggleBookmark.mutateAsync(blogId);
      refetch();
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-muted-foreground">
            Loading your bookmarks...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Failed to load bookmarks
            </h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              There was an error loading your bookmarks. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-muted-foreground">
          {pagination?.totalCount || 0} saved article
          {(pagination?.totalCount || 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Start bookmarking articles you want to read later. They'll appear
              here for easy access.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((blog) => (
            <Card
              key={blog.id}
              className="group hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    {/* Title and Description */}
                    <div className="space-y-2">
                      <Link
                        href={`/blog/${blog.id}`}
                        className="block group-hover:underline"
                      >
                        <h3 className="text-xl font-semibold leading-tight hover:text-primary transition-colors cursor-pointer">
                          {blog.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {blog.description}
                      </p>
                    </div>

                    {/* Categories */}
                    {blog.categories && blog.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.categories.slice(0, 4).map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                        {blog.categories.length > 4 && (
                          <Badge variant="outline">
                            +{blog.categories.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>{blog.author?.name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(blog.date)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4" />
                        <span>{formatNumber(blog.likeCount || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        <span>{formatNumber(blog.commentCount || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(blog.viewCount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-start">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBookmark(blog.id)}
                      disabled={toggleBookmark.isPending}
                      className="text-muted-foreground hover:text-destructive"
                      title="Remove bookmark"
                    >
                      {toggleBookmark.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <BookmarkX className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <Separator />
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
