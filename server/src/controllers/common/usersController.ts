import bcrypt from "bcrypt";

import {
  AccessTokenUserInfo,
  CleanupUnverifiedUsersRequest,
  CleanupUnverifiedUsersResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetTotalUsersCountRequest,
  GetTotalUsersCountResponse,
  GetUserRequest,
  GetUserResponse,
  GetUsersRequest,
  GetUsersResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UpdateUserAvatarRequest,
  UpdateUserAvatarResponse,
  UpdateUserDetailsRequest,
  UpdateUserDetailsResponse,
  UpdateUserPasswordRequest,
  UpdateUserPasswordResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
  ValidIntervals,
} from "@shared/types/apiTypes";
import { IAuthorPermissions, IUser } from "@shared/types/entitiesTypes";

import { getServiceLogger } from "../../config/logger";
import { authorsModel, usersModel } from "../../database";
import { ExtendedRequestHandler } from "../../types/requestHandlerTypes";
import { RgxList } from "../../utils/RgxList";
import { deleteFileFromCloudinary } from "../../utils/deleteFileFromCloudinary";
import { httpStatusText } from "../../utils/httpStatusText";
import { isFileExistsInCloudinary } from "../../utils/isFileExistsInCloudinary";
import { ROLES_LIST } from "../../utils/rolesList";

// Logger for users service
const usersLogger = getServiceLogger("users");

/**
 * Retrieves a paginated list of users.
 * Accepts optional query parameters for pagination (limit and page).
 * Responds with the list of users or an appropriate error message.
 *
 * @param req - Express request object containing optional `limit` and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getUsers: ExtendedRequestHandler<
  GetUsersRequest,
  GetUsersResponse
> = async (req, res, next) => {
  try {
    // Parse pagination parameters with defaults
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;
    const page: number = req.query?.page ? Number(req.query.page) : 1;

    // Ensure valid pagination values
    if (limit <= 0 || page <= 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message:
          "Invalid pagination parameters. Limit and page must be positive integers.",
      });
    }

    const skip: number = (page - 1) * limit;

    // Fetch paginated users
    const users: IUser[] = await usersModel.getUsers(-1, limit, skip);

    // Send response with users and pagination metadata
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Users retrieved successfully.",
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Searches for users based on a search key.
 * Accepts optional query parameters for `searchKey`, `limit`, and `page`.
 * Responds with the list of matching users or an appropriate error message.
 *
 * @param req - Express request object containing `searchKey` in the query and optional `limit` and `page` parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const searchUsers: ExtendedRequestHandler<
  SearchUsersRequest,
  SearchUsersResponse
> = async (req, res, next) => {
  try {
    // Extract and validate search key
    const searchKey: string = req.query?.searchKey || "";
    if (!searchKey.trim()) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Search key is required.",
      });
    }

    // Parse and validate pagination parameters with defaults
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;
    const page: number = req.query?.page ? Number(req.query.page) : 1;
    if (limit <= 0 || page <= 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message:
          "Invalid pagination parameters. Limit and page must be positive integers.",
      });
    }

    const skip: number = (page - 1) * limit;

    // Fetch paginated search results
    const users: IUser[] = await usersModel.searchUsers(
      searchKey,
      -1,
      limit,
      skip,
    );

    // Respond with search results and pagination metadata
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Search results retrieved successfully.",
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves the total count of users in the system.
 * Responds with the total user count or an appropriate error message.
 *
 * @param req - Express request object (unused in this case).
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getTotalUsersCount: ExtendedRequestHandler<
  GetTotalUsersCountRequest,
  GetTotalUsersCountResponse
> = async (_req, res, next) => {
  try {
    const totalUsersCount: number = await usersModel.getUsersCount();

    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Total users count retrieved successfully.",
      data: { totalUsersCount },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes unverified user accounts older than the specified interval.
 * Accessible only by Admin via this route.
 *
 * @param req - Express request object containing an optional `interval` query parameter.
 * @param res - Express response object.
 * @param next - Express next function to handle errors.
 */
export const cleanupUnverifiedUsers: ExtendedRequestHandler<
  CleanupUnverifiedUsersRequest,
  CleanupUnverifiedUsersResponse
