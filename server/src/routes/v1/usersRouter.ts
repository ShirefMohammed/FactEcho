import express from "express";

import {
  cleanupUnverifiedUsers,
  deleteUser,
  getTotalUsersCount,
  getUser,
  getUsers,
  searchUsers,
  updateUserAvatar,
  updateUserDetails,
  updateUserPassword,
  updateUserRole,
} from "../../controllers/v1/usersController";
import { verifyJWT } from "../../middleware/verifyJWT";
import { verifyRole } from "../../middleware/verifyRole";
import { ROLES_LIST } from "../../utils/rolesList";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users.
 *     description: Fetches users with optional pagination. Accessible only by Admin.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of users per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Users successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: User object structure.
 *       400:
 *         description: Invalid pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Invalid pagination parameters. Limit and page must be positive integers."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.route("/").get(verifyJWT, verifyRole(ROLES_LIST.Admin), getUsers);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search for users based on a search key.
 *     description: Searches for users using a search key with optional pagination. Accessible only by Admin.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     parameters:
 *       - name: searchKey
 *         in: query
 *         description: The keyword to search for users.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Shiref"
 *       - name: limit
 *         in: query
 *         description: Number of users per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Search results successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Search results retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: User object structure.
 *       400:
 *         description: Invalid search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Invalid search key or pagination parameters."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router
  .route("/search")
  .get(verifyJWT, verifyRole(ROLES_LIST.Admin), searchUsers);

/**
 * @swagger
 * /users/count:
 *   get:
 *     summary: Retrieve the total count of users.
 *     description: Fetches the total number of users in the system. Accessible only by Admin.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     responses:
 *       200:
 *         description: Total users count successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Total users count retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsersCount:
 *                       type: integer
 *                       example: 350
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router
  .route("/count")
  .get(verifyJWT, verifyRole(ROLES_LIST.Admin), getTotalUsersCount);

/**
 * @swagger
 * /users/unverified-cleanup:
 *   delete:
 *     summary: Delete stale unverified user accounts.
 *     description: Deletes unverified user accounts older than a specified interval (e.g., 1 day). Accessible only by Admin.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Unverified accounts successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Unverified users older than 1 day deleted successfully."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router
  .route("/unverified-cleanup")
  .delete(verifyJWT, verifyRole(ROLES_LIST.Admin), cleanupUnverifiedUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Retrieve a user by their ID.
 *     description: Fetches a user's details by ID. Only Admins or the account owner can perform this action.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: User object structure.
 *       403:
 *         description: Access denied.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "You don't have access to this resource."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Account not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Deletes a user by ID.
 *     description: Deletes a user account by their ID. Only Admins or the account owner can perform this action.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to be deleted.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Password for verification if the requester is not an Admin.
 *                 example: "P@ssw0rd"
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       400:
 *         description: Password required for non-Admin and non-oauth users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Password is required."
 *       403:
 *         description: Unauthorized access or cannot delete Admin account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "You don't have access to this resource."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Account not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.route("/:userId").get(verifyJWT, getUser).delete(verifyJWT, deleteUser);

/**
 * @swagger
 * /users/{userId}/details:
 *   patch:
 *     summary: Updates the user's details (name).
 *     description: Updates a user's name. Only the user themselves can update their details.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to be updated.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the user.
 *                 example: "Shiref_Mohammed_Updated"
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "User details updated successfully."
 *       400:
 *         description: Invalid data format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Invalid data format."
 *       403:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "You don't have access to this resource."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.route("/:userId/details").patch(verifyJWT, updateUserDetails);

/**
 * @swagger
 * /users/{userId}/role:
 *   patch:
 *     summary: Update a user's role.
 *     description: Allows Admin users to update the role of a specific user.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: [] # Bearer token authentication
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: number
 *                 enum: [User role, Author role]
 *                 description: The new role to assign.
 *                 example: "2001"
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "User role updated successfully."
 *       400:
 *         description: Invalid role provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Invalid role."
 *       403:
 *         description: Unauthorized access to update role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "You don't have access to this resource."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Account not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router
  .route("/:userId/role")
  .patch(verifyJWT, verifyRole(ROLES_LIST.Admin), updateUserRole);

/**
 * @swagger
 * /users/{userId}/password:
 *   patch:
 *     summary: Update a user's password.
 *     description: |
 *       Updates the user's password by verifying that the requester is the account owner
 *       has provided the correct old password and a new password.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: [] # Bearer token authentication
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose password is being updated.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's old password.
 *               newPassword:
 *                 type: string
 *                 description: The new password to set for the user.
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully."
 *       400:
 *         description: Bad Request. Missing old or new password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "oldPassword and newPassword are required."
 *       403:
 *         description: Forbidden. The requester is not authorized to update the password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "You don't have access to this resource."
 *       404:
 *         description: Not Found. User account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Account not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.route("/:userId/password").patch(verifyJWT, updateUserPassword);

/**
 * @swagger
 * /users/{userId}/avatar:
 *   patch:
 *     summary: Update a user's avatar.
 *     description: |
 *       Updates the user's avatar by verifying that the requester (the user themselves)
 *       has provided a new avatar and that the avatar exists in the media storage (Cloudinary).
 *       The previous avatar, if not the default, will be deleted from Cloudinary.
 *     tags: [Users_V1]
 *     security:
 *       - BearerAuth: [] # Bearer token authentication
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose avatar is being updated.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 description: The new avatar to set for the user.
 *                 example: "https://example.com/new-avatar.jpg"
 *     responses:
 *       200:
 *         description: Avatar updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Avatar updated successfully."
 *       400:
 *         description: Bad Request. Missing avatar or avatar not found in storage.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "avatar is required."
 *       403:
 *         description: Forbidden. The requester is not authorized to update the avatar.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "You don't have access to this resource."
 *       404:
 *         description: Not Found. User account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Account not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router
  .route("/:userId/avatar")
  .patch(
    verifyJWT,
    verifyRole(ROLES_LIST.Admin, ROLES_LIST.Author),
    updateUserAvatar,
  );

export default router;
