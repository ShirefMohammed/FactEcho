import { NextFunction, Request, Response } from "express";

import { ApiBodyResponse } from "@shared/types/apiTypes";

import { getServiceLogger } from "../config/logger";
import { httpStatusText } from "../utils/httpStatusText";

// Logger for general service
const generalLogger = getServiceLogger("general");

export const handleErrors = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(`Error from server: ${error}`);
  generalLogger.error({ data: { error } }, "Internal server error");

  res.status(500).json({
    statusText: httpStatusText.ERROR,
    message: "Internal server error",
  } as ApiBodyResponse<null>);
};
