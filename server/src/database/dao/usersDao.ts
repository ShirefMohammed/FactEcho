import { IUser, IUserAvatar, UserFields } from "@shared/types/entitiesTypes";

export interface UsersDao {
  // Finds a user by ID, with specific fields to select
  findUserById(
    userId: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null>;

  // Finds a user by email, with specific fields to select
  findUserByEmail(
    email: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null>;

  // Finds a user by OAuth, with specific fields to select
  findUserByOAuth(
    provider: string,
    provider_user_id: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null>;

  // Finds user avatar
  findUserAvatar(userId: string): Promise<IUserAvatar["avatar"] | null>;

  // Finds a user by verification token, with specific fields to select
  findUserByVerificationToken(
    verificationToken: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null>;

  // Finds a user by reset password token, with specific fields to select
  findUserByResetPasswordToken(
    resetPasswordToken: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null>;

  // Creates a new user
  createUser(user: Partial<IUser>): Promise<void>;

  // Updates an existing user by ID
  updateUser(userId: string, user: Partial<IUser>): Promise<void>;

  // Sets a verification token for a user
  setVerificationToken(
    userId: string,
    verificationToken: string,
  ): Promise<void>;

  // Sets a reset password token for a user
  setResetPasswordToken(
    userId: string,
    resetPasswordToken: string,
  ): Promise<void>;

  // Sets an avatar for a user
  setAvatar(userId: string, avatar: string): Promise<void>;

  // Deletes a user by ID
  deleteUser(userId: string): Promise<void>;

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

  // Deletes unverified users that have been stale for the specified interval
  deleteStaleUnverifiedUsers(interval: string): Promise<void>;
}
