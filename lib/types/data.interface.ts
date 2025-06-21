export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  bio?: string;
  avatar?: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
  blogs?: BlogPost[];
  comments?: Comment[];
  followers?: Follow[];
  country: string;
  following?: Follow[];
  viewedBlogs?: BlogView[];
  twitterAcc: string;
  githubAcc: string;
  linkedinAcc: string;
  anotherAcc: string;
  _count?: any;
}

export interface UpdateProfileData {
  name: string;
  bio: string;
  country: string;
  twitterAcc: string;
  githubAcc: string;
  linkedinAcc: string;
  anotherAcc: string;
  avatar?: File;
  username?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  date: Date | any;
  featured: boolean;
  image: string;
  readingTime: number;
  categories: string[];
  tags: string[];
  author: {
    id: string;
    name: string;
    bio: string;
    avatar?: string;
    username?: string;
  };
  authorId: string;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  liked: boolean; // hanya jika ada userId
  bookmarked: boolean; // hanya jika ada userId
}

export interface Comment {
  id: string;
  username?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  blogId: string;
  authorId: string;
  blog?: BlogPost;
  author?: User;
  replies?: Comment[];
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
  blog?: BlogPost;
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
  blog?: BlogPost;
  category?: Category;
}

export interface TagOnBlog {
  blogId: string;
  tagId: string;
  blog?: BlogPost;
  tag?: Tag;
}
