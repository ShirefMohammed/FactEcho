import {
  AccessTokenUserInfo,
  CreateArticleRequest,
  CreateArticleResponse,
  DeleteArticleRequest,
  DeleteArticleResponse,
  GetArticleRequest,
  GetArticleResponse,
  GetArticlesRequest,
  GetArticlesResponse,
  GetExploredArticlesRequest,
  GetExploredArticlesResponse,
  GetLatestArticlesRequest,
  GetLatestArticlesResponse,
  GetSavedArticlesRequest,
  GetSavedArticlesResponse,
  GetTotalArticlesRequest,
  GetTotalArticlesResponse,
  GetTrendArticlesRequest,
  GetTrendArticlesResponse,
  IsArticleSavedRequest,
  IsArticleSavedResponse,
  SaveArticleRequest,
  SaveArticleResponse,
  SearchArticlesRequest,
  SearchArticlesResponse,
  UnsaveArticleRequest,
  UnsaveArticleResponse,
  UpdateArticleRequest,
  UpdateArticleResponse,
} from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { getServiceLogger } from "../../config/logger";
import { articlesModel, authorsModel, categoriesModel } from "../../database";
import { ExtendedRequestHandler } from "../../types/requestHandlerTypes";
import { deleteFileFromCloudinary } from "../../utils/deleteFileFromCloudinary";
import { httpStatusText } from "../../utils/httpStatusText";
import { isFileExistsInCloudinary } from "../../utils/isFileExistsInCloudinary";
import { ROLES_LIST } from "../../utils/rolesList";

// Logger for articles service
const articlesLogger = getServiceLogger("articles");

