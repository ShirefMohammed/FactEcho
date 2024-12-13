import jwt from "jsonwebtoken";

/**
 * Generates a refresh token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} The generated JWT refresh token.
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { user_id: userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
};
