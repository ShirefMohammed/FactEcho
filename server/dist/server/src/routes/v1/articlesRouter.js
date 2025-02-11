"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var articlesController_1 = require("../../controllers/v1/articlesController");
var checkCache_1 = require("../../middleware/checkCache");
var verifyJWT_1 = require("../../middleware/verifyJWT");
var verifyRole_1 = require("../../middleware/verifyRole");
var rolesList_1 = require("../../utils/rolesList");
var router = express_1.default.Router();
/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Retrieve a paginated list of articles.
 *     description: Fetches articles with optional sorting and pagination. Accessible to all users.
 *     tags: [Articles_V1]
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
 *         description: Number of articles per page.
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
 *         description: Articles successfully retrieved.
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
 *                   example: "Articles retrieved successfully."
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
 * /articles:
 *   post:
 *     summary: Create a new article.
 *     description: Adds a new article. Accessible by both Admin and authors.
 *     tags: [Articles_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - image
 *               - category_id
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the article.
 *                 example: "Advancements in AI"
 *               content:
 *                 type: string
 *                 description: The content of the article.
 *                 example: "This article explores the latest advancements in artificial intelligence."
 *               image:
 *                 type: string
 *                 description: Cloudinary URL of the article image.
 *                 example: "https://res.cloudinary.com/dtw6e1hhh/image/upload/v1733077686/defaultAvatar.jpg"
 *               category_id:
 *                 type: string
 *                 description: The ID of the article's category.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Article created successfully.
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
 *                   example: "Article created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     newArticle:
 *                       type: object
 *                       description: Newly created article object.
 *       400:
 *         description: Missing or invalid input data.
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
 *                   example: "Article title, content, image, and category_id are required."
 *       403:
 *         description: Permission denied for creating articles.
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
 *                   example: "You don't have permission to create articles."
 *       409:
 *         description: Duplicate article title.
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
 *                   example: "An article with the same title already exists."
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
    .get(articlesController_1.getArticles)
    .post(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin, rolesList_1.ROLES_LIST.Author), articlesController_1.createArticle);
