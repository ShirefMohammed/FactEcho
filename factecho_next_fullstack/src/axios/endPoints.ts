export const endPoints = {
  auth: {
    register: "/auth/register",
    forgetPassword: "/auth/forget-password",
    verifyAccount: "/auth/verify-account",
    resetPassword: "/auth/reset-password",
    checkUserExistence: "/auth/check-user-existence",
  },

  users: {
    getAll: "/users",
    search: "/users/search",
    count: "/users/count",
    unverifiedCleanup: "/users/unverified-cleanup",
    getById: (userId: string) => `/users/${userId}`,
    deleteById: (userId: string) => `/users/${userId}`,
    updateDetails: (userId: string) => `/users/${userId}/details`,
    updateRole: (userId: string) => `/users/${userId}/role`,
    updatePassword: (userId: string) => `/users/${userId}/password`,
    updateAvatar: (userId: string) => `/users/${userId}/avatar`,
  },

  authors: {
    getAll: "/authors",
    search: "/authors/search",
    count: "/authors/count",
    getById: (authorId: string) => `/authors/${authorId}`,
    updatePermissions: (authorId: string) => `/authors/${authorId}/permissions`,
    getArticles: (authorId: string) => `/authors/${authorId}/articles`,
  },

  categories: {
    getAll: "/categories",
    create: "/categories",
    search: "/categories/search",
    count: "/categories/count",
    getById: (categoryId: string) => `/categories/${categoryId}`,
    update: (categoryId: string) => `/categories/${categoryId}`,
    delete: (categoryId: string) => `/categories/${categoryId}`,
    getArticles: (categoryId: string) => `/categories/${categoryId}/articles`,
  },

  articles: {
    getAll: "/articles",
    create: "/articles",
    search: "/articles/search",
    count: "/articles/count",
    explore: "/articles/explore",
    trend: "/articles/trend",
    latest: "/articles/latest",
    saved: "/articles/saved",
    getById: (articleId: string) => `/articles/${articleId}`,
    update: (articleId: string) => `/articles/${articleId}`,
    delete: (articleId: string) => `/articles/${articleId}`,
    isSaved: (articleId: string) => `/articles/${articleId}/save`,
    save: (articleId: string) => `/articles/${articleId}/save`,
    unsave: (articleId: string) => `/articles/${articleId}/save`,
  },
};
