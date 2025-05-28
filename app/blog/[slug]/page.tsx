import { Metadata } from 'next';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BlogActions } from '@/components/blog/blog-actions';
import { BlogComments } from '@/components/blog/blog-comments';
import { RelatedBlogs } from '@/components/blog/related-blogs';
import { format } from 'date-fns';
import { mockBlogs } from '@/lib/mock-data';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  // In a real app, fetch this data from an API
  const blog = mockBlogs.find((blog) => blog.slug === params.slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog could not be found.',
    };
  }

  return {
    title: `${blog.title} - Blogify`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.createdAt.toISOString(),
      authors: [blog.author.name],
    },
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  // In a real app, fetch this data from an API
  const blog = mockBlogs.find((blog) => blog.slug === params.slug);

  if (!blog) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Blog Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The blog you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/blog">Back to Blogs</a>
          </Button>
        </div>
      </div>
    );
  }

  // Mock content for the blog post
  const content = `
    <p class="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi.</p>
    
    <h2>Introduction</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi.</p>
    
    <p>Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi.</p>
    
    <h2>Main Content</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi.</p>
    
    <blockquote>
      <p>Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi.</p>
    </blockquote>
    
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi.</p>
    
    <h2>Conclusion</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi.</p>
  `;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Blog Header */}
      <div className="mb-8 text-center">
        <Badge className="mb-4">{blog.category}</Badge>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">{blog.title}</h1>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground md:text-lg">
          {blog.excerpt}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={blog.author.image} alt={blog.author.name} />
              <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium">{blog.author.name}</p>
              <p className="text-xs text-muted-foreground">Author</p>
            </div>
          </div>
          <Separator className="hidden h-6 sm:block" orientation="vertical" />
          <div className="text-sm text-muted-foreground">
            <span>{format(blog.createdAt, 'MMMM d, yyyy')}</span>
            <span className="mx-2">•</span>
            <span>{blog.readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Blog Cover Image */}
      <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Blog Actions */}
      <BlogActions blog={blog} />

      {/* Blog Content */}
      <article className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      {/* Blog Actions (Bottom) */}
      <div className="my-8">
        <BlogActions blog={blog} />
      </div>

      {/* Author Bio */}
      <div className="mb-12 rounded-lg bg-muted p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <Avatar className="h-16 w-16">
            <AvatarImage src={blog.author.image} alt={blog.author.name} />
            <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="mb-1 text-lg font-semibold">{blog.author.name}</h3>
            <p className="mb-3 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu
              tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nunc euismod nisi.
            </p>
            <Button variant="outline" size="sm">
              Follow
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Comments</h2>
        <BlogComments blogId={blog.id} />
      </div>

      {/* Related Blogs */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">Related Blogs</h2>
        <RelatedBlogs currentBlogId={blog.id} category={blog.category} />
      </div>
    </div>
  );
}