/**
 * @swagger
 * /articles/search:
 *   get:
 *     summary: Search for articles based on a search key.
 *     description: Searches articles using a search key, with optional sorting and pagination parameters. Accessible to all users.
 *     tags: [Articles_V1]
 *     parameters:
 *       - name: searchKey
 *         in: query
 *         description: The search term to find matching articles.
 *         required: true
 *         schema:
 *           type: string
 *           example: "technology"
 *       - name: order
 *         in: query
 *         description: Sorting order. Use "new" for newest first, "old" for oldest first.
 *         required: false
 *         schema:
 *           type: string
 *           example: "new"
 *       - name: limit
 *         in: query
 *         description: Number of articles per page.
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
 *         description: Articles successfully retrieved.
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
 *                   example: "Articles searched successfully."
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
router.route("/search").get(articlesController_1.searchArticles);
/**
 * @swagger
 * /articles/count:
 *   get:
 *     summary: Retrieve the total count of articles.
 *     description: Fetches the total number of articles in the system. Accessible by all.
 *     tags: [Articles_V1]
 *     responses:
 *       200:
 *         description: Total articles count successfully retrieved.
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
 *                   example: "Total articles count retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalArticlesCount:
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
router.route("/count").get(articlesController_1.getTotalArticlesCount);
/**
 * @swagger
 * /articles/explore:
 *   get:
 *     summary: Retrieve a list of random articles.
 *     description: Fetches random articles, with an optional limit. Accessible to all users.
 *     tags: [Articles_V1]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of random articles to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Random articles successfully retrieved.
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
 *                   example: "Explored random articles retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Article object structure.
 *       400:
 *         description: Invalid limit value.
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
 *                   example: "Invalid limit. Limit must be a positive integer."
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
router.route("/explore").get(checkCache_1.checkCache, articlesController_1.getExploredArticles);
/**
 * @swagger
 * /articles/trend:
 *   get:
 *     summary: Retrieve a list of trending articles.
 *     description: Fetches trending articles based on views, with an optional limit. Accessible to all users.
 *     tags: [Articles_V1]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of trending articles to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Trending articles successfully retrieved.
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
 *                   example: "Trending articles retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Article object structure.
 *       400:
 *         description: Invalid limit value.
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
 *                   example: "Invalid limit. Limit must be a positive integer."
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
router.route("/trend").get(checkCache_1.checkCache, articlesController_1.getTrendArticles);
/**
 * @swagger
 * /articles/latest:
 *   get:
 *     summary: Retrieve a list of latest articles.
 *     description: Fetches latest articles based on creation date, with an optional limit. Accessible to all users.
 *     tags: [Articles_V1]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of latest articles to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Latest articles successfully retrieved.
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
 *                   example: "Latest articles retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Article object structure.
 *       400:
 *         description: Invalid limit value.
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
 *                   example: "Invalid limit. Limit must be a positive integer."
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
router.route("/latest").get(checkCache_1.checkCache, articlesController_1.getLatestArticles);
/**
 * @swagger
 * /articles/saved:
 *   get:
 *     summary: Retrieve a user's saved articles.
 *     description: Fetches a paginated list of saved articles for the authenticated user with optional sorting, limit, and page parameters.
 *     tags: [Articles_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: order
 *         in: query
 *         description: Sorting order. Use "new" for newest first, "old" for oldest first.
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["new", "old"]
 *           example: "new"
 *       - name: limit
 *         in: query
 *         description: Number of articles to retrieve per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         description: Page number to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Saved articles retrieved successfully.
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
 *                   example: "Saved articles retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Article object structure.
 *       400:
 *         description: Invalid query parameters.
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
router.route("/saved").get(verifyJWT_1.verifyJWT, articlesController_1.getSavedArticles);
/**
 * @swagger
 * /articles/{articleId}:
 *   get:
 *     summary: Retrieve details of a specific article.
 *     description: Fetches detailed information about an article using its unique ID. Accessible to all users.
 *     tags: [Articles_V1]
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: The unique identifier of the article to retrieve.
 *         schema:
 *           type: string
 *           example: "f6a3f37c-5b4d-11ee-8c99-0242ac120002"
 *     responses:
 *       200:
 *         description: Article details successfully retrieved.
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
 *                   example: "Article retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     article:
 *                       type: object
 *                       description: Details of the article.
 *       404:
 *         description: Article not found.
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
 *                   example: "Article not found."
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
 * /articles/{articleId}:
 *   patch:
 *     summary: Update an existing article.
 *     description: Updates an article's title, content, image, or category based on the provided fields. Requires Admin or Author permissions.
 *     tags: [Articles_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: The unique ID of the article to update.
 *         schema:
 *           type: string
 *           example: "f6a3f37c-5b4d-11ee-8c99-0242ac120002"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the article.
 *                 example: "Updated Article Title"
 *               content:
 *                 type: string
 *                 description: The updated content of the article.
 *                 example: "This is the updated content for the article."
 *               image:
 *                 type: string
 *                 description: URL of the new image for the article.
 *                 example: "https://cloudinary.com/sample-image.jpg"
 *               category_id:
 *                 type: string
 *                 description: The ID of the new category for the article.
 *                 example: "12345-category-id"
 *     responses:
 *       200:
 *         description: Article updated successfully.
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
 *                   example: "Article updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedArticle:
 *                       type: object
 *                       description: Details of the updated article.
 *       403:
 *         description: Unauthorized access or insufficient permissions.
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
 *                   example: "You don't have access to this resource."
 *       404:
 *         description: Article or Author not found.
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
 *                   example: "Article not found."
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
 * /articles/{articleId}:
 *   delete:
 *     summary: Delete an existing article by ID.
 *     description: >
 *       Deletes an article by its ID. Validates if the article exists and checks if the user has the appropriate permissions to delete it.
 *       If the article has an associated image, it will be removed from Cloudinary.
 *     tags: [Articles_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: The unique ID of the article to delete.
 *         schema:
 *           type: string
 *           example: "f6a3f37c-5b4d-11ee-8c99-0242ac120002"
 *     responses:
 *       204:
 *         description: Article deleted successfully. No content is returned.
 *       403:
 *         description: Unauthorized access or insufficient permissions.
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
 *                   example: "You don't have access to this resource."
 *       404:
 *         description: Article or Author not found.
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
 *                   example: "Article not found."
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
    .route("/:articleId")
    .get(articlesController_1.getArticle)
    .patch(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin, rolesList_1.ROLES_LIST.Author), articlesController_1.updateArticle)
    .delete(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin, rolesList_1.ROLES_LIST.Author), articlesController_1.deleteArticle);
/**
 * @swagger
 * /articles/{articleId}/save:
 *   get:
 *     summary: Check if an article is saved by the user.
 *     description: Determines whether a specific article is saved by the authenticated user.
 *     tags: [Articles_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: ID of the article to check.
 *         schema:
 *           type: string
 *           example: "d4e5f6g7h8i9j0"
 *     responses:
 *       200:
 *         description: Article save status retrieved successfully.
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
 *                   example: "Article save status retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     isArticleSaved:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Missing or invalid articleId parameter.
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
 *                   example: "Missing articleId parameter."
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
 * /articles/{articleId}/save:
 *   post:
 *     summary: Save an article for the user.
 *     description: Saves a specific article for the authenticated user.
 *     tags: [Articles_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: ID of the article to save.
 *         schema:
 *           type: string
 *           example: "d4e5f6g7h8i9j0"
 *     responses:
 *       201:
 *         description: Article saved successfully.
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
 *                   example: "Article saved successfully."
 *       400:
 *         description: Missing or invalid articleId parameter.
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
 *                   example: "Missing articleId in the request params."
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
 * /articles/{articleId}/save:
 *   delete:
 *     summary: Unsave an article for the user.
 *     description: Removes a saved article for the authenticated user.
 *     tags: [Articles_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: ID of the article to unsave.
 *         schema:
 *           type: string
 *           example: "d4e5f6g7h8i9j0"
 *     responses:
 *       204:
 *         description: Article unsaved successfully (no content).
 *       400:
 *         description: Missing or invalid articleId parameter.
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
 *                   example: "Missing articleId parameter."
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
    .route("/:articleId/save")
    .get(verifyJWT_1.verifyJWT, articlesController_1.isArticleSaved)
    .post(verifyJWT_1.verifyJWT, articlesController_1.saveArticle)
    .delete(verifyJWT_1.verifyJWT, articlesController_1.unsaveArticle);
exports.default = router;
