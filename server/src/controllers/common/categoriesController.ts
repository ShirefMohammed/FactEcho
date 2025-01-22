import {
  AccessTokenUserInfo,
  CreateCategoryRequest,
  CreateCategoryResponse,
  DeleteCategoryRequest,
  DeleteCategoryResponse,
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetCategoryArticlesRequest,
  GetCategoryArticlesResponse,
  GetCategoryRequest,
  GetCategoryResponse,
  GetTotalCategoriesCountRequest,
  GetTotalCategoriesCountResponse,
  SearchCategoriesRequest,
  SearchCategoriesResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "@shared/types/apiTypes";
import { IArticle, ICategory } from "@shared/types/entitiesTypes";

import { getServiceLogger } from "../../config/logger";
import { articlesModel, categoriesModel } from "../../database";
import { ExtendedRequestHandler } from "../../types/requestHandlerTypes";
import { httpStatusText } from "../../utils/httpStatusText";

// Logger for categories service
const categoriesLogger = getServiceLogger("categories");

/**
 * Retrieves a paginated list of categories.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of categories or an appropriate error message.
 *
 * @param req - Express request object containing optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getCategories: ExtendedRequestHandler<
  GetCategoriesRequest,
  GetCategoriesResponse
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

    // Fetch paginated categories
    const categories: ICategory[] = await categoriesModel.getCategories(
      order,
      limit,
      skip,
    );

    // Send response with categories
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Categories retrieved successfully.",
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Searches for categories based on a search key.
 * Accepts optional query parameters for search, sorting, and pagination.
 * Responds with the list of matching categories or an appropriate error message.
 *
 * @param req - Express request object containing `searchKey` and optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const searchCategories: ExtendedRequestHandler<
  SearchCategoriesRequest,
  SearchCategoriesResponse
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

    // Fetch paginated categories matching the search key
    const categories: ICategory[] = await categoriesModel.searchCategories(
      searchKey,
      order,
      limit,
      skip,
    );

    // Send response with categories and pagination metadata
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Categories searched successfully.",
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves the total count of categories in the system.
 * Responds with the total user count or an appropriate error message.
 *
 * @param req - Express request object (unused in this case).
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getTotalCategoriesCount: ExtendedRequestHandler<
  GetTotalCategoriesCountRequest,
  GetTotalCategoriesCountResponse
> = async (_req, res, next) => {
  try {
    const totalCategoriesCount: number =
      await categoriesModel.getCategoriesCount();

    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Total categories count retrieved successfully.",
      data: { totalCategoriesCount },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves details of a specific category by ID.
 * Responds with the category details or an appropriate error message.
 *
 * @param req - Express request object containing the `categoryId` parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getCategory: ExtendedRequestHandler<
  GetCategoryRequest,
  GetCategoryResponse
> = async (req, res, next) => {
  try {
    // Fetch the category by ID
    const category: ICategory | null = await categoriesModel.findCategoryById(
      req.params.categoryId,
    );

    // Handle category not found
    if (!category) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Category not found.",
      });
    }

    // Send response with the category details
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Category retrieved successfully.",
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new category with the provided title and creator ID.
 * Validates the request body and ensures no duplicate titles exist.
 * Responds with the newly created category or an appropriate error message.
 *
 * @param req - Express request object containing the `title` in the body.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const createCategory: ExtendedRequestHandler<
  CreateCategoryRequest,
  CreateCategoryResponse
> = async (req, res, next) => {
  try {
    // Validate required field: title
    const { title } = req.body;
    if (!title) {
      return res.status(400).send({
        statusText: httpStatusText.FAIL,
        message: "Category title is required.",
      });
    }

    // Check if a category with the same title already exists
    const existingCategory = await categoriesModel.findCategoryByTitle(title, [
      "category_id",
    ]);

    if (existingCategory) {
      return res.status(409).send({
        statusText: httpStatusText.FAIL,
        message: "A category with the same title already exists.",
      });
    }

    // Create the new category
    const creatorId = (res.locals.userInfo as AccessTokenUserInfo).user_id;
    const newCategory = await categoriesModel.createCategory({
      title: title,
      creator_id: creatorId,
    });

    categoriesLogger.info(
      `createCategory: New Category with title {${title}} created successfully`,
    );

    // Send success response with the new category
    res.status(201).send({
      statusText: httpStatusText.SUCCESS,
      message: "Category created successfully.",
      data: { newCategory },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates an existing category with the provided fields.
 * Validates if the category exists and ensures no duplicate titles are used.
 * Responds with the updated category or an appropriate error message.
 *
 * @param req - Express request object containing the `categoryId` in params and optional `title` in the body.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const updateCategory: ExtendedRequestHandler<
  UpdateCategoryRequest,
  UpdateCategoryResponse
> = async (req, res, next) => {
  try {
    // Retrieve the category by ID
    const categoryId = req.params.categoryId;
    const existingCategory = await categoriesModel.findCategoryById(categoryId);

    if (!existingCategory) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Category not found.",
      });
    }

    let message = "Category updated successfully.";
    const updatedFields: Partial<ICategory> = {};

    // Handle title updates with duplicate check
    const { title } = req.body;
    if (title) {
      const duplicateCategory = await categoriesModel.findCategoryByTitle(
        title,
        ["category_id"],
      );

      if (duplicateCategory && duplicateCategory.category_id !== categoryId) {
        message +=
          " Title was not updated as another category with the same title exists.";
      } else {
        updatedFields.title = title;
      }
    }

    // Update the category if there are fields to update
    let updatedCategory = {} as ICategory;
    if (Object.keys(updatedFields).length > 0) {
      updatedCategory = await categoriesModel.updateCategory(
        categoryId,
        updatedFields,
      );
    }

    categoriesLogger.info(
      `updateCategory: Category with id {${categoryId}} updated successfully`,
    );

    // Send success response with updated category
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message,
      data: { updatedCategory },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes an existing category by ID.
 * Validates if the category exists before deletion.
 * Responds with appropriate success or error messages.
 *
 * @param req - Express request object containing the `categoryId` in params.
 * @param res - Express response object used to send the statusText and message.
 * @param next - Express next function to handle errors.
 */
export const deleteCategory: ExtendedRequestHandler<
  DeleteCategoryRequest,
  DeleteCategoryResponse
> = async (req, res, next) => {
  try {
    // Retrieve the category by ID
    const categoryId = req.params.categoryId;
    const existingCategory = await categoriesModel.findCategoryById(
      categoryId,
      ["category_id"],
    );

    if (!existingCategory) {
      return res.status(404).send({
        statusText: httpStatusText.FAIL,
        message: "Category not found.",
      });
    }

    // Perform the deletion
    await categoriesModel.deleteCategory(categoryId);

    categoriesLogger.info(
      `deleteCategory: Category with id {${categoryId}} deleted successfully`,
    );

    // Send a success response with no content
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a paginated list of articles for a specific category.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of articles or an appropriate error message.
 *
 * @param req - Express request object containing `categoryId` in params and optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
export const getCategoryArticles: ExtendedRequestHandler<
  GetCategoryArticlesRequest,
  GetCategoryArticlesResponse
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

    // Fetch paginated articles for the category
    const articles: IArticle[] = await articlesModel.getCategoryArticles(
      req.params.categoryId,
      order,
      limit,
      skip,
    );

    // Send response with articles
    res.status(200).send({
      statusText: httpStatusText.SUCCESS,
      message: "Articles retrieved successfully.",
      data: { articles },
    });
  } catch (err) {
    next(err);
  }
};
