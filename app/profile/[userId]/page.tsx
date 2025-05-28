import { Metadata } from 'next';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogList } from '@/components/blog/blog-list';
import { UserFollowers } from '@/components/profile/user-followers';
import { UserFollowing } from '@/components/profile/user-following';
import { mockUser } from '@/lib/mock-data';
import { Twitter, Github, Linkedin } from 'lucide-react';

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  // In a real app, fetch this data from an API
  const user = mockUser;

  return {
    title: `${user.name}'s Profile - Blogify`,
    description: `Check out ${user.name}'s profile and blogs on Blogify`,
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // In a real app, fetch this data from an API
  const user = mockUser;

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
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="mt-16 w-full sm:mt-0 sm:ml-44">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button>Follow</Button>
            </div>
            
            <p className="mt-4">{user.bio}</p>
            
            <div className="mt-4 flex items-center justify-center gap-6 sm:justify-start">
              <div className="text-center">
                <p className="text-xl font-bold">{user.stats.blogs}</p>
                <p className="text-sm text-muted-foreground">Blogs</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{user.stats.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{user.stats.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
              <Button variant="ghost" size="icon" asChild>
                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
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
          <BlogList />
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