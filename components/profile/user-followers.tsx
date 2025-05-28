'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface UserFollowersProps {
  userId: string;
}

// Mock followers data
const mockFollowers = [
  {
    id: '2',
    name: 'Maria Garcia',
    image: 'https://i.pravatar.cc/150?u=maria@example.com',
    bio: 'UX Designer & Frontend Developer',
    isFollowing: true,
  },
  {
    id: '3',
    name: 'David Chen',
    image: 'https://i.pravatar.cc/150?u=david@example.com',
    bio: 'Full-stack developer and open source contributor',
    isFollowing: false,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    image: 'https://i.pravatar.cc/150?u=sarah@example.com',
    bio: 'DevOps engineer and cloud architect',
    isFollowing: true,
  },
  {
    id: '5',
    name: 'Michael Brown',
    image: 'https://i.pravatar.cc/150?u=michael@example.com',
    bio: 'Mobile app developer and UI designer',
    isFollowing: false,
  },
  {
    id: '6',
    name: 'Emily Rodriguez',
    image: 'https://i.pravatar.cc/150?u=emily@example.com',
    bio: 'Data scientist and machine learning enthusiast',
    isFollowing: false,
  },
];

export function UserFollowers({ userId }: UserFollowersProps) {
  const [followers, setFollowers] = useState(mockFollowers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFollowers = followers.filter((follower) =>
    follower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFollow = (followerId: string) => {
    setFollowers(
      followers.map((follower) =>
        follower.id === followerId
          ? { ...follower, isFollowing: !follower.isFollowing }
          : follower
      )
    );
  };

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
                  href={`/profile/${follower.id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar>
                    <AvatarImage src={follower.image} alt={follower.name} />
                    <AvatarFallback>{follower.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{follower.name}</p>
                    <p className="text-sm text-muted-foreground">{follower.bio}</p>
                  </div>
                </Link>
                <Button
                  variant={follower.isFollowing ? 'secondary' : 'outline'}
                  onClick={() => toggleFollow(follower.id)}
                >
                  {follower.isFollowing ? 'Following' : 'Follow'}
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