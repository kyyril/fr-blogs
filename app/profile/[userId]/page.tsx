"use client";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogList } from "@/components/blog/blog-list";
import { UserFollowers } from "@/components/profile/user-followers";
import { UserFollowing } from "@/components/profile/user-following";
import { useUser } from "@/hooks/useUser";
import { Twitter, Github, Linkedin, Loader2, PenIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have auth context
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { BlogPost } from "@/lib/types/data.interface";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { getProfile, followUser, unfollowUser, followStatus } = useUser();
  const { user: currentUser } = useAuth(); // Get current logged-in user
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatusLoading, setFollowStatusLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Add this state

  const { data: user, isLoading, error } = getProfile(params.userId);

  // Check follow status when component mounts
  useEffect(() => {
    if (currentUser && params.userId !== currentUser.id) {
      setFollowStatusLoading(true);
      followStatus.mutate(params.userId, {
        onSuccess: (data: any) => {
          setIsFollowing(data.is_following);
          setFollowStatusLoading(false);
        },
        onError: () => {
          setFollowStatusLoading(false);
        },
      });
    }
  }, [currentUser, params.userId]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;

    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(params.userId);
        setIsFollowing(false);
      } else {
        await followUser.mutateAsync(params.userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === params.userId;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 space-y-8">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background md:h-64">
          {/* Actual cover image would go here */}
        </div>

        {/* Profile Information */}
        <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left">
          <div className="absolute -top-16 sm:-top-20">
            <Avatar className="h-32 w-32 border-4 border-background sm:h-40 sm:w-40">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-16 w-full sm:mt-0 sm:ml-44">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              {/* Follow/Edit Button */}
              {!isOwnProfile && currentUser && (
                <Button
                  onClick={handleFollowToggle}
                  disabled={
                    followUser.isPending ||
                    unfollowUser.isPending ||
                    followStatusLoading
                  }
                  variant={isFollowing ? "outline" : "default"}
                >
                  {followUser.isPending || unfollowUser.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {followStatusLoading
                    ? "Loading..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </Button>
              )}

              {isOwnProfile && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    Settings
                  </Button>

                  <Dialog
                    open={isSettingsOpen}
                    onOpenChange={setIsSettingsOpen}
                  >
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Profile Settings</DialogTitle>
                      </DialogHeader>
                      <ProfileSettings
                        userId={params.userId}
                        onClose={() => setIsSettingsOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>

            {user.bio && <p className="mt-4">{user.bio}</p>}

            <div className="mt-4 flex items-center justify-center gap-6 sm:justify-start">
              <div className="text-center">
                <p className="text-xl font-bold">{user._count?.blogs}</p>
                <p className="text-sm text-muted-foreground">Blogs</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{user._count?.followers}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{user._count?.following}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            </div>

            {/* Social Links - Add these fields to your User interface if needed */}
            {(user.twitterAcc || user.githubAcc || user.linkedinAcc) && (
              <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
                {user.twitterAcc && (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={user.twitterAcc}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {user.githubAcc && (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={user.githubAcc}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {user.linkedinAcc && (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={user.linkedinAcc}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="blogs">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="blogs" className="mt-6">
          <UserBlogList blogs={user.blogs} />
        </TabsContent>
        <TabsContent value="followers" className="mt-6">
          <UserFollowers userId={params.userId} />
        </TabsContent>
        <TabsContent value="following" className="mt-6">
          <UserFollowing userId={params.userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component to display user's blogs
function UserBlogList({ blogs }: { blogs: BlogPost[] | undefined }) {
  const { user: currentUser } = useAuth(); // Add this at the top

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No blogs published yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="group relative rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
        >
          {currentUser?.id === blog.authorId && (
            <div className="absolute right-4 top-4 z-10">
              <Link href={`/blog/edit/${blog.id}`}>
                <div className="rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background">
                  <PenIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </div>
              </Link>
            </div>
          )}
          <div className="aspect-video relative mb-4 overflow-hidden rounded-md">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Link href={`/blog/${blog.id}`}>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {blog.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(blog.date).toLocaleDateString()}</span>
            <span>{blog.readingTime} min read</span>
          </div>
        </div>
      ))}
    </div>
  );
}
