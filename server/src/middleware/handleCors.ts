import { NextFunction, Request, Response } from "express";

import { ApiBodyResponse } from "@shared/types/apiTypes";

import { getAllowedOrigins } from "../config/allowedOrigins";
import { httpStatusText } from "../utils/httpStatusText";

export const handleCors = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins: string[] = getAllowedOrigins();

  if (
    allowedOrigins.includes(req.headers.origin as string) ||
    process.env.NODE_ENV?.trim() === "testing" ||
    process.env.NODE_ENV?.trim() === "development" ||
    req.url === "/" ||
    req.url.startsWith("/api/v1/auth/verify-account") ||
    req.url.startsWith("/api/v1/auth/reset-password") ||
    req.url.startsWith("/api/v1/auth/login/google") ||
    req.url.startsWith("/api/v1/auth/login/facebook") ||
    req.url.startsWith("/api/v1/auth/login/google/callback") ||
    req.url.startsWith("/api/v1/auth/login/facebook/callback")
  ) {
    next();
  } else {
    res.status(403).json({
      statusText: httpStatusText.FAIL,
      message: "Not allowed by CORS",
    } as ApiBodyResponse<null>);
  }
};
