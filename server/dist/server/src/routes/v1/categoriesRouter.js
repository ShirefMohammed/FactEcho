"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var categoriesController_1 = require("../../controllers/v1/categoriesController");
var checkCache_1 = require("../../middleware/checkCache");
var verifyJWT_1 = require("../../middleware/verifyJWT");
var verifyRole_1 = require("../../middleware/verifyRole");
var rolesList_1 = require("../../utils/rolesList");
var router = express_1.default.Router();
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories.
 *     description: Fetches categories with optional sorting and pagination. Accessible to all users.
 *     tags: [Categories_V1]
 *     parameters:
 *       - name: order
 *         in: query
 *         description: Sorting order. Use "new" for newest first, "old" for oldest first.
 *         required: false
 *         schema:
 *           type: string
 *           example: "new"
 *       - name: limit
 *         in: query
 *         description: Number of categories per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Categories successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Categories retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Category object structure.
 *       400:
 *         description: Invalid pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Invalid pagination parameters. Limit and page must be positive integers."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category.
 *     description: Adds a new category. Accessible only by Admin.
 *     tags: [Categories_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the category.
 *                 example: "Technology"
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Category created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     newCategory:
 *                       type: object
 *                       description: Newly created category object.
 *       400:
 *         description: Missing or invalid category title.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Category title is required."
 *       409:
 *         description: Duplicate category title.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "A category with the same title already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router
    .route("/")
    .get(checkCache_1.checkCache, categoriesController_1.getCategories)
    .post(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin), categoriesController_1.createCategory);
/**
 * @swagger
 * /categories/search:
 *   get:
 *     summary: Search for categories based on a search key.
 *     description: Searches for categories using a search key with optional sorting and pagination. Accessible to all users.
 *     tags: [Categories_V1]
 *     parameters:
 *       - name: searchKey
 *         in: query
 *         description: The keyword to search for categories.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Technology"
 *       - name: order
 *         in: query
 *         description: Sorting order. Use "new" for newest first, "old" for oldest first.
 *         required: false
 *         schema:
 *           type: string
 *           example: "new"
 *       - name: limit
 *         in: query
 *         description: Number of categories per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Search results successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Search results retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Category object structure.
 *       400:
 *         description: Invalid search or pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "FAIL"
 *                 message:
 *                   type: string
 *                   example: "Invalid search key or pagination parameters."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.route("/search").get(checkCache_1.checkCache, categoriesController_1.searchCategories);
/**
 * @swagger
 * /categories/count:
 *   get:
 *     summary: Retrieve the total count of categories.
 *     description: Fetches the total number of categories in the system. Accessible only by all.
 *     tags: [Categories_V1]
 *     responses:
 *       200:
 *         description: Total categories count successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Total categories count retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCategoriesCount:
 *                       type: integer
 *                       example: 350
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.route("/count").get(checkCache_1.checkCache, categoriesController_1.getTotalCategoriesCount);
/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Retrieve category details
 *     description: Fetches details of a specific category by its ID.
 *     tags: [Categories_V1]
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: The unique identifier of the category to retrieve.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: SUCCESS
 *                 message:
 *                   type: string
 *                   example: Category retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       description: Category object structure.
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: FAIL
 *                 message:
 *                   type: string
 *                   example: Category not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
/**
 * @swagger
 * /categories/{categoryId}:
 *   patch:
 *     summary: Update category details
 *     description: Updates the details of a specific category by its ID. Only accessible by Admin.
 *     tags: [Categories_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: The unique identifier of the category to update.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       description: Fields to update in the category.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title for the category.
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: SUCCESS
 *                 message:
 *                   type: string
 *                   example: Category updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedCategory:
 *                       type: object
 *                       description: Category object structure.
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: FAIL
 *                 message:
 *                   type: string
 *                   example: Category not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     summary: Delete category
 *     description: Deletes a specific category by its ID. Only accessible by Admin.
 *     tags: [Categories_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: The unique identifier of the category to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Category deleted successfully.
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: FAIL
 *                 message:
 *                   type: string
 *                   example: Category not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router
    .route("/:categoryId")
    .get(checkCache_1.checkCache, categoriesController_1.getCategory)
    .patch(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin), categoriesController_1.updateCategory)
    .delete(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin), categoriesController_1.deleteCategory);
/**
 * @swagger
 * /categories/{categoryId}/articles:
 *   get:
 *     summary: Retrieve articles for a category
 *     description: Fetches a paginated list of articles for a specific category.
 *     tags: [Categories_V1]
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: The unique identifier of the category whose articles are to be retrieved.
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: order
 *         in: query
 *         description: Sort order for articles. Use "new" for newest first or "old" for oldest first.
 *         schema:
 *           type: string
 *           enum: [new, old]
 *       - name: limit
 *         in: query
 *         description: Number of articles per page.
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Articles retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: SUCCESS
 *                 message:
 *                   type: string
 *                   example: Articles retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Article object structure.
 *       400:
 *         description: Invalid pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: FAIL
 *                 message:
 *                   type: string
 *                   example: Invalid pagination parameters. Limit and page must be positive integers.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.route("/:categoryId/articles").get(checkCache_1.checkCache, categoriesController_1.getCategoryArticles);
exports.default = router;