> = async (req, res, next) => {
  try {
    const interval = req.query.interval || "1 day"; // Default to "1 day" if not provided

    // Validate interval format (basic validation for common intervals)
    const validIntervals: ValidIntervals[] = [
      "1 day",
      "7 days",
      "30 days",
      "1 hour",
      "12 hours",
    ];
    if (!validIntervals.includes(interval)) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: `Invalid interval. Allowed intervals: ${validIntervals.join(", ")}.`,
      });
    }

    // Call the database method to delete stale unverified users
    const count = await usersModel.deleteStaleUnverifiedUsers(interval);

    usersLogger.info(
      `cleanupUnverifiedUsers: ${count} unverified users older than ${interval} deleted successfully.`,
    );

    res.status(204).send({
      statusText: httpStatusText.SUCCESS,
      message: `${count} unverified users older than ${interval} deleted successfully.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a user by their ID.
 * Verifies that the current user is authorized to access the requested user's data.
 * Responds with the user details or an appropriate error message.
 *
 * @param req - Express request object containing the user ID in the route parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getUser: ExtendedRequestHandler<
  GetUserRequest,
  GetUserResponse
> = async (req, res, next) => {
  const userId = req.params.userId;
  const requesterId = (res.locals.userInfo as AccessTokenUserInfo).user_id;
  const requesterRole = (res.locals.userInfo as AccessTokenUserInfo).role;

  try {
    // Authorization check
    if (requesterRole !== ROLES_LIST.Admin && requesterId !== userId) {
      usersLogger.warn(
        `getUser: Unauthorized access attempt by user {${requesterId}} to user {${userId}}`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "You don't have access to this resource.",
      });
    }

    // Fetch user from the database
    const user = await usersModel.findUserById(userId, [
      "user_id",
      "name",
      "email",
      "role",
      "is_verified",
      "created_at",
      "updated_at",
      "provider",
      "provider_user_id",
    ]);

    if (!user) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Account not found.",
      });
    }

    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "User retrieved successfully.",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates the user's details (name).
 * Verifies that the current user is authorized to make the update.
 *
 * @param req - Express request object containing the user ID in the route parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const updateUserDetails: ExtendedRequestHandler<
  UpdateUserDetailsRequest,
  UpdateUserDetailsResponse
> = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const requesterId = (res.locals.userInfo as AccessTokenUserInfo).user_id;

    // Extract the name field from the request body
    const { name } = req.body;

    // Check if the current user is trying to update their own information (authorization check)
    if (requesterId !== userId) {
      usersLogger.warn(
        `updateUserDetails: Unauthorized update attempt by {${requesterId}} on {${userId}}`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "You don't have access to this resource.", // Forbidden if user is not the owner
      });
    }

    // Prepare an object to store updated fields
    const updatedFields: Partial<IUser> = {};

    // Validate and update the name if provided
    if (name) {
      // Use a regular expression to ensure the name is valid
      if (!RgxList.NAME_REGEX.test(name)) {
        return res.status(400).send({
          statusText: httpStatusText.FAIL,
          message: "Invalid name format.", // Invalid name format error
        });
      }
      updatedFields.name = name; // Update name in the fields to be updated
    }

    // Perform the update in the database
    await usersModel.updateUser(userId, updatedFields);

    usersLogger.info(
      `updateUserDetails: User with ID {${userId}} updated successfully`,
    );

    // Send a success response with a message confirming the update
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "User details updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates the user's role (Only admin who can do this).
 * Verifies that the current user has the right privileges.
 *
 * @param req - Express request object containing the user ID and new role.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const updateUserRole: ExtendedRequestHandler<
  UpdateUserRoleRequest,
  UpdateUserRoleResponse
> = async (req, res, next) => {
  try {
    // Extract user information from the authenticated token (Admin user info)
    const userId = req.params.userId;

    // Extract the role field from the request body
    const { role: newRole } = req.body;

    // Retrieve the target user from the database using the provided user ID
    const user = await usersModel.findUserById(userId, ["user_id", "role"]);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Account not found.", // User account not found error
      });
    }

    // Prevent updating admin 's role
    if (user.role === ROLES_LIST.Admin) {
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "Can not update admin 's role.",
      });
    }

    // Validate the new role to ensure it's one of the allowed roles
    if (newRole !== ROLES_LIST.User && newRole !== ROLES_LIST.Author) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Invalid role.",
      });
    }

    // Update the user's role in the database
    await usersModel.updateUser(req.params.userId, { role: newRole });

    // Create author permissions and avatar if a User is promoted to Author
    if (user.role === ROLES_LIST.User && newRole === ROLES_LIST.Author) {
      // Define the new permissions for the promoted Author
      const newAuthorPermissions: IAuthorPermissions = {
        user_id: user.user_id, // Reference to the user's ID
        create: true, // Grant permissions to create articles
        update: true, // Grant permissions to update articles
        delete: true, // Grant permissions to delete articles
      };

      // Add the new author permissions to the database
      await authorsModel.createAuthorPermissions(
        user.user_id,
        newAuthorPermissions,
      );

      // Add the new author avatar to the database
      await usersModel.setAvatar(
        user.user_id,
        process.env.CLOUDINARY_DEFAULT_AVATAR || "",
      );

      usersLogger.info(`updateUserRole: User {${userId}} upgraded to author`);
    }
    // Remove author permissions if an Author is demoted to a regular User
    else if (user.role === ROLES_LIST.Author && newRole === ROLES_LIST.User) {
      // Delete the author permissions from the database for this user
      await authorsModel.deleteAuthorPermissions(user.user_id);

      // Delete the author avatar from both database and cloudinary for this user
      const authorAvatar = await usersModel.findUserAvatar(user.user_id);
      await usersModel.setAvatar(user.user_id, "");
      if (authorAvatar) await deleteFileFromCloudinary(authorAvatar);

      usersLogger.info(`updateUserRole: Author {${userId}} downgraded to user`);
    }

    // Send a success response confirming the role update
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "User role updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates the user's password.
 * Verifies that the current user has the right credentials and provides a new password.
 *
 * @param req - Express request object containing the user ID, old password, and new password.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const updateUserPassword: ExtendedRequestHandler<
  UpdateUserPasswordRequest,
  UpdateUserPasswordResponse
> = async (req, res, next) => {
  try {
    // Extract user information from the authenticated token
    const userId = req.params.userId;
    const requesterId = (res.locals.userInfo as AccessTokenUserInfo).user_id;

    // Extract the old password and new password fields from the request body
    const { oldPassword, newPassword } = req.body;

    // Validate that both old and new passwords are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "oldPassword and newPassword are required.",
      });
    }

    // Verify if the current user is authorized to update the password for the specified user ID
    if (requesterId !== userId) {
      usersLogger.warn(
        `updateUserPassword: Unauthorized update password attempt by {${requesterId}} on {${userId}}`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "You don't have access to this resource.",
      });
    }

    // Retrieve the user's record from the database including password field
    const user = await usersModel.findUserById(userId, ["user_id", "password"]);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Account not found.",
      });
    }

    // Check if the provided old password matches the stored password hash
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    // If the old password is incorrect, return a 403 error
    if (!isOldPasswordMatch) {
      usersLogger.warn(
        `updateUserPassword: Wrong old password while updating password attempt on {${userId}}`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "Incorrect old password.",
      });
    }

    // Hash the new password for secure storage
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await usersModel.updateUser(userId, { password: hashedPassword });

    usersLogger.info(
      `updateUserPassword: Password updated successfully for {${userId}}`,
    );

    // Send a success response confirming the password update
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Password updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates the user's avatar.
 * Verifies that the current user is authorized to upload a new avatar.
 *
 * @param req - Express request object containing the user ID and new avatar file.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const updateUserAvatar: ExtendedRequestHandler<
  UpdateUserAvatarRequest,
  UpdateUserAvatarResponse
> = async (req, res, next) => {
  try {
    // Extract user information from the authenticated token
    const userId = req.params.userId;
    const requesterId = (res.locals.userInfo as AccessTokenUserInfo).user_id;

    // Extract the avatar field from the request body
    const { avatar: newAvatar } = req.body;

    // Validate that an avatar file is provided in the request
    if (!newAvatar) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "avatar is required.",
      });
    }

    // Ensure that only the account owner can update their avatar
    if (requesterId !== userId) {
      usersLogger.warn(
        `updateUserAvatar: Unauthorized avatar update attempt by {${requesterId}} on {${userId}}`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "You don't have access to this resource.",
      });
    }

    // Check if avatar exists in media storage (Cloudinary)
    if (!(await isFileExistsInCloudinary(newAvatar))) {
      usersLogger.warn(
        `updateUserAvatar: Avatar {${newAvatar}} not found in media storage for user {${userId}}`,
      );
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Avatar is not uploaded to the storage.",
      });
    }

    // Fetch the user's current avatar URL from the database
    const oldUserAvatar = await usersModel.findUserAvatar(userId);

    // Update the user's avatar in the database
    await usersModel.setAvatar(userId, newAvatar);

    // If an old avatar exists and is not the default avatar, delete it from Cloudinary
    if (
      oldUserAvatar &&
      oldUserAvatar !== process.env.CLOUDINARY_DEFAULT_AVATAR
    ) {
      usersLogger.info(
        `updateUserAvatar: Deleting old avatar {${oldUserAvatar}} from Cloudinary for user {${userId}}`,
      );
      await deleteFileFromCloudinary(oldUserAvatar);
    }

    // Log successful avatar update
    usersLogger.info(
      `updateUserAvatar: Avatar updated successfully for user {${userId}}`,
    );

    // Send a success response confirming the avatar update
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Avatar updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a user by their ID.
 * Verifies that the current user is authorized to delete the requested user.
 * Responds with appropriate success or error messages.
 *
 * @param req - Express request object containing the user ID in the route parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const deleteUser: ExtendedRequestHandler<
  DeleteUserRequest,
  DeleteUserResponse
> = async (req, res, next) => {
  const userId = req.params.userId;
  const requesterId = (res.locals.userInfo as AccessTokenUserInfo).user_id;
  const requesterRole = (res.locals.userInfo as AccessTokenUserInfo).role;
  const { password } = req.body;

  usersLogger.info(
    `deleteUser: Request to delete user with ID {${userId}} by {${requesterId}} (${requesterRole})`,
  );

  try {
    // Check if the user has permission to delete the account
    if (requesterRole !== ROLES_LIST.Admin && requesterId !== userId) {
      usersLogger.warn(
        `deleteUser: Unauthorized delete attempt by {${requesterId}} on {${userId}}`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "You don't have access to this resource.",
      });
    }

    // Fetch user to be deleted
    const user = await usersModel.findUserById(userId, [
      "user_id",
      "password",
      "role",
      "provider",
      "provider_user_id",
    ]);
    if (!user) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Account not found.",
      });
    }

    // Prevent deleting admins
    if (user.role === ROLES_LIST.Admin) {
      usersLogger.warn(
        `deleteUser: Attempt to delete admin account {${userId}}`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "Admin cannot be deleted.",
      });
    }

    // Verify password for non-admin and non-oauth user deletion
    if (
      requesterRole !== ROLES_LIST.Admin &&
      !(user.provider && user.provider_user_id)
    ) {
      if (!password) {
        usersLogger.warn(
          `deleteUser: Password not provided for deletion attempt by {${requesterId}}`,
        );
        return res.status(400).send({
          statusText: httpStatusText.FAIL,
          message: "Password is required.",
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        usersLogger.warn(
          `deleteUser: Incorrect password for deletion attempt by {${requesterId}}`,
        );
        return res.status(403).send({
          statusText: httpStatusText.FAIL,
          message: "Wrong password.",
        });
      }
    }

    // Handle avatar deletion if applicable
    const userAvatar = [ROLES_LIST.Admin, ROLES_LIST.Author].includes(user.role)
      ? await usersModel.findUserAvatar(user.user_id)
      : null;

    if (userAvatar && userAvatar !== process.env.CLOUDINARY_DEFAULT_AVATAR) {
      await deleteFileFromCloudinary(userAvatar);
    }

    // Delete the user
    await usersModel.deleteUser(userId);
    usersLogger.info(
      `deleteUser: User with ID {${userId}} deleted successfully`,
    );

    res.status(204).send({
      statusText: httpStatusText.SUCCESS,
      message: "User deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};
