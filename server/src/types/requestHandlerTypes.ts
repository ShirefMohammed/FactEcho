import { RequestHandler } from "express";

import { ApiBodyResponse } from "@shared/types/apiTypes";

// Generic type for a handler without route parameters
export type ExtendedRequestHandler<RequestBody, ResponseBody> = RequestHandler<
  any, // No route parameters
  ApiBodyResponse<ResponseBody>, // Typed response wrapped in ApiBodyResponse
  Partial<RequestBody>, // Request body is optional
  any // Any query types
>;

// Generic type for a handler with route parameters
export type ExtendedRequestHandlerWithParams<
  RouteParams,
  RequestBody,
  ResponseBody,
> = RequestHandler<
  Partial<RouteParams>, // Typed route parameters
  ApiBodyResponse<ResponseBody>, // Typed response wrapped in ApiBodyResponse
  Partial<RequestBody>, // Request body is optional
  any // Any query types
>;
