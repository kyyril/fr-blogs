"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import Link from "next/link";
import { useFollowers } from "@/hooks/useUser";
import { UserProfile } from "@/services/user.services";

interface UserFollowersProps {
  userId: string;
}

export function UserFollowers({ userId }: UserFollowersProps) {
  const { data: followers, isLoading, isError } = useFollowers(userId);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading followers</div>;
  }

  const filteredFollowers = (followers || []).filter((follower: UserProfile) =>
    follower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search followers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredFollowers.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No followers found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFollowers.map((follower) => (
            <div key={follower.id}>
              <div className="flex items-center justify-between">
                <Link
                  href={`/profile/${follower.username}`}
                  className="flex items-center gap-3"
                >
                  <Avatar>
                    <AvatarImage src={follower.avatar} alt={follower.name} />
                    <AvatarFallback>{follower.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{follower.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {follower.email}
                    </p>
                  </div>
                </Link>
                {/* <Button
                  variant={follower.isFollowing ? 'secondary' : 'outline'}
                  onClick={() => toggleFollow(follower.id)}
                >
                  {follower.isFollowing ? 'Following' : 'Follow'}
                </Button> */}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
