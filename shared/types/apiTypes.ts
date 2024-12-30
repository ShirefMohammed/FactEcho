import {
  IUser,
  ICategory,
  IArticle,
  IUserAvatar,
  IUserResetPasswordToken,
  IAuthor,
  IAuthorPermissions,
} from "./entitiesTypes";

/* Our standard API body response */
export interface ApiBodyResponse<T> {
  statusText: string;
  message: string;
  data?: T;
}

/* Access token payload/UserInfo */
export interface AccessTokenUserInfo {
  user_id: IUser["user_id"];
  role: IUser["role"];
}

/* Types of the req and res body data - optional data field in ApiBodyResponse */

// Auth
export type RegisterRequest = Pick<IUser, "name" | "email" | "password">;
export interface RegisterResponse {}

export type LoginRequest = Pick<IUser, "email" | "password">;
export interface LoginResponse {
  user: Pick<IUser, "user_id" | "name" | "email" | "role"> & {
    avatar: IUserAvatar["avatar"] | null;
  };
  accessToken: string;
}

export interface RefreshRequest {}
export interface RefreshResponse {
  user: Pick<IUser, "user_id" | "name" | "email" | "role"> & {
    avatar: IUserAvatar["avatar"] | null;
  };
  accessToken: string;
}

export type LogoutRequest = null;
export type LogoutResponse = null;

export type VerifyAccountRequest = null;
export type VerifyAccountResponse = string;

export type ForgetPasswordRequest = Pick<IUser, "email">;
export interface ForgetPasswordResponse {}

export type SendResetPasswordFormRequest = null;
export type SendResetPasswordFormResponse = string;

export interface ResetPasswordRequest {
  resetPasswordToken: IUserResetPasswordToken["reset_password_token"];
  newPassword: IUser["password"];
}
export type ResetPasswordResponse = string;

export type LoginWithGoogleRequest = null;
export type LoginWithGoogleResponse = null;


export interface LoginWithGoogleCallbackRequest {}
export interface LoginWithGoogleCallbackResponse {}

export type LoginWithFacebookRequest = null;
export type LoginWithFacebookResponse = null;

export interface LoginWithFacebookCallbackRequest {}
export interface LoginWithFacebookCallbackResponse {
  user: Pick<IUser, "user_id" | "name" | "email" | "role"> & {
    avatar: IUserAvatar["avatar"] | null;
  };
  accessToken: string;
}

// Users
export type GetUsersRequest = null;
export interface GetUsersResponse {
  users: IUser[];
}

export type SearchUsersRequest = null;
export interface SearchUsersResponse {
  users: IUser[];
}

export type GetTotalUsersCountRequest = null;
export interface GetTotalUsersCountResponse {
  totalUsersCount: number;
}

export interface CleanupUnverifiedUsersRequest {}
export interface CleanupUnverifiedUsersResponse {}
export type ValidIntervals = "1 day" | "7 days" | "30 days" | "1 hour" | "12 hours";

export type GetUserRequest = null;
export interface GetUserResponse {
  user: IUser;
}

export type UpdateUserDetailsRequest = Pick<IUser, "name">;
export interface UpdateUserDetailsResponse {}

export type UpdateUserRoleRequest = Pick<IUser, "role">;
export interface UpdateUserRoleResponse {}

export type UpdateUserPasswordRequest = {
  oldPassword: IUser["password"];
  newPassword: IUser["password"];
};
export interface UpdateUserPasswordResponse {}

export type UpdateUserAvatarRequest = Pick<IUserAvatar, "avatar">;
export interface UpdateUserAvatarResponse {}

export interface DeleteUserRequest {
  password: IUser["password"];
}
export interface DeleteUserResponse {}

// Authors
export type GetAuthorsRequest = null;
export interface GetAuthorsResponse {
  authors: IAuthor[];
}

export type SearchAuthorsRequest = null;
export interface SearchAuthorsResponse {
  authors: IAuthor[];
}

export type GetTotalAuthorsCountRequest = null;
export interface GetTotalAuthorsCountResponse {
  totalAuthorsCount: number;
}

export type GetAuthorRequest = null;
export interface GetAuthorResponse {
  author: IAuthor;
}

export type UpdateAuthorPermissionsRequest = {
  permissions: IAuthorPermissions;
};
export interface UpdateAuthorPermissionsResponse {}

export interface GetAuthorArticlesRequest {}
export interface GetAuthorArticlesResponse {
  articles: IArticle[];
}

// Categories
export type GetCategoriesRequest = null;
export interface GetCategoriesResponse {
  categories: ICategory[];
}

export type SearchCategoriesRequest = null;
export interface SearchCategoriesResponse {
  categories: ICategory[];
}

export type GetTotalCategoriesCountRequest = null;
export interface GetTotalCategoriesCountResponse {
  totalCategoriesCount: number;
}

export type GetCategoryRequest = null;
export interface GetCategoryResponse {
  category: ICategory;
}

export type CreateCategoryRequest = Pick<ICategory, "title">;
export interface CreateCategoryResponse {
  newCategory: ICategory;
}

export type UpdateCategoryRequest = Pick<ICategory, "title">;
export interface UpdateCategoryResponse {
  updatedCategory: ICategory;
}

export interface DeleteCategoryRequest {}
export interface DeleteCategoryResponse {}

export interface GetCategoryArticlesRequest {}
export interface GetCategoryArticlesResponse {
  articles: IArticle[];
}

// Articles
export type GetArticlesRequest = null;
export interface GetArticlesResponse {
  articles: IArticle[];
}

export type SearchArticlesRequest = null;
export interface SearchArticlesResponse {
  articles: IArticle[];
}

export type GetTotalArticlesCountRequest = null;
export interface GetTotalArticlesCountResponse {
  totalArticlesCount: number;
}

export type GetExploredArticlesRequest = null;
export interface GetExploredArticlesResponse {
  articles: IArticle[];
}

export type GetTrendArticlesRequest = null;
export interface GetTrendArticlesResponse {
  articles: IArticle[];
}

export type GetLatestArticlesRequest = null;
export interface GetLatestArticlesResponse {
  articles: IArticle[];
}

export type GetArticleRequest = null;
export interface GetArticleResponse {
  article: IArticle;
}

export type CreateArticleRequest = Pick<
  IArticle,
  "title" | "image" | "content" | "category_id"
>;
export interface CreateArticleResponse {
  newArticle: IArticle;
}

export type UpdateArticleRequest = Pick<
  IArticle,
  "title" | "image" | "content" | "category_id"
>;
export interface UpdateArticleResponse {
  updatedArticle: IArticle;
}

export interface DeleteArticleRequest {}
export interface DeleteArticleResponse {}

export interface GetSavedArticlesRequest {}
export interface GetSavedArticlesResponse {
  articles: IArticle[];
}

export interface IsArticleSavedRequest {}
export interface IsArticleSavedResponse {
  isArticleSaved: boolean;
}

export interface SaveArticleRequest {}
export interface SaveArticleResponse {}

export interface UnsaveArticleRequest {}
export interface UnsaveArticleResponse {}
