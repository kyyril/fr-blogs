"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import Link from "next/link";
import { useFollowing } from "@/hooks/useUser";
import { UserProfile } from "@/services/user.services";

interface UserFollowingProps {
  userId: string;
}

export function UserFollowing({ userId }: UserFollowingProps) {
  const { data: following, isLoading, isError } = useFollowing(userId);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading following</div>;
  }

  const filteredFollowing = (following || []).filter((user: UserProfile) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search following..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredFollowing.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFollowing.map((user) => (
            <div key={user.id}>
              <div className="flex items-center justify-between">
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-3"
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </Link>
                {/* <Button
                  variant="secondary"
                  onClick={() => handleUnfollow(user.id)}
                >
                  Following
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
