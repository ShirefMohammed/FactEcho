import express from "express";

import {
  forgetPassword,
  login,
  loginWithFacebook,
  loginWithFacebookCallback,
  loginWithGoogle,
  loginWithGoogleCallback,
  logout,
  refresh,
  register,
  resetPassword,
  sendResetPasswordForm,
  verifyAccount,
} from "../../controllers/v1/authController";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     description: Creates a new user account, validates input, hashes the password, and sends a verification email.
 *     tags: [Auth_V1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Shiref_Mohammed"
 *                 description: User's name (4-24 characters, letters, numbers, underscores, hyphens).
 *               email:
 *                 type: string
 *                 example: "shirefmo012345@gmail.com"
 *                 description: A valid email address.
 *               password:
 *                 type: string
 *                 example: "P@ssw0rd"
 *                 description: 8-24 characters, includes uppercase, lowercase, number, special character.
 *     responses:
 *       201:
 *         description: User successfully registered.
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
 *                   example: "Registration succeeded. Check email for verification link."
 *       400:
 *         description: Validation error (missing or invalid input).
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
 *                   example: "All fields are required or Invalid data formate."
 *       409:
 *         description: Email already in use.
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
 *                   example: "User with the same email already exists."
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
 *                   example: "Failed to retrieve the new user after creation or Internal server error."
 */
router.route("/register").post(register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login.
 *     description: Authenticates the user by validating credentials, checking account verification status, and generating tokens.
 *     tags: [Auth_V1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "shirefmo012345@gmail.com"
 *                 description: A valid email address.
 *               password:
 *                 type: string
 *                 example: "P@ssw0rd"
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Login succeeded.
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
 *                   example: "Login succeeded."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         name:
 *                           type: string
 *                           example: "Shiref_Mohammed"
 *                         email:
 *                           type: string
 *                           example: "shirefmo012345@gmail.com"
 *                         role:
 *                           type: number
 *                           example: 2001
 *                         avatar:
 *                           type: string
 *                           example: "https://example.com/avatar.jpg"
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
 *       400:
 *         description: Missing required fields (email or password).
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
 *                   example: "All fields are required."
 *       401:
 *         description: Incorrect password.
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
 *                   example: "Wrong password."
 *       403:
 *         description: Account not verified.
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
 *                   example: "Your account is not verified."
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
 *                   example: "User not found."
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
router.route("/login").post(login);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh access token.
 *     description: Rotates the refresh token and generates new access and refresh tokens. Clears the old refresh token cookie and sets a new one.
 *     tags: [Auth_V1]
 *     responses:
 *       200:
 *         description: Refresh succeeded.
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
 *                   example: "Refresh succeeded."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         name:
 *                           type: string
 *                           example: "Shiref_Mohammed"
 *                         email:
 *                           type: string
 *                           example: "shirefmo012345@gmail.com"
 *                         role:
 *                           type: number
 *                           example: 2001
 *                         avatar:
 *                           type: string
 *                           example: "https://example.com/avatar.jpg"
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
 *       401:
 *         description: Invalid or missing refresh token.
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
 *                   example: "Refresh token jwt is required."
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
 *                   example: "Account is not found."
 *       500:
 *         description: Internal server error.
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
 *                   example: "Internal server error."
 */
router.route("/refresh").get(refresh);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: User logout.
 *     description: Clears the refresh token cookie to log the user out and responds with no content on success.
 *     tags: [Auth_V1]
 *     responses:
 *       204:
 *         description: No content (successful logout).
 *       500:
 *         description: Internal server error.
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
 *                   example: "Internal server error."
 */
router.route("/logout").get(logout);

/**
 * @swagger
 * /auth/verify-account:
 *   get:
 *     summary: Verify user account using a verification token.
 *     description: Verifies a user's account if the provided verification token is valid and matches the user's ID.
 *     tags: [Auth_V1]
 *     parameters:
 *       - in: query
 *         name: verificationToken
 *         required: true
 *         description: The verification token sent to the user.
 *         schema:
 *           type: string
 *           example: "verification token"
 *     responses:
 *       200:
 *         description: Account verification succeeded.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "Verification successful. You can now log in."
 *       400:
 *         description: Missing or invalid verification token.
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
 *                   example: "Verification token is missing or invalid."
 *       401:
 *         description: Token expired or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "RefreshTokenExpiredError"
 *                 message:
 *                   type: string
 *                   example: "Verification token has expired. Please request a new one."
 *       404:
 *         description: No user found with the provided token.
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
 *                   example: "Invalid verification token."
 *       409:
 *         description: Token mismatch.
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
 *                   example: "Verification token mismatch."
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
 *                   example: "Internal server error"
 */
router.route("/verify-account").get(verifyAccount);

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Request a password reset.
 *     description: Sends a reset password token to the user's email address.
 *     tags: [Auth_V1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "shirefmo012345@gmail.com"
 *                 description: The email address of the user requesting the reset password link.
 *     responses:
 *       200:
 *         description: Reset password email sent successfully.
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
 *                   example: "Check your email for the reset password link."
 *       400:
 *         description: Email is required or invalid email format.
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
 *                   example: "Invalid email format or missing email."
 *       404:
 *         description: User not found with the provided email.
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
 *                   example: "No user found with the provided email."
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
 *                   example: "Internal server error"
 */
router.route("/forget-password").post(forgetPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   get:
 *     summary: Serve the reset password form.
 *     description: Verifies the reset password token and renders the reset password form if valid.
 *     tags: [Auth_V1]
 *     parameters:
 *       - in: query
 *         name: resetPasswordToken
 *         required: true
 *         description: The token generated during the password reset request.
 *         schema:
 *           type: string
 *           example: "reset-token"
 *     responses:
 *       200:
 *         description: Reset password form rendered successfully.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               format: uri
 *               example: "http://example.com/reset_password_form.html"
 *       400:
 *         description: Missing or invalid reset password token.
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
 *                   example: "Missing or invalid reset password token."
 *       401:
 *         description: Token expired or invalid.
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
 *                   example: "Verification token expired or invalid."
 *       404:
 *         description: Invalid token or user not found.
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
 *                   example: "No user found for the provided token."
 *       409:
 *         description: Token mismatch or invalid token.
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
 *                   example: "Token mismatch."
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password.
 *     description: Resets the user's password using a valid reset password token.
 *     tags: [Auth_V1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetPasswordToken:
 *                 type: string
 *                 example: "reset-token"
 *               newPassword:
 *                 type: string
 *                 example: "P@ssw0rd"
 *     responses:
 *       200:
 *         description: Password reset successfully.
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
 *                   example: "Reset password succeeded, You can login now."
 *       400:
 *         description: Invalid or missing fields (reset password token or new password).
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
 *                   example: "Missing or invalid reset password token or new password."
 *       404:
 *         description: Invalid reset password token.
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
 *                   example: "No user found for the provided token."
 *       409:
 *         description: Token mismatch or invalid token.
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
 *                   example: "Token mismatch."
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
 *                   example: "Internal server error"
 */
router.route("/reset-password").get(sendResetPasswordForm).post(resetPassword);

/**
 * @swagger
 * /auth/login/google:
 *   get:
 *     summary: Login with Google.
 *     description: Initiates the OAuth 2.0 flow with Google to authenticate the user, requesting profile and email scopes.
 *     tags: [Auth_V1]
 *     responses:
 *       200:
 *         description: Successfully initiated Google login process.
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
 *                   example: "Redirecting to Google for authentication."
 *       400:
 *         description: Bad request (missing parameters).
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
 *                   example: "OAuth 2.0 request parameters are missing or incorrect."
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
router.route("/login/google").get(loginWithGoogle);

/**
 * @swagger
 * /auth/login/google/callback:
 *   get:
 *     summary: Google OAuth callback handler.
 *     description: Handles the response after user completes Google OAuth, checks if user exists, creates a new user if needed, and generates JWT tokens.
 *     tags: [Auth_V1]
 *     responses:
 *       302:
 *         description: Server redirects after successful Google login.
 *         headers:
 *           Location:
 *             description: The URL to redirect the client after successful login.
 *             schema:
 *               type: string
 *               example: "https://your-client-url.com/auth/oauth-success"
 *       400:
 *         description: Missing required fields (name, email, provider, provider_user_id).
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
 *                   example: "Missing required fields (name, email, provider, provider_user_id)."
 *       401:
 *         description: Authentication failed.
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
 *                   example: "Authentication failed."
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
router.route("/login/google/callback").get(loginWithGoogleCallback);

/**
 * @swagger
 * /auth/login/facebook:
 *   get:
 *     summary: Login with Facebook.
 *     description: Initiates the OAuth 2.0 flow with Facebook to authenticate the user, requesting profile scope.
 *     tags: [Auth_V1]
 *     responses:
 *       200:
 *         description: Successfully initiated Facebook login process.
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
 *                   example: "Redirecting to Facebook for authentication."
 *       400:
 *         description: Bad request (missing parameters).
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
 *                   example: "OAuth 2.0 request parameters are missing or incorrect."
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
router.route("/login/facebook").get(loginWithFacebook);

/**
 * @swagger
 * /auth/login/facebook/callback:
 *   get:
 *     summary: Facebook OAuth callback handler.
 *     description: Handles the response after user completes Facebook OAuth, checks if user exists, creates a new user if needed, and generates JWT tokens.
 *     tags: [Auth_V1]
 *     responses:
 *       302:
 *         description: Server redirects after successful Google login.
 *         headers:
 *           Location:
 *             description: The URL to redirect the client after successful login.
 *             schema:
 *               type: string
 *               example: "https://your-client-url.com/auth/oauth-success"
 *       400:
 *         description: Missing required fields (name, provider, provider_user_id).
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
 *                   example: "Missing required fields (name, provider, provider_user_id)."
 *       401:
 *         description: Authentication failed.
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
 *                   example: "Authentication failed."
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
router.route("/login/facebook/callback").get(loginWithFacebookCallback);

export default router;
