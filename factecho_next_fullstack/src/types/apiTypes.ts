import { NextRequest } from "next/server";

import {
  IArticle,
  IAuthor,
  IAuthorPermissions,
  ICategory,
  IUser,
  IUserAvatar,
  IUserResetPasswordToken,
  IUserVerificationToken,
} from "./entitiesTypes";

/* Our standard API body response */
export interface ApiBodyResponse<T> {
  statusText: string;
  message: string;
  data?: T;
}

/* Next auth session */
export interface NextAuthUserSession extends IUser {
  avatar: IUserAvatar["avatar"];
}

/* Types of the req and res body data - optional data field in ApiBodyResponse */

// Auth
export type RegisterRequest = Pick<IUser, "name" | "email" | "password">;
export type RegisterResponse = null;

export interface VerifyAccountRequest {
  verificationToken: IUserVerificationToken["verification_token"];
}
export type VerifyAccountResponse = null;

export type ForgetPasswordRequest = Pick<IUser, "email">;
export type ForgetPasswordResponse = null;

export interface ResetPasswordRequest {
  resetPasswordToken: IUserResetPasswordToken["reset_password_token"];
  newPassword: IUser["password"];
}
export type ResetPasswordResponse = null;

export type CheckUserExistenceRequest = Pick<IUser, "user_id" | "role">;
export type CheckUserExistenceResponse = null;

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

export type CleanupUnverifiedUsersRequest = null;
export type CleanupUnverifiedUsersResponse = null;
export type ValidIntervals = "1 day" | "7 days" | "30 days" | "1 hour" | "12 hours";

export type GetUserRequest = null;
export interface GetUserResponse {
  user: IUser;
}

export type UpdateUserDetailsRequest = Pick<IUser, "name">;
export type UpdateUserDetailsResponse = null;

export type UpdateUserRoleRequest = Pick<IUser, "role">;
export type UpdateUserRoleResponse = null;

export type UpdateUserPasswordRequest = {
  oldPassword: IUser["password"];
  newPassword: IUser["password"];
};
export type UpdateUserPasswordResponse = null;

export type UpdateUserAvatarRequest = Pick<IUserAvatar, "avatar">;
export type UpdateUserAvatarResponse = null;

export interface DeleteUserRequest {
  password: IUser["password"];
}
export type DeleteUserResponse = null;

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
export type UpdateAuthorPermissionsResponse = null;

export type GetAuthorArticlesRequest = null;
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

export type DeleteCategoryRequest = null;
export type DeleteCategoryResponse = null;

export type GetCategoryArticlesRequest = null;
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

export type CreateArticleRequest = Pick<IArticle, "title" | "image" | "content" | "category_id">;
export interface CreateArticleResponse {
  newArticle: IArticle;
}

export type UpdateArticleRequest = Pick<IArticle, "title" | "image" | "content" | "category_id">;
export interface UpdateArticleResponse {
  updatedArticle: IArticle;
}

export type DeleteArticleRequest = null;
export type DeleteArticleResponse = null;

export type GetSavedArticlesRequest = null;
export interface GetSavedArticlesResponse {
  articles: IArticle[];
}

export type IsArticleSavedRequest = null;
export interface IsArticleSavedResponse {
  isArticleSaved: boolean;
}

export type SaveArticleRequest = null;
export type SaveArticleResponse = null;

export type UnsaveArticleRequest = null;
export type UnsaveArticleResponse = null;
