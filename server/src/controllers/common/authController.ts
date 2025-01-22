import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "node:path";
import passport from "passport";

import {
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  LoginRequest,
  LoginResponse,
  LoginWithFacebookCallbackRequest,
  LoginWithFacebookCallbackResponse,
  LoginWithFacebookRequest,
  LoginWithFacebookResponse,
  LoginWithGoogleCallbackRequest,
  LoginWithGoogleCallbackResponse,
  LoginWithGoogleRequest,
  LoginWithGoogleResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendResetPasswordFormRequest,
  SendResetPasswordFormResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
} from "@shared/types/apiTypes";
import { IUser } from "@shared/types/entitiesTypes";

import { getServiceLogger } from "../../config/logger";
import { usersModel } from "../../database";
import { ExtendedRequestHandler } from "../../types/requestHandlerTypes";
import { RgxList } from "../../utils/RgxList";
import { generateAccessToken } from "../../utils/generateAccessToken";
import { generateRefreshToken } from "../../utils/generateRefreshToken";
import { generateResetPasswordToken } from "../../utils/generateResetPasswordToken";
import { generateVerificationToken } from "../../utils/generateVerificationToken";
import { httpStatusText } from "../../utils/httpStatusText";
import { ROLES_LIST } from "../../utils/rolesList";
import { sendResetPasswordEmail } from "../../utils/sendResetPasswordEmail";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail";

// Logger for auth service
const authLogger = getServiceLogger("auth");

/**
 * Handles user registration.
 * Validates user input, creates a new user in the database, generates a verification token,
 * and sends a verification email.
 *
 * @param req - Express request object containing `name`, `email`, and `password` in the body.
 * @param res - Express response object used to send statusText and message.
 * @param next - Express next function to handle errors.
 */
export const register: ExtendedRequestHandler<
  RegisterRequest,
  RegisterResponse
> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "All fields are required",
      });
    }

    // Validate name format
    if (!RgxList.NAME_REGEX.test(name)) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Invalid name format",
      });
    }

    // Validate email format
    if (!RgxList.EMAIL_REGEX.test(email)) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Enter a valid email",
      });
    }

    // Validate password format
    if (!RgxList.PASS_REGEX.test(password)) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Invalid password format",
      });
    }

    // Check if email already exists
    const user = await usersModel.findUserByEmail(email, ["user_id"]);
    if (user) {
      authLogger.warn(
        `Register: User with the same email {${email}} already exists`,
      );
      return res.status(409).send({
        statusText: httpStatusText.FAIL,
        message: "User with the same email already exists",
      });
    }

    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await usersModel.createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Generate and send verification token
    const verificationToken = generateVerificationToken(newUser.user_id!);
    await usersModel.setVerificationToken(newUser.user_id!, verificationToken);
    await sendVerificationEmail(email, verificationToken);
    authLogger.info(`Register: Verification email sent to {${email}}`);

    // Success response
    res.status(201).send({
      statusText: httpStatusText.SUCCESS,
      message: "Registration succeeded. Check email for verification link",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handles user login.
 * Validates user input, checks credentials, verifies account status, and generates tokens.
 * Sets a secure HTTP-only refresh token in cookies and returns an access token.
 *
 * @param req - Express request object containing `email` and `password` in the body.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const login: ExtendedRequestHandler<
  LoginRequest,
  LoginResponse
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "All fields are required",
      });
    }

    // Check if the user not found or user registered via OAuth
    const user = await usersModel.findUserByEmail(email);
    if (!user || (user.provider && user.provider_user_id)) {
      authLogger.warn(`Login: User account with email {${email}} not found`);
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "User not found",
      });
    }

    // Validate the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      authLogger.warn(`Login: Wrong password attempt by {${email}}`);
      return res.status(401).send({
        statusText: httpStatusText.FAIL,
        message: "Wrong password",
      });
    }

    // Check if the user's account is verified
    if (!user.is_verified) {
      authLogger.warn(`Login: Unverified account login attempt by {${email}}`);
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "Your account is not verified",
      });
    }

    // Fetch user avatar for Admin or Author roles
    const userAvatar = [ROLES_LIST.Admin, ROLES_LIST.Author].includes(user.role)
      ? await usersModel.findUserAvatar(user.user_id)
      : null;

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user.user_id, user.role);
    const refreshToken = generateRefreshToken(user.user_id);

    // Clear any existing JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Set a new secure refresh token cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Accessible only by the server
      secure: true, // HTTPS only
      sameSite: "none", // Allows cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    authLogger.info(`Login: User with email {${email}} logged in`);

    // Respond with user data and access token
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Login succeeded",
      data: {
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: userAvatar,
        },
        accessToken: accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handles refresh token rotation and generates new access and refresh tokens.
 * Clears the old refresh token cookie, validates the token, and sets a new cookie.
 *
 * @param req - Express request object with cookies.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Middleware function for error handling.
 */
