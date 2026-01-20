import { gql } from "@apollo/client";

// ==========================================
// BLOG QUERIES
// ==========================================

/**
 * Get paginated list of blogs
 */
export const GET_BLOGS = gql`
  query GetBlogs($page: Int, $limit: Int) {
    blogs(page: $page, limit: $limit) {
      blogs {
        id
        slug
        title
        description
        date
        image
        readingTime
        featured
        viewCount
        author {
          id
          username
          name
          avatar
        }
        categories {
          id
          name
        }
        tags {
          id
          name
        }
        likeCount
        commentCount
        bookmarkCount
      }
      pagination {
        totalCount
        totalPages
        currentPage
        limit
      }
    }
  }
`;

/**
 * Get a single blog by slug or ID (with full content)
 */
export const GET_BLOG = gql`
  query GetBlog($slug: String, $id: ID) {
    blog(slug: $slug, id: $id) {
      id
      slug
      title
      description
      date
      image
      content
      readingTime
      featured
      createdAt
      updatedAt
      viewCount
      author {
        id
        username
        name
        avatar
      }
      categories {
        id
        name
      }
      tags {
        id
        name
      }
      likeCount
      commentCount
      bookmarkCount
    }
  }
`;

/**
 * Search blogs
 */
export const SEARCH_BLOGS = gql`
  query SearchBlogs($query: String!, $page: Int, $limit: Int) {
    searchBlogs(query: $query, page: $page, limit: $limit) {
      blogs {
        id
        slug
        title
        description
        date
        image
        readingTime
        featured
        viewCount
        author {
          id
          username
          name
          avatar
        }
        categories {
          id
          name
        }
        tags {
          id
          name
        }
        likeCount
        commentCount
        bookmarkCount
      }
      pagination {
        totalCount
        totalPages
        currentPage
        limit
      }
    }
  }
`;

/**
 * Get featured blogs
 */
export const GET_FEATURED_BLOGS = gql`
  query GetFeaturedBlogs($limit: Int) {
    featuredBlogs(limit: $limit) {
      featuredBlogs {
        id
        slug
        title
        description
        date
        image
        readingTime
        viewCount
        author {
          id
          username
          name
          avatar
        }
        categories {
          id
          name
        }
        likeCount
        commentCount
      }
    }
  }
`;

/**
 * Get blogs by category
 */
export const GET_BLOGS_BY_CATEGORY = gql`
  query GetBlogsByCategory($category: String!, $page: Int, $limit: Int) {
    blogsByCategory(category: $category, page: $page, limit: $limit) {
      category
      blogs {
        id
        slug
        title
        description
        date
        image
        readingTime
        viewCount
        author {
          id
          username
          name
          avatar
        }
        categories {
          id
          name
        }
        tags {
          id
          name
        }
        likeCount
        commentCount
        bookmarkCount
      }
      pagination {
        totalCount
        totalPages
        currentPage
        limit
      }
    }
  }
`;

/**
 * Get blogs by tags
 */
export const GET_BLOGS_BY_TAGS = gql`
  query GetBlogsByTags($tags: String!, $page: Int, $limit: Int) {
    blogsByTags(tags: $tags, page: $page, limit: $limit) {
      blogs {
        id
        slug
        title
        description
        date
        image
        readingTime
        viewCount
        author {
          id
          username
          name
          avatar
        }
        categories {
          id
          name
        }
        tags {
          id
          name
        }
        likeCount
        commentCount
        bookmarkCount
      }
      pagination {
        totalCount
        totalPages
        currentPage
        limit
      }
    }
  }
`;

// ==========================================
// USER QUERIES
// ==========================================

/**
 * Get user profile by username
 */
export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    user(username: $username) {
      id
      email
      username
      name
      bio
      avatar
      country
      twitterAcc
      githubAcc
      linkedinAcc
      anotherAcc
      createdAt
      profileViews
      followerCount
      followingCount
      blogCount
      totalViews
      blogs {
        blogs {
          id
          slug
          title
          description
          date
          image
          readingTime
          viewCount
          likeCount
          commentCount
        }
        pagination {
          totalCount
          totalPages
          currentPage
          limit
        }
      }
    }
  }
`;

// ==========================================
// METADATA QUERIES
// ==========================================

/**
 * Get all categories
 */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

/**
 * Get all tags
 */
export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
    }
  }
`;

// ==========================================
// HOMEPAGE QUERY (Combined for efficiency)
// ==========================================

/**
 * Homepage query - fetches featured blogs and recent blogs in one request
 */
export const GET_HOMEPAGE_DATA = gql`
  query GetHomepageData($featuredLimit: Int, $blogsPage: Int, $blogsLimit: Int) {
    featuredBlogs(limit: $featuredLimit) {
      featuredBlogs {
        id
        slug
        title
        description
        date
        image
        readingTime
        viewCount
        author {
          id
          username
          name
          avatar
        }
        categories {
          id
          name
        }
        likeCount
        commentCount
      }
    }
    blogs(page: $blogsPage, limit: $blogsLimit) {
      blogs {
        id
        slug
        title
        description
        date
        image
        readingTime
        featured
        viewCount
        author {
          id
          username
          name
          avatar
        }
        categories {
          id
          name
        }
        tags {
          id
          name
        }
        likeCount
        commentCount
        bookmarkCount
      }
      pagination {
        totalCount
        totalPages
        currentPage
        limit
      }
    }
    categories {
      id
      name
    }
  }
`;
