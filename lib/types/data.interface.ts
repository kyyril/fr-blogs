export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
  blogs?: Blog[];
  comments?: Comment[];
  followers?: Follow[];
  following?: Follow[];
  viewedBlogs?: BlogView[];
  profileViews: number;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: Date;
  image: string;
  content: string;
  readingTime: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  categories?: CategoryOnBlog[];
  tags?: TagOnBlog[];
  comments?: Comment[];
  views?: BlogView[];
  viewCount: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  blogId: string;
  authorId: string;
  blog?: Blog;
  author?: User;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  follower?: User;
  following?: User;
}

export interface BlogView {
  id: string;
  blogId: string;
  userId: string;
  createdAt: Date;
  blog?: Blog;
  user?: User;
}

export interface Category {
  id: string;
  name: string;
  blogs?: CategoryOnBlog[];
}

export interface Tag {
  id: string;
  name: string;
  blogs?: TagOnBlog[];
}

export interface CategoryOnBlog {
  blogId: string;
  categoryId: string;
  blog?: Blog;
  category?: Category;
}

export interface TagOnBlog {
  blogId: string;
  tagId: string;
  blog?: Blog;
  tag?: Tag;
}
