import jwt from "jsonwebtoken";

/**
 * Generates a verification token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} The generated JWT verification token.
 */
export const generateVerificationToken = (userId: string): string => {
  return jwt.sign(
    { user_id: userId },
    process.env.VERIFICATION_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    },
  );
};