/**
 * Retrieves a paginated list of articles.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getArticles: ExtendedRequestHandler<
  GetArticlesRequest,
  GetArticlesResponse
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

    // Fetch paginated articles
    const articles: IArticle[] = await articlesModel.getArticles(
      order,
      limit,
      skip,
    );

    // Send response with articles and pagination metadata
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Articles retrieved successfully.",
      data: { articles },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Searches for articles based on a search key.
 * Accepts optional query parameters for search, sorting, and pagination.
 * Responds with the list of matching articles or an appropriate error message.
 *
 * @param req - Express request object containing `searchKey` and optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const searchArticles: ExtendedRequestHandler<
  SearchArticlesRequest,
  SearchArticlesResponse
> = async (req, res, next) => {
  try {
    // Parse search, sorting, and pagination parameters with defaults
    const searchKey: string = req.query.searchKey || "";
    const order: number = req.query.order === "old" ? 1 : -1;
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

    // Fetch paginated articles matching the search key
    const articles: IArticle[] = await articlesModel.searchArticles(
      searchKey,
      order,
      limit,
      skip,
    );

    // Send response with articles and pagination metadata
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Articles searched successfully.",
      data: { articles },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves the total count of articles in the system.
 * Responds with the total user count or an appropriate error message.
 *
 * @param req - Express request object (unused in this case).
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getTotalArticlesCount: ExtendedRequestHandler<
  GetTotalArticlesRequest,
  GetTotalArticlesResponse
> = async (_req, res, next) => {
  try {
    const totalArticlesCount: number = await articlesModel.getArticlesCount();

    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Total articles count retrieved successfully.",
      data: { totalArticlesCount },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a list of random articles.
 * Accepts an optional `limit` query parameter to specify the number of random articles to return.
 * Responds with the list of random articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `limit` query parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getExploredArticles: ExtendedRequestHandler<
  GetExploredArticlesRequest,
  GetExploredArticlesResponse
> = async (req, res, next) => {
  try {
    // Parse the limit parameter, default to 10 if not provided
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;

    // Ensure valid limit value
    if (limit <= 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Invalid limit. Limit must be a positive integer.",
      });
    }

    // Fetch random articles from the database
    const articles: IArticle[] = await articlesModel.getRandomArticles(limit);

    // Send response with the list of random articles
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Explored Random articles retrieved successfully.",
      data: { articles },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a list of trending articles based on views.
 * Accepts an optional `limit` query parameter to specify the number of trending articles to return.
 * Responds with the list of trending articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `limit` query parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getTrendArticles: ExtendedRequestHandler<
  GetTrendArticlesRequest,
  GetTrendArticlesResponse
> = async (req, res, next) => {
  try {
    // Parse the limit parameter, default to 10 if not provided
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;

    // Ensure valid limit value
    if (limit <= 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Invalid limit. Limit must be a positive integer.",
      });
    }

    // Fetch trending articles (e.g., articles with most views)
    const articles: IArticle[] = await articlesModel.getTrendingArticles(limit);

    // Send response with the list of trending articles
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Trending articles retrieved successfully.",
      data: { articles },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a list of the latest articles based on their creation date.
 * Accepts an optional `limit` query parameter to specify the number of latest articles to return.
 * Responds with the list of latest articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `limit` query parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getLatestArticles: ExtendedRequestHandler<
  GetLatestArticlesRequest,
  GetLatestArticlesResponse
> = async (req, res, next) => {
  try {
    // Parse the limit parameter, default to 10 if not provided
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;

    // Ensure valid limit value
    if (limit <= 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Invalid limit. Limit must be a positive integer.",
      });
    }

    // Fetch latest articles based on their creation date
    const articles: IArticle[] = await articlesModel.getLatestArticles(limit);

    // Send response with the list of latest articles
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Latest articles retrieved successfully.",
      data: { articles },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves details of a specific article by ID and I increase article views by one.
 * Responds with the article details or an appropriate error message.
 *
 * @param req - Express request object containing the `articleId` parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getArticle: ExtendedRequestHandler<
  GetArticleRequest,
  GetArticleResponse
> = async (req, res, next) => {
  try {
    // Fetch the article by ID
    const article: IArticle | null = await articlesModel.findArticleById(
      req.params.articleId,
    );

    // Handle article not found
    if (!article) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Article not found.",
      });
    }

    // Increase article views
    articlesModel.updateArticle(article.article_id, {
      views: article.views + 1,
    });

    // Send response with the article details
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Article retrieved successfully.",
      data: { article },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new article with the provided title, content, image, and category ID.
 * Validates input data, checks for duplicate titles, ensures the image exists in Cloudinary,
 * and validates category existence. Also verifies author permissions if the creator is an Author.
 *
 * @param req - Express request object containing `title`, `content`, `image`, and `category_id` in the body.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 * @returns Sends a response with the created article or an error message.
 */
export const createArticle: ExtendedRequestHandler<
  CreateArticleRequest,
  CreateArticleResponse