export const refresh: ExtendedRequestHandler<
  RefreshRequest,
  RefreshResponse
> = async (req, res, next) => {
  try {
    const { jwt: refreshTokenCookie } = req.cookies;

    // Ensure refresh token cookie exists
    if (!refreshTokenCookie) {
      return res.status(401).send({
        statusText: httpStatusText.FAIL,
        message: "Refresh token jwt is required",
      });
    }

    // Clear old refresh token cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Verify the refresh token
    jwt.verify(
      refreshTokenCookie,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: any, decoded: any) => {
        if (err) {
          return res.status(401).send({
            statusText: httpStatusText.RefreshTokenExpiredError,
            message: "Refresh token is forbidden",
          });
        }

        // Find user by ID from token payload
        const user = await usersModel.findUserById(decoded?.user_id);

        if (!user) {
          return res.status(404).send({
            statusText: httpStatusText.FAIL,
            message: "Account is not found",
          });
        }

        // Fetch user avatar for Admin or Author roles
        const userAvatar = [ROLES_LIST.Admin, ROLES_LIST.Author].includes(
          user.role,
        )
          ? await usersModel.findUserAvatar(user.user_id)
          : null;

        // Generate new tokens
        const accessToken = generateAccessToken(user.user_id, user.role);
        const newRefreshToken = generateRefreshToken(user.user_id);

        // Set new refresh token cookie
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        authLogger.info(
          `Refresh: Tokens rotated successfully to {${user.user_id}}`,
        );

        // Respond with user data and access token
        res.status(200).send({
          statusText: httpStatusText.SUCCESS,
          message: "Refresh succeeded",
          data: {
            user: {
              user_id: user.user_id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: userAvatar,
            },
            accessToken: accessToken,
          },
        });
      },
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Handles user logout by clearing the refresh token cookie.
 * Sends a 204 No Content response upon successful logout.
 *
 * @param _req - Express request object (unused in this handler).
 * @param res - Express response object to send status.
 * @param next - Middleware function for error handling.
 */
export const logout: ExtendedRequestHandler<
  LogoutRequest,
  LogoutResponse
> = async (_req, res, next) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    authLogger.info("Logout: User logged out");

    // Respond with no content status
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

/**
 * Verifies a user's account using a verification token.
 * Updates the user's verification status if the token is valid.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Middleware for error handling.
 */
export const verifyAccount: RequestHandler<
  any,
  VerifyAccountResponse,
  VerifyAccountRequest,
  any
> = async (req, res, next) => {
  try {
    const { verificationToken } = req.query;

    // Validate the presence and type of the verification token
    if (!verificationToken || typeof verificationToken !== "string") {
      return res.status(400).send("Verification token is missing");
    }

    // Find the user by their verification token
    const user = await usersModel.findUserByVerificationToken(
      verificationToken,
      ["user_id"],
    );

    if (!user) {
      return res.status(404).send("Invalid verification token");
    }

    try {
      // Decode and verify the token's validity
      const decodedToken = jwt.verify(
        verificationToken,
        process.env.VERIFICATION_TOKEN_SECRET!,
      );

      // Check if the decoded token matches the user's ID
      if (
        typeof decodedToken === "object" &&
        decodedToken !== null &&
        "user_id" in decodedToken &&
        (decodedToken as JwtPayload).user_id !== user.user_id
      ) {
        return res.status(409).send("Invalid verification token");
      }

      // Update the user's verification status and clear the token
      await usersModel.updateUser(user.user_id, { is_verified: true });
      await usersModel.setVerificationToken(user.user_id, "");

      authLogger.info(
        `VerifyAccount: User {${user.user_id}} account verified successfully`,
      );

      // Send the confirmation page to the user
      return res
        .status(200)
        .sendFile(
          path.join(
            __dirname,
            "..",
            "..",
            "views",
            "verification_confirmation.html",
          ),
        );
    } catch (error) {
      authLogger.warn(
        `VerifyAccount: User {${user.user_id}} account is verification token has been expired`,
      );
      return res
        .status(401)
        .send(
          "Verification token has been expired. Go to forget password page to generate a new verification token",
        );
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Sends a reset password email with a reset password token.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Middleware for error handling.
 */
export const forgetPassword: ExtendedRequestHandler<
  ForgetPasswordRequest,
  ForgetPasswordResponse
> = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the email field is provided
    if (!email) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Email is required",
      });
    }

    // Retrieve the user by their email
    const user = await usersModel.findUserByEmail(email, [
      "user_id",
      "provider",
      "provider_user_id",
    ]);

    // Return 404 if no user is found
    if (!user) {
      authLogger.warn(
        `forgetPassword: No user found with this email {${email}}`,
      );
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "User not found",
      });
    }

    // Return 403 if user registered via OAuth
    if (user.provider && user.provider_user_id) {
      authLogger.warn(
        `forgetPassword: User with email {${email}} from OAuth forbidden`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message:
          "This action is not available for user who registered with OAuth",
      });
    }

    // Generate a reset password token and save it to the user's account
    const resetPasswordToken = generateResetPasswordToken(user.user_id);
    await usersModel.setResetPasswordToken(user.user_id, resetPasswordToken);

    // Send the reset password email
    sendResetPasswordEmail(email, resetPasswordToken);

    // Respond with a success message
    authLogger.info(
      `forgetPassword: Reset password email sent successfully to {${email}}`,
    );
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Check your email for the reset password link",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verifies a reset password token and sends the reset password form.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Middleware for error handling.
 */
