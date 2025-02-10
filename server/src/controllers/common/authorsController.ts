import {
  GetAuthorArticlesRequest,
  GetAuthorArticlesResponse,
  GetAuthorRequest,
  GetAuthorResponse,
  GetAuthorsRequest,
  GetAuthorsResponse,
  GetTotalAuthorsCountRequest,
  GetTotalAuthorsCountResponse,
  SearchAuthorsRequest,
  SearchAuthorsResponse,
  UpdateAuthorPermissionsRequest,
  UpdateAuthorPermissionsResponse,
} from "@shared/types/apiTypes";
import { IArticle, IAuthor } from "@shared/types/entitiesTypes";

import { getServiceLogger } from "../../config/logger";
import { articlesModel, authorsModel } from "../../database";
import { ExtendedRequestHandler } from "../../types/requestHandlerTypes";
import { httpStatusText } from "../../utils/httpStatusText";

// Logger for authors service
const authorsLogger = getServiceLogger("authors");

/**
 * Retrieves a paginated list of authors.
 * Accessible only by Admin users.
 * Responds with the list of authors or an appropriate error message.
 *
 * @param req - Express request object.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getAuthors: ExtendedRequestHandler<
  GetAuthorsRequest,
  GetAuthorsResponse
> = async (req, res, next) => {
  try {
    // Parse pagination parameters with defaults
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;
    const page: number = req.query?.page ? Number(req.query.page) : 1;

    // Ensure valid pagination values
    if (limit <= 0 || page <= 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message:
          "Invalid pagination parameters. Limit and page must be positive integers.",
      });
    }

    const skip: number = (page - 1) * limit;

    // Fetch paginated authors
    const authors: IAuthor[] = await authorsModel.getAuthors(-1, limit, skip);

    // Send response with authors
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Authors retrieved successfully.",
      data: { authors },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Searches for authors based on a search key.
 * Accessible only by Admin users.
 * Responds with the list of matching authors or an appropriate error message.
 *
 * @param req - Express request object containing `searchKey` in the query.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const searchAuthors: ExtendedRequestHandler<
  SearchAuthorsRequest,
  SearchAuthorsResponse
> = async (req, res, next) => {
  try {
    // Extract and validate search key
    const searchKey: string = req.query?.searchKey || "";
    if (!searchKey.trim()) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Search key is required.",
      });
    }

    // Parse and validate pagination parameters with defaults
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;
    const page: number = req.query?.page ? Number(req.query.page) : 1;
    if (limit <= 0 || page <= 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message:
          "Invalid pagination parameters. Limit and page must be positive integers.",
      });
    }

    const skip: number = (page - 1) * limit;

    // Fetch paginated authors based on the search key
    const authors: IAuthor[] = await authorsModel.searchAuthors(
      searchKey,
      -1,
      limit,
      skip,
    );

    // Send response with authors
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Authors retrieved successfully.",
      data: { authors },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves the total count of authors in the system.
 * Responds with the total authors count or an appropriate error message.
 *
 * @param req - Express request object (unused in this case).
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getTotalAuthorsCount: ExtendedRequestHandler<
  GetTotalAuthorsCountRequest,
  GetTotalAuthorsCountResponse
> = async (_req, res, next) => {
  try {
    const totalAuthorsCount: number = await authorsModel.getAuthorsCount();

    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Total authors count retrieved successfully.",
      data: { totalAuthorsCount },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves an author by their ID.
 * Responds with the author details or an appropriate error message.
 *
 * @param req - Express request object containing `authorId` in the route parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getAuthor: ExtendedRequestHandler<
  GetAuthorRequest,
  GetAuthorResponse
> = async (req, res, next) => {
  try {
    // Fetch the author details from the database
    const author = await authorsModel.findAuthorById(req.params.authorId, [
      "user_id",
      "name",
    ]);

    // If the author is not found, return a 404 error
    if (!author) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Author not found.",
      });
    }

    // Delete the permissions field from the author object
    delete (author as any).permissions;

    // Return the author details with a success message
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Author retrieved successfully.",
      data: { author },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates an author's permissions.
 * Ensures that only Admin users can modify an author's permissions.
 * Validates that the `permissions` field is provided in the request body.
 * Responds with a success message upon successful update or an error message if validation fails.
 *
 * @param req - Express request object containing the `authorId` in the route parameters and `permissions` in the request body.
 * @param res - Express response object used to send statusText and message.
 * @param next - Express next function to handle errors.
 */
export const updateAuthorPermissions: ExtendedRequestHandler<
  UpdateAuthorPermissionsRequest,
  UpdateAuthorPermissionsResponse
> = async (req, res, next) => {
  try {
    // Extract permissions from the request body
    const { permissions } = req.body;

    // Validate that permissions are provided
    if (!permissions) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Permissions are required.",
      });
    }

    // Update the author's permissions in the database
    await authorsModel.updateAuthorPermissions(
      req.params.authorId,
      permissions,
    );

    authorsLogger.info(
      `Author permissions updated for author {${req.params.authorId}}`,
    );

    // Send success response
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Author permissions updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a paginated list of articles for a specific author.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of articles or an appropriate error message.
 *
 * @param req - Express request object containing `authorId` in params and optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getAuthorArticles: ExtendedRequestHandler<
  GetAuthorArticlesRequest,
  GetAuthorArticlesResponse
> = async (req, res, next) => {
  try {
    // Parse sorting and pagination parameters with defaults
    const order = req.query.order === "old" ? 1 : -1;
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;
    const page: number = req.query?.page ? Number(req.query.page) : 1;

    // Ensure valid pagination values
    if (limit <= 0 || page <= 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message:
          "Invalid pagination parameters. Limit and page must be positive integers.",
      });
    }

    const skip: number = (page - 1) * limit;

    // Fetch paginated articles for the author
    const articles: IArticle[] = await articlesModel.getCreatedArticles(
      req.params.authorId,
      order,
      limit,
      skip,
    );

    // Send response with articles
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Author's articles retrieved successfully.",
      data: { articles },
    });
  } catch (err) {
    next(err);
  }
};
