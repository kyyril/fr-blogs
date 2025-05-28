'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface UserFollowingProps {
  userId: string;
}

// Mock following data
const mockFollowing = [
  {
    id: '6',
    name: 'Emily Rodriguez',
    image: 'https://i.pravatar.cc/150?u=emily@example.com',
    bio: 'Data scientist and machine learning enthusiast',
  },
  {
    id: '7',
    name: 'James Taylor',
    image: 'https://i.pravatar.cc/150?u=james@example.com',
    bio: 'Backend developer and system architect',
  },
  {
    id: '8',
    name: 'Olivia Johnson',
    image: 'https://i.pravatar.cc/150?u=olivia@example.com',
    bio: 'UI/UX designer and design systems expert',
  },
];

export function UserFollowing({ userId }: UserFollowingProps) {
  const [following, setFollowing] = useState(mockFollowing);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFollowing = following.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnfollow = (followingId: string) => {
    setFollowing(following.filter((user) => user.id !== followingId));
  };

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
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => handleUnfollow(user.id)}
                >
                  Following
                </Button>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}