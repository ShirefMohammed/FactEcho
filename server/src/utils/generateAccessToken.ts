import jwt from "jsonwebtoken";
import { AccessTokenUserInfo } from "@shared/types/apiTypes";

/**
 * Generates an access token for a user.
 * @param {string} userId - The ID of the user.
 * @param {number} role - The user's role identifier.
 * @returns {string} The generated JWT access token.
 */
export const generateAccessToken = (userId: string, role: number): string => {
  const userInfo: AccessTokenUserInfo = { user_id: userId, role: role };
  return jwt.sign({ userInfo }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};