> = async (req, res, next) => {
  try {
    // Extract and validate required fields from the request body
    const { title, content, image, category_id } = req.body;
    if (!title || !content || !image || !category_id) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Article title, content, image, and category_id are required.",
      });
    }

    // Get the creator's user ID from the response locals
    const creatorId = (res.locals.userInfo as AccessTokenUserInfo).user_id;

    // Check author permissions if the creator is an Author
    if (
      (res.locals.userInfo as AccessTokenUserInfo).role === ROLES_LIST.Author
    ) {
      // Fetch the author data, including permissions
      const author = await authorsModel.findAuthorById(creatorId, ["user_id"]);
      if (!author) {
        return res.status(404).send({
          statusText: httpStatusText.FAIL,
          message: "Author not found.",
        });
      }

      // Verify if the author has permission to create articles
      if (!author.permissions.create) {
        articlesLogger.warn(
          `createArticle: Author {${author.user_id}} with no create permission tries to create new article`,
        );
        return res.status(403).send({
          statusText: httpStatusText.FAIL,
          message: "You don't have permission to create articles.",
        });
      }
    }

    // Check for duplicate articles by title
    const existingArticle = await articlesModel.findArticleByTitle(title, [
      "article_id",
    ]);
    if (existingArticle) {
      return res.status(409).send({
        statusText: httpStatusText.FAIL,
        message: "An article with the same title already exists.",
      });
    }

    // Verify that the image exists in Cloudinary storage
    if (!await isFileExistsInCloudinary(image)) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Image is not uploaded to the storage.",
      });
    }

    // Validate the provided category ID
    const category = await categoriesModel.findCategoryById(category_id, [
      "category_id",
    ]);
    if (!category) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Category not found.",
      });
    }

    // Create the new article in the database
    await articlesModel.createArticle({
      title,
      content,
      image,
      category_id,
      creator_id: creatorId,
    });

    articlesLogger.info(
      `createArticle: New Article with title {${title}} created successfully`,
    );

    // Retrieve the newly created article to confirm successful creation
    const createdArticle = await articlesModel.findArticleByTitle(title);
    if (!createdArticle) {
      return res.status(500).send({
        statusText: httpStatusText.FAIL,
        message:
          "Article creation succeeded, but an error occurred while retrieving the new article.",
      });
    }

    // Send a success response with the new article data
    res.status(201).send({
      statusText: httpStatusText.SUCCESS,
      message: "Article created successfully.",
      data: { newArticle: createdArticle },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates an article with the provided fields.
 *
 * This endpoint validates:
 * - The existence of the article.
 * - No duplicate titles are used.
 * - Proper image upload to Cloudinary if a new image is provided.
 *
 * It also ensures:
 * - Admins can only update articles they created.
 * - Authors have appropriate permissions and ownership of the article.
 *
 * If an image is updated, the old image is deleted. Responds with the updated article or an appropriate error message.
 *
 * @param req - Express request object containing the `articleId` in params and optional `title`, `content`, `image`, and `category_id` in the body.
 * @param res - Express response object used to send the status, message, and updated article data.
 * @param next - Express next function to handle errors.
 */
export const updateArticle: ExtendedRequestHandler<
  UpdateArticleRequest,
  UpdateArticleResponse
> = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const requesterId = (res.locals.userInfo as AccessTokenUserInfo).user_id;
    const requesterRole = (res.locals.userInfo as AccessTokenUserInfo).role;

    const { title, content, image, category_id } = req.body;

    // Check if the article exists
    const article = await articlesModel.findArticleById(req.params.articleId, [
      "article_id",
      "image",
      "creator_id",
    ]);

    if (!article) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Article not found.",
      });
    }

    // Handle case where admin is not the creator
    if (
      requesterRole === ROLES_LIST.Admin &&
      requesterId !== article.creator_id
    ) {
      articlesLogger.warn(
        `updateArticle: Unauthorized update attempt, Admin {${requesterId}} tried to update article {${articleId}}`,
      );
      return res.status(403).send({
        statusText: httpStatusText.FAIL,
        message: "You don't have access to this resource.",
      });
    }

    // Check for author update permissions if the user is an Author
    if (requesterRole === ROLES_LIST.Author) {
      // Handle case where author is not the creator
      if (requesterId !== article.creator_id) {
        articlesLogger.warn(
          `updateArticle: Unauthorized article update attempted on {${articleId}} by author {${requesterId}}`,
        );
        return res.status(403).send({
          statusText: httpStatusText.FAIL,
          message: "You don't have access to this resource.",
        });
      }

      const author = await authorsModel.findAuthorById(requesterId, [
        "user_id",
      ]);

      // Handle case where author is not found
      if (!author) {
        return res.status(404).send({
          statusText: httpStatusText.FAIL,
          message: "Author not found.",
        });
      }

      // Check if the author has permission to update articles
      if (!author.permissions.update) {
        articlesLogger.warn(
          `updateArticle: Permission denied, Author ${requesterId} attempted to update article ${articleId} without sufficient permissions.`,
        );
        return res.status(403).send({
          statusText: httpStatusText.FAIL,
          message: "You don't have permission to update articles.",
        });
      }
    }

    let message = "Article updated.";
    const updatedFields: Partial<IArticle> = {};

    // Check for duplicate titles if a new title is provided
    if (title) {
      const duplicateArticle = await articlesModel.findArticleByTitle(title, [
        "article_id",
      ]);
      if (duplicateArticle && duplicateArticle.article_id !== articleId) {
        message +=
          " Title is not updated as another article with the same title exists.";
      } else {
        updatedFields.title = title;
      }
    }

    // Update the content if provided
    if (content) {
      updatedFields.content = content;
    }

    // Validate the image if provided
    if (image) {
      if (!await isFileExistsInCloudinary(image)) {
        message +=
          " Image is not updated as it is not uploaded to the storage.";
      } else {
        updatedFields.image = image;
      }
    }

    // Validate category if provided
    if (category_id) {
      const category = await categoriesModel.findCategoryById(category_id, [
        "category_id",
      ]);
      if (!category) {
        message += " category_id is not updated as it was not found.";
      } else {
        updatedFields.category_id = category_id;
      }
    }

    // Update the article with the new fields
    await articlesModel.updateArticle(req.params.articleId, updatedFields);

    // Delete the old image from Cloudinary if a new image was provided
    if (updatedFields.image) {
      await deleteFileFromCloudinary(article.image);
    }

    // Retrieve the updated article for confirmation
    const updatedArticle = await articlesModel.findArticleById(articleId);

    articlesLogger.info(
      `updateArticle: Article {${articleId}} updated successfully by {${requesterRole}}.`,
    );

    if (!updatedArticle) {
      return res.status(500).send({
        statusText: httpStatusText.FAIL,
        message:
          "Article update succeeded, but an error occurred while retrieving the updated article.",
      });
    }

    // Send success response with the updated article
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message,
      data: { updatedArticle },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes an article by its ID.
 *
 * This endpoint validates:
 * - The existence of the article before deletion.
 * - Author delete permissions and ownership if the user is an Author.
 *
 * If the article has an associated image, it will be deleted from Cloudinary.
 * Responds with appropriate success or error messages.
 *
 * @param req - Express request object containing the `articleId` in params.
 * @param res - Express response object used to send the statusText and message.
 * @param next - Express next function to handle errors.
 */
