import { NextFunction, Request, Response } from "express";

import { ApiBodyResponse } from "@shared/types/apiTypes";

import { getAllowedOrigins } from "../config/allowedOrigins";
import { httpStatusText } from "../utils/httpStatusText";

export const handleCors = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins: string[] = getAllowedOrigins();

  if (
    allowedOrigins.includes(req.headers.origin as string) ||
    process.env.NODE_ENV === "development" ||
    req.url === "/" ||
    req.url.startsWith("/api/v1/auth/verifyAccount") ||
    req.url.startsWith("/api/v1/auth/resetPassword")
  ) {
    next();
  } else {
    res.status(403).json({
      statusText: httpStatusText.FAIL,
      message: "Not allowed by CORS",
    } as ApiBodyResponse<null>);
  }
};
