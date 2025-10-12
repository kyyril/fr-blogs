"use client";

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
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileSettings } from "@/components/profile/profile-settings";
import BookmarksComponent from "@/components/profile/bookmark";
import ProfileLoadingSkeleton from "@/components/profile/Loading/ProfileLoadingSkeleton";
import { RouteGuard } from "@/components/auth/route-guard";

import { useRouter } from "next/navigation";

interface ProfilePageClientProps {
  username: string;
  searchParams: {
    tab?: string;
  };
}

export default function ProfilePageClient({
  username,
  searchParams,
}: ProfilePageClientProps) {
  const {
    getProfile,
    getProfileByUsername,
    followUser,
    unfollowUser,
    followStatus,
  } = useUser();
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatusLoading, setFollowStatusLoading] = useState(false);
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  const { data: user, isLoading, error } = getProfileByUsername(username);

  useEffect(() => {
    if (searchParams.tab === "settings") {
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
    }

    if (searchParams.tab === "bookmarks") {
      setIsBookmarksOpen(true);
    } else {
      setIsBookmarksOpen(false);
    }
  }, [searchParams.tab]);

  useEffect(() => {
    if (currentUser && user && user.id !== currentUser.id) {
      setFollowStatusLoading(true);
      followStatus.mutate(user.id, {
        onSuccess: (data: any) => {
          setIsFollowing(data.is_following);
          setFollowStatusLoading(false);
        },
        onError: () => {
          setFollowStatusLoading(false);
        },
      });
    }
  }, [currentUser, user]);

  const handleFollowToggle = async () => {
    if (!currentUser || !user) return;

    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(user.id);
        setIsFollowing(false);
      } else {
        await followUser.mutateAsync(user.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
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

  const isOwnProfile = currentUser?.id === user?.id;

  return (
    <RouteGuard requireAuth={true}>
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
                  <h1 className="text-2xl font-bold md:text-3xl">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground">{user.username}</p>
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
                    <div className="gap-2 flex items-center">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/profile/${username}?tab=settings`);
                        }}
                      >
                        Settings
                      </Button>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/profile/${username}?tab=bookmarks`);
                        }}
                      >
                        Bookmarks
                      </Button>
                    </div>

                    <Dialog
                      open={isSettingsOpen}
                      onOpenChange={setIsSettingsOpen}
                    >
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Profile Settings</DialogTitle>
                        </DialogHeader>
                        <ProfileSettings
                          userId={user?.id || ""}
                          onClose={() => {
                            setIsSettingsOpen(false);
                            router.push(`/profile/${username}`);
                          }}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={isBookmarksOpen}
                      onOpenChange={setIsBookmarksOpen}
                    >
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Your Bookmarks</DialogTitle>
                        </DialogHeader>
                        <BookmarksComponent
                          userId={user.id}
                          onClose={() => {
                            setIsBookmarksOpen(false);
                            router.push(`/profile/${user.username}`);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>

              {user.bio && <p className="mt-4">{user.bio}</p>}

              <div className="mt-4 flex items-center justify-center gap-6 sm:justify-start">
                <div className="text-center">
                  <p className="text-xl font-bold">{user._count?.blogs || 0}</p>
                  <p className="text-sm text-muted-foreground">Blogs</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">
                    {user._count?.following || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">
                    {user._count?.followers || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>

              {/* Social Links */}
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
            <BlogList
              blog={user.blogs}
              featured={false}
              isProfile={true}
              currentUser={currentUser}
              profileUser={user}
            />
          </TabsContent>
          <TabsContent value="followers" className="mt-6">
            <UserFollowers userId={user?.id || ""} />
          </TabsContent>
          <TabsContent value="following" className="mt-6">
            <UserFollowing userId={user?.id || ""} />
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  );
}