export const sendResetPasswordForm: RequestHandler<
  any,
  SendResetPasswordFormResponse,
  SendResetPasswordFormRequest,
  any
> = async (req, res, next) => {
  try {
    const { resetPasswordToken } = req.query;

    // Check if the reset password token is present and valid
    if (!resetPasswordToken || typeof resetPasswordToken !== "string") {
      return res.status(400).send("Reset password token is missing");
    }

    // Find the user by the reset password token
    const user = await usersModel.findUserByResetPasswordToken(
      resetPasswordToken,
      ["user_id"],
    );

    // Return 404 if the token is invalid or the user is not found
    if (!user) {
      return res.status(404).send("Invalid reset password token");
    }

    try {
      // Decode and validate the token
      const decodedToken = jwt.verify(
        resetPasswordToken,
        process.env.RESETPASSWORD_TOKEN_SECRET!,
      );

      // Check if the token matches the user's ID
      if (
        typeof decodedToken === "object" &&
        decodedToken !== null &&
        "userId" in decodedToken &&
        (decodedToken as JwtPayload).user_id !== user.user_id
      ) {
        return res.status(409).send("Invalid reset password token");
      }

      // Serve the reset password form
      authLogger.info(
        `sendResetPasswordForm: Serving reset password form to user {${user.user_id}}`,
      );
      return res
        .status(200)
        .sendFile(
          path.join(__dirname, "..", "..", "views", "reset_password_form.html"),
        );
    } catch (error) {
      authLogger.warn(
        `sendResetPasswordForm: User {${user.user_id}} account is reset password token has been expired`,
      );
      return res
        .status(401)
        .send(
          "Reset password token has been expired. Go to forget password page to generate a new reset password token",
        );
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Resets the user's password using a valid reset password token.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Middleware for error handling.
 */
export const resetPassword: RequestHandler<
  any,
  ResetPasswordResponse,
  ResetPasswordRequest,
  any
> = async (req, res, next) => {
  try {
    const { resetPasswordToken, newPassword } = req.body;

    // Validate input fields
    if (!resetPasswordToken) {
      return res.status(400).send("Reset password token is required");
    }

    if (!newPassword) {
      return res.status(400).send("New password is required");
    }

    // Find the user by the reset password token
    const user = await usersModel.findUserByResetPasswordToken(
      resetPasswordToken,
      ["user_id"],
    );

    // Return 404 if the token is invalid or the user is not found
    if (!user) {
      return res.status(404).send("Invalid reset password token");
    }

    // Validate the new password format
    if (!RgxList.PASS_REGEX.test(newPassword)) {
      return res
        .status(400)
        .send(
          "Password must be in english, 8 to 24 characters, Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: !, @, #, $, %",
        );
    }

    // Update the user's password and clear tokens
    await usersModel.updateUser(user.user_id, {
      password: await bcrypt.hash(newPassword, 10),
      is_verified: true,
    });
    await usersModel.setVerificationToken(user.user_id, "");
    await usersModel.setResetPasswordToken(user.user_id, "");

    // Respond with a success message
    authLogger.info(
      `resetPassword: Password reset successfully for user {${user.user_id}}`,
    );
    res.status(200).send("Reset password succeeded, You can login now");
  } catch (err) {
    next(err);
  }
};

/**
 * Login with Google.
 *
 * This function initiates the OAuth 2.0 flow with Google to authenticate the user.
 * It requests profile and email scopes from the Google API.
 */
export const loginWithGoogle: ExtendedRequestHandler<
  LoginWithGoogleRequest,
  LoginWithGoogleResponse
> = passport.authenticate("google", { scope: ["profile", "email"] });

/**
 * Callback handler for Google login.
 *
 * This function is triggered after the user completes the OAuth 2.0 login process with Google.
 * It processes the Google response, checks if the user exists, creates a new user if needed,
 * and generates authentication tokens (refresh) for the user.
 *
 * @param req - Express request object that contains the authentication response from Google.
 * @param res - Express response object used to send the response to the client.
 * @param next - Express middleware function to handle errors.
 */
export const loginWithGoogleCallback: ExtendedRequestHandler<
  LoginWithGoogleCallbackRequest,
  LoginWithGoogleCallbackResponse
> = async (req, res, next) => {
  // Authenticate the user using the Google profile provided by OAuth
  passport.authenticate("google", async (err: Error, profile: any) => {
    if (err) {
      // Forward error to error handling middleware if authentication fails
      return next(err);
    }

    if (!profile) {
      // If the profile is missing, send a 401 Unauthorized response
      return res.status(401).send({
        statusText: httpStatusText.FAIL,
        message: "Authentication failed",
      });
    }

    try {
      // Extract relevant data from the Google profile
      const name = profile?.displayName;
      const email = profile?.emails?.[0]?.value;
      const provider = profile?.provider;
      const provider_user_id = profile?.id;

      // Validate the essential fields (name, email, provider, and provider_user_id)
      if (!name || !email || !provider || !provider_user_id) {
        return res.status(400).send({
          statusText: httpStatusText.FAIL,
          message:
            "Missing required fields (name, email, provider, provider_user_id)",
        });
      }

      // Check if the user already exists in the database by OAuth
      let user = await usersModel.findUserByOAuth(provider, provider_user_id);

      if (!user) {
        // If the user doesn't exist, create a new user record in the database
        const newUser = await usersModel.createUser({
          name,
          email,
          is_verified: true, // Automatically verify the user since it's Google login
          provider,
          provider_user_id,
        });

        user = newUser as IUser;

        authLogger.info(
          `loginWithGoogleCallback: New user with email {${email}} created successfully`,
        );
      }

      // Generate JWT refresh token for the authenticated user
      const refreshToken = generateRefreshToken(user.user_id);

      // Clear the existing JWT cookie and set the new refresh token
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      authLogger.info(
        `loginWithGoogleCallback: User with email {${email}} logged in via Google`,
      );

      // Server redirects after successful login
      res.redirect(`${process.env.CLIENT_URL}/auth/oauth-success`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

/**
 * Login with Facebook.
 *
 * This function initiates the OAuth 2.0 flow with Facebook to authenticate the user.
 * It requests profile and email scopes from the Facebook API.
 */
export const loginWithFacebook: ExtendedRequestHandler<
  LoginWithFacebookRequest,
  LoginWithFacebookResponse
> = passport.authenticate("facebook", { scope: ["public_profile"] });

/**
 * Callback handler for Facebook login.
 *
 * This function is triggered after the user completes the OAuth 2.0 login process with Facebook.
 * It processes the Facebook response, checks if the user exists, creates a new user if needed,
 * and generates authentication tokens (refresh) for the user.
 *
 * @param req - Express request object that contains the authentication response from Facebook.
 * @param res - Express response object used to send the response to the client.
 * @param next - Express middleware function to handle errors.
 */
export const loginWithFacebookCallback: ExtendedRequestHandler<
  LoginWithFacebookCallbackRequest,
  LoginWithFacebookCallbackResponse
> = async (req, res, next) => {
  // Authenticate the user using the Facebook public_profile provided by OAuth
  passport.authenticate("facebook", async (err: Error, public_profile: any) => {
    if (err) {
      // Forward error to error handling middleware if authentication fails
      return next(err);
    }

    if (!public_profile) {
      // If the public_profile is missing, send a 401 Unauthorized response
      return res.status(401).send({
        statusText: httpStatusText.FAIL,
        message: "Authentication failed",
      });
    }

    try {
      // Extract relevant data from the Facebook public_profile
      const name = public_profile?.displayName;
      const provider = public_profile?.provider;
      const provider_user_id = public_profile?.id;

      // Validate the essential fields (name, provider, and provider_user_id)
      if (!name || !provider || !provider_user_id) {
        return res.status(400).send({
          statusText: httpStatusText.FAIL,
          message: "Missing required fields (name, provider, provider_user_id)",
        });
      }

      // Check if the user already exists in the database by OAuth
      let user = await usersModel.findUserByOAuth(provider, provider_user_id);

      if (!user) {
        // If the user doesn't exist, create a new user record in the database
        const newUser = await usersModel.createUser({
          name,
          is_verified: true, // Automatically verify the user since it's Facebook login
          provider,
          provider_user_id,
        });

        user = newUser as IUser;

        authLogger.info(
          `loginWithFacebookCallback: New user with provider_user_id {${provider_user_id}} created successfully`,
        );
      }

      // Generate JWT access and refresh tokens for the authenticated user
      const refreshToken = generateRefreshToken(user.user_id);

      // Clear the existing JWT cookie and set the new refresh token
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      authLogger.info(
        `loginWithFacebookCallback: User with provider_user_id {${provider_user_id}} logged in via Facebook`,
      );

      // Server redirects after successful login
      res.redirect(`${process.env.CLIENT_URL}/auth/oauth-success`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};
