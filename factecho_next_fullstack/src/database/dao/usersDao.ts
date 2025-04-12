import {
  IUser,
  IUserAvatar,
  IUserOAuth,
  IUserResetPasswordToken,
  IUserVerificationToken,
  UserFields,
} from "@/types/entitiesTypes";

export interface UsersDao {
  /* ===== Create Operations ===== */

  // Creates a new user
  createUser(user: Partial<IUser>): Promise<Partial<IUser>>;

  /* ===== Read Operations ===== */

  // Finds a user by ID, with specific fields to select
  findUserById(userId: IUser["user_id"], selectedFields?: UserFields[]): Promise<IUser | null>;

  // Finds a user by email, with specific fields to select
  findUserByEmail(email: IUser["email"], selectedFields?: UserFields[]): Promise<IUser | null>;

  // Finds a user by OAuth, with specific fields to select
  findUserByOAuth(
    provider: IUserOAuth["provider"],
    provider_user_id: IUserOAuth["provider_user_id"],
    selectedFields?: UserFields[],
  ): Promise<IUser | null>;

  // Finds a user by verification token, with specific fields to select
  findUserByVerificationToken(
    verificationToken: IUserVerificationToken["verification_token"],
    selectedFields?: UserFields[],
  ): Promise<IUser | null>;

  // Finds a user by reset password token, with specific fields to select
  findUserByResetPasswordToken(
    resetPasswordToken: IUserResetPasswordToken["reset_password_token"],
    selectedFields?: UserFields[],
  ): Promise<IUser | null>;

  // Finds user avatar
  findUserAvatar(userId: IUser["user_id"]): Promise<IUserAvatar["avatar"] | null>;

  // Retrieves multiple users with optional order, limit, skip, and selected fields
  getUsers(
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: UserFields[],
  ): Promise<IUser[]>;

  // Get users count
  getUsersCount(): Promise<number>;

  // Searches for users based on a search key, with optional order, limit, skip, and selected fields
  searchUsers(
    searchKey: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: UserFields[],
  ): Promise<IUser[]>;

  /* ===== Update Operations ===== */

  // Updates an existing user by ID
  updateUser(userId: IUser["user_id"], user: Partial<IUser>): Promise<Partial<IUser>>;

  // Sets a verification token for a user
  setVerificationToken(
    userId: IUser["user_id"],
    verificationToken: IUserVerificationToken["verification_token"],
  ): Promise<void>;

  // Sets a reset password token for a user
  setResetPasswordToken(
    userId: IUser["user_id"],
    resetPasswordToken: IUserResetPasswordToken["reset_password_token"],
  ): Promise<void>;

  // Sets an avatar for a user
  setAvatar(userId: IUser["user_id"], avatar: IUserAvatar["avatar"]): Promise<void>;

  /* ===== Delete Operations ===== */

  // Deletes a user by ID
  deleteUser(userId: IUser["user_id"]): Promise<void>;

  // Deletes unverified users that have been stale for the specified interval
  deleteStaleUnverifiedUsers(interval: string): Promise<number>;
}
