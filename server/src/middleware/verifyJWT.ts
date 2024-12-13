import jwt from "jsonwebtoken";

import { ApiBodyResponse } from "@shared/types/apiTypes";

import { usersModel } from "../database";
import { ExtendedRequestHandler } from "../types/requestHandlerTypes";
import { httpStatusText } from "../utils/httpStatusText";

export const verifyJWT: ExtendedRequestHandler<null, null> = async (
  req,
  res,
  next,
) => {
  const authHeader = req?.headers?.authorization || req?.headers?.Authorization; // "Bearer token"

  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      statusText: httpStatusText.FAIL,
      message: "Invalid access token",
    } as ApiBodyResponse<null>);
  }

  const token = authHeader.split(" ")[1]; // ["Bearer", "token"]

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    async (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.status(401).json({
          statusText: httpStatusText.AccessTokenExpiredError,
          message: "Invalid or expired access token",
        } as ApiBodyResponse<null>);
      }

      const isUserFound = await usersModel.findUserById(
        decoded?.userInfo?.user_id,
        ["user_id"],
      );

      if (!isUserFound) {
        return res.status(404).json({
          statusText: httpStatusText.FAIL,
          message: "Your account is not found",
        } as ApiBodyResponse<null>);
      }

      res.locals.userInfo = decoded.userInfo;
      next();
    },
  );
};