export const deleteArticle: ExtendedRequestHandler<
  DeleteArticleRequest,
  DeleteArticleResponse
> = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const requesterId = (res.locals.userInfo as AccessTokenUserInfo).user_id;
    const requesterRole = (res.locals.userInfo as AccessTokenUserInfo).role;

    const article = await articlesModel.findArticleById(articleId, [
      "article_id",
      "image",
      "creator_id",
    ]);

    if (!article) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Article not found.",
      });
    }

    // Check for author delete permissions if the user is an Author
    if (requesterRole === ROLES_LIST.Author) {
      // Handle case where author is not the creator
      if (requesterId !== article.creator_id) {
        articlesLogger.warn(
          `deleteArticle: Unauthorized delete attempt, Author {${requesterId}} tried to delete article {${articleId}}.`,
        );
        return res.status(403).send({
          statusText: httpStatusText.FAIL,
          message: "You don't have access to this resource.",
        });
      }

      const author = await authorsModel.findAuthorById(requesterId, [
        "user_id",
      ]);

      // Handle case where author is not found
      if (!author) {
        return res.status(404).send({
          statusText: httpStatusText.FAIL,
          message: "Author not found.",
        });
      }

      // Check if the author has permission to delete articles
      if (!author.permissions.delete) {
        articlesLogger.warn(
          `deleteArticle: Permission denied, Author {${requesterId}} attempted to delete article {${articleId}} without sufficient permissions.`,
        );
        return res.status(403).send({
          statusText: httpStatusText.FAIL,
          message: "You don't have permission to delete articles.",
        });
      }
    }

    // Perform the deletion
    await articlesModel.deleteArticle(articleId);

    // Delete the article image from Cloudinary if it exists
    if (article.image) {
      await deleteFileFromCloudinary(article.image);
    }

    articlesLogger.info(
      `deleteArticle: Article {${articleId}} deleted successfully by {${requesterRole}}.`,
    );

    // Send a success response with no content (204 No Content)
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a list of saved articles for a user.
 * Accepts optional query parameters for sorting, limit, and skip.
 * Responds with the list of saved articles or an appropriate error message.
 *
 * @param req - Express request object containing `userId` in params and optional `order`, `limit`, and `skip` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getSavedArticles: ExtendedRequestHandler<
  GetSavedArticlesRequest,
  GetSavedArticlesResponse
