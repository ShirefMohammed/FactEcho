/* Entities Types */
export interface IUser extends IUserOAuth {
  user_id: string; // UUID
  name: string;
  email: string;
  password: string;
  is_verified: boolean;
  role: number;
  created_at: string;
  updated_at: string;
}

export interface IUserOAuth {
  user_id: string; // UUID
  provider: string;
  provider_user_id: string;
}

export interface IAuthor extends IUser {
  avatar: IUserAvatar["avatar"];
  permissions: IAuthorPermissions;
}

export interface IUserVerificationToken {
  user_id: string; // UUID
  verification_token: string;
}

export interface IUserResetPasswordToken {
  user_id: string; // UUID
  reset_password_token: string;
}

export interface IUserAvatar {
  user_id: string; // UUID
  avatar: string; // Storage file path
}

export interface ICategory {
  category_id: string; // UUID
  title: string;
  created_at: string;
  updated_at: string;
  creator_id: string | null; // UUID or null if the user is deleted
}

export interface IArticle {
  article_id: string; // UUID
  title: string;
  content: string;
  image: string; // Storage file path
  views: number; // Default to 0
  created_at: string;
  updated_at: string;
  category_id: string | null; // UUID or null if the category is deleted
  creator_id: string | null; // UUID or null if the user is deleted
}

export interface IUserSavedArticle {
  user_id: string; // UUID
  article_id: string; // UUID
}

export interface IAuthorPermissions {
  user_id: string; // UUID
  create: boolean;
  update: boolean;
  delete: boolean;
}

/* Entities Fields Types */
export type UserFields = keyof IUser;

export type UserOAuthFields = keyof IUserOAuth;

export type AuthorFields = keyof IAuthor;

export type UserVerificationTokenFields = keyof IUserVerificationToken;

export type UserResetPasswordTokenFields = keyof IUserResetPasswordToken;

export type UserAvatarFields = keyof IUserAvatar;

export type CategoryFields = keyof ICategory;

export type ArticleFields = keyof IArticle;

export type UserSavedArticleFields = keyof IUserSavedArticle;

export type AuthorPermissionsFields = keyof IAuthorPermissions;
