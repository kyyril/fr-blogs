import React, { useState } from "react";
import { useBlog } from "@/hooks/useBlog";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  User,
  BookmarkX,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function BookmarksPage() {
  const { user } = useAuth();
  const { getBookmarkedBlogs, toggleBookmark } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: bookmarksData,
    isLoading,
    isError,
    error,
  } = getBookmarkedBlogs(currentPage, limit, {
    enabled: !!user,
  });

  const handleRemoveBookmark = async (blogId: string) => {
    try {
      await toggleBookmark.mutateAsync(blogId);
      toast({
        title: "Bookmark removed",
        description: "The blog has been removed from your bookmarks",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <div className="text-6xl">🔒</div>
            <h2 className="text-2xl font-bold text-center">
              Authentication Required
            </h2>
            <p className="text-center text-muted-foreground">
              Please sign in to view your bookmarked blogs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your bookmarks...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-center">
              Error Loading Bookmarks
            </h2>
            <p className="text-center text-muted-foreground">
              {error?.message ||
                "Something went wrong while loading your bookmarks."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPages = Math.ceil((bookmarksData?.total || 0) / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Bookmarks
          </h1>
          <p className="text-muted-foreground">
            {bookmarksData?.total || 0} bookmarked blog
            {(bookmarksData?.total || 0) !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Bookmarks List */}
        {!bookmarksData?.blogs?.length ? (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center space-y-4 p-12">
              <div className="text-8xl">📚</div>
              <h2 className="text-2xl font-bold text-center">
                No Bookmarks Yet
              </h2>
              <p className="text-center text-muted-foreground max-w-md">
                Start bookmarking blogs you want to read later. They'll appear
                here for easy access.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookmarksData.blogs.map((blog) => (
              <Card
                key={blog.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Blog Title */}
                      <div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors cursor-pointer">
                          {blog.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {blog.description}
                        </p>
                      </div>

                      {/* Categories */}
                      {blog.categories && blog.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.categories
                            .slice(0, 3)
                            .map((category, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {category}
                              </Badge>
                            ))}
                          {blog.categories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{blog.categories.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Blog Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{blog.author?.name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>

                      {/* Blog Stats */}
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{blog.stats?.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{blog.stats?.comments || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{blog.stats?.views || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveBookmark(blog.id)}
                        disabled={toggleBookmark.isPending}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
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
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
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
        )}
      </div>
    </div>
  );
}