> = async (req, res, next) => {
  try {
    // Extract userId from request parameters
    const userId = (res.locals.userInfo as AccessTokenUserInfo).user_id;

    // Parse sorting, limit, and skip parameters with defaults
    const order = req.query.order === "old" ? 1 : -1;
    const limit: number = req.query?.limit ? Number(req.query.limit) : 10;
    const skip: number = req.query?.skip ? Number(req.query.skip) : 0;

    // Ensure valid limit and skip values
    if (limit <= 0 || skip < 0) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message:
          "Invalid query parameters. Limit must be positive and skip must be non-negative.",
      });
    }

    // Fetch saved articles for the user
    const savedArticles: IArticle[] = await articlesModel.getSavedArticles(
      userId,
      order,
      limit,
      skip,
    );

    // Send response with the list of saved articles
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Saved articles retrieved successfully.",
      data: { articles: savedArticles },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Checks if a specific article is saved by the user.
 * Responds with a boolean indicating whether the article is saved or an error message.
 *
 * @param req - Express request object containing `userId` in res.locals and `articleId` in params.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const isArticleSaved: ExtendedRequestHandler<
  IsArticleSavedRequest,
  IsArticleSavedResponse
> = async (req, res, next) => {
  try {
    // Extract userId from res.locals and articleId from request params
    const userId = (res.locals.userInfo as AccessTokenUserInfo).user_id;
    const { articleId } = req.params;

    // Validate articleId
    if (!articleId) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Missing articleId parameter.",
      });
    }

    // Check if the article is saved by the user
    const isArticleSaved: boolean = await articlesModel.isArticleSaved(
      userId,
      articleId,
    );

    // Send response with the result
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Article save status retrieved successfully.",
      data: { isArticleSaved },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Saves an article for the user.
 * Responds with a success message or an appropriate error message.
 *
 * @param req - Express request object containing `userId` in res.locals and `articleId` in params.
 * @param res - Express response object used to send statusText and message.
 * @param next - Express next function to handle errors.
 */
export const saveArticle: ExtendedRequestHandler<
  SaveArticleRequest,
  SaveArticleResponse
> = async (req, res, next) => {
  try {
    // Extract userId from res.locals and articleId from request params
    const userId = (res.locals.userInfo as AccessTokenUserInfo).user_id;
    const { articleId } = req.params;

    // Validate articleId
    if (!articleId) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Missing articleId in the request params.",
      });
    }

    // Save the article for the user
    await articlesModel.saveArticle(userId, articleId);

    // Send success response
    res.status(201).send({
      statusText: httpStatusText.SUCCESS,
      message: "Article saved successfully.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Removes a saved article for the user.
 * Responds with a success message or an appropriate error message.
 *
 * @param req - Express request object containing `userId` in res.locals and `articleId` in params.
 * @param res - Express response object used to send statusText and message.
 * @param next - Express next function to handle errors.
 */
export const unsaveArticle: ExtendedRequestHandler<
  UnsaveArticleRequest,
  UnsaveArticleResponse
> = async (req, res, next) => {
  try {
    // Extract userId from res.locals and articleId from request params
    const userId = (res.locals.userInfo as AccessTokenUserInfo).user_id;
    const { articleId } = req.params;

    // Validate articleId
    if (!articleId) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Missing articleId parameter.",
      });
    }

    // Remove the saved article for the user
    await articlesModel.unsaveArticle(userId, articleId);

    // Send success response
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
