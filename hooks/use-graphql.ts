"use client";

import { useQuery } from "@apollo/client";
import {
    GET_BLOGS,
    GET_BLOG,
    SEARCH_BLOGS,
    GET_FEATURED_BLOGS,
    GET_BLOGS_BY_CATEGORY,
    GET_BLOGS_BY_TAGS,
    GET_USER_PROFILE,
    GET_CATEGORIES,
    GET_TAGS,
    GET_HOMEPAGE_DATA,
} from "@/lib/graphql-queries";

// ==========================================
// BLOG HOOKS
// ==========================================

/**
 * Hook to fetch paginated blogs
 */
export function useBlogs(page = 1, limit = 10) {
    const { data, loading, error, fetchMore, refetch } = useQuery(GET_BLOGS, {
        variables: { page, limit },
    });

    const loadMore = () => {
        if (data?.blogs?.pagination) {
            const { currentPage, totalPages } = data.blogs.pagination;
            if (currentPage < totalPages) {
                return fetchMore({
                    variables: { page: currentPage + 1, limit },
                });
            }
        }
        return Promise.resolve();
    };

    return {
        blogs: data?.blogs?.blogs || [],
        pagination: data?.blogs?.pagination,
        loading,
        error,
        loadMore,
        refetch,
        hasMore: data?.blogs?.pagination
            ? data.blogs.pagination.currentPage < data.blogs.pagination.totalPages
            : false,
    };
}

/**
 * Hook to fetch a single blog by slug or ID
 */
export function useBlog(slug?: string, id?: string) {
    const { data, loading, error, refetch } = useQuery(GET_BLOG, {
        variables: { slug, id },
        skip: !slug && !id,
    });

    return {
        blog: data?.blog,
        loading,
        error,
        refetch,
    };
}

/**
 * Hook to search blogs
 */
export function useSearchBlogs(query: string, page = 1, limit = 10) {
    const { data, loading, error, fetchMore, refetch } = useQuery(SEARCH_BLOGS, {
        variables: { query, page, limit },
        skip: !query,
    });

    const loadMore = () => {
        if (data?.searchBlogs?.pagination) {
            const { currentPage, totalPages } = data.searchBlogs.pagination;
            if (currentPage < totalPages) {
                return fetchMore({
                    variables: { query, page: currentPage + 1, limit },
                });
            }
        }
        return Promise.resolve();
    };

    return {
        blogs: data?.searchBlogs?.blogs || [],
        pagination: data?.searchBlogs?.pagination,
        loading,
        error,
        loadMore,
        refetch,
        hasMore: data?.searchBlogs?.pagination
            ? data.searchBlogs.pagination.currentPage <
            data.searchBlogs.pagination.totalPages
            : false,
    };
}

/**
 * Hook to fetch featured blogs
 */
export function useFeaturedBlogs(limit = 5) {
    const { data, loading, error, refetch } = useQuery(GET_FEATURED_BLOGS, {
        variables: { limit },
    });

    return {
        featuredBlogs: data?.featuredBlogs?.featuredBlogs || [],
        loading,
        error,
        refetch,
    };
}

/**
 * Hook to fetch blogs by category
 */
export function useBlogsByCategory(category: string, page = 1, limit = 10) {
    const { data, loading, error, fetchMore, refetch } = useQuery(
        GET_BLOGS_BY_CATEGORY,
        {
            variables: { category, page, limit },
            skip: !category,
        }
    );

    const loadMore = () => {
        if (data?.blogsByCategory?.pagination) {
            const { currentPage, totalPages } = data.blogsByCategory.pagination;
            if (currentPage < totalPages) {
                return fetchMore({
                    variables: { category, page: currentPage + 1, limit },
                });
            }
        }
        return Promise.resolve();
    };

    return {
        category: data?.blogsByCategory?.category,
        blogs: data?.blogsByCategory?.blogs || [],
        pagination: data?.blogsByCategory?.pagination,
        loading,
        error,
        loadMore,
        refetch,
        hasMore: data?.blogsByCategory?.pagination
            ? data.blogsByCategory.pagination.currentPage <
            data.blogsByCategory.pagination.totalPages
            : false,
    };
}

/**
 * Hook to fetch blogs by tags
 */
export function useBlogsByTags(tags: string, page = 1, limit = 10) {
    const { data, loading, error, fetchMore, refetch } = useQuery(
        GET_BLOGS_BY_TAGS,
        {
            variables: { tags, page, limit },
            skip: !tags,
        }
    );

    const loadMore = () => {
        if (data?.blogsByTags?.pagination) {
            const { currentPage, totalPages } = data.blogsByTags.pagination;
            if (currentPage < totalPages) {
                return fetchMore({
                    variables: { tags, page: currentPage + 1, limit },
                });
            }
        }
        return Promise.resolve();
    };

    return {
        blogs: data?.blogsByTags?.blogs || [],
        pagination: data?.blogsByTags?.pagination,
        loading,
        error,
        loadMore,
        refetch,
        hasMore: data?.blogsByTags?.pagination
            ? data.blogsByTags.pagination.currentPage <
            data.blogsByTags.pagination.totalPages
            : false,
    };
}

// ==========================================
// USER HOOKS
// ==========================================

/**
 * Hook to fetch user profile by username
 */
export function useUserProfile(username: string) {
    const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
        variables: { username },
        skip: !username,
    });

    return {
        user: data?.user,
        loading,
        error,
        refetch,
    };
}

// ==========================================
// METADATA HOOKS
// ==========================================

/**
 * Hook to fetch all categories
 */
export function useCategories() {
    const { data, loading, error, refetch } = useQuery(GET_CATEGORIES);

    return {
        categories: data?.categories || [],
        loading,
        error,
        refetch,
    };
}

/**
 * Hook to fetch all tags
 */
export function useTags() {
    const { data, loading, error, refetch } = useQuery(GET_TAGS);

    return {
        tags: data?.tags || [],
        loading,
        error,
        refetch,
    };
}

// ==========================================
// HOMEPAGE HOOK
// ==========================================

/**
 * Hook to fetch homepage data (featured blogs, recent blogs, categories)
 * This fetches all data in a single GraphQL request for efficiency
 */
export function useHomepageData(
    featuredLimit = 5,
    blogsPage = 1,
    blogsLimit = 10
) {
    const { data, loading, error, fetchMore, refetch } = useQuery(
        GET_HOMEPAGE_DATA,
        {
            variables: { featuredLimit, blogsPage, blogsLimit },
        }
    );

    const loadMoreBlogs = () => {
        if (data?.blogs?.pagination) {
            const { currentPage, totalPages } = data.blogs.pagination;
            if (currentPage < totalPages) {
                return fetchMore({
                    variables: {
                        featuredLimit,
                        blogsPage: currentPage + 1,
                        blogsLimit,
                    },
                });
            }
        }
        return Promise.resolve();
    };

    return {
        featuredBlogs: data?.featuredBlogs?.featuredBlogs || [],
        blogs: data?.blogs?.blogs || [],
        blogsPagination: data?.blogs?.pagination,
        categories: data?.categories || [],
        loading,
        error,
        loadMoreBlogs,
        refetch,
        hasMoreBlogs: data?.blogs?.pagination
            ? data.blogs.pagination.currentPage < data.blogs.pagination.totalPages
            : false,
    };
}
