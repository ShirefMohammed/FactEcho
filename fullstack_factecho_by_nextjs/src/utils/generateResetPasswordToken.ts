import jwt from "jsonwebtoken";

/**
 * Generates a reset password token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} The generated JWT reset password token.
 */
export const generateResetPasswordToken = (userId: string): string => {
  return jwt.sign(
    { user_id: userId },
    process.env.RESETPASSWORD_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
};
