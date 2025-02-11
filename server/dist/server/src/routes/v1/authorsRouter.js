"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authorsController_1 = require("../../controllers/v1/authorsController");
var verifyJWT_1 = require("../../middleware/verifyJWT");
var verifyRole_1 = require("../../middleware/verifyRole");
var rolesList_1 = require("../../utils/rolesList");
var router = express_1.default.Router();
/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Retrieve a list of authors.
 *     description: Fetches authors with optional pagination. Accessible only by Admin.
 *     tags: [Authors_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of authors per page.
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
 *         description: Authors successfully retrieved.
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
 *                   example: "Authors retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Author object structure.
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
router.route("/").get(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin), authorsController_1.getAuthors);
/**
 * @swagger
 * /authors/search:
 *   get:
 *     summary: Search for authors based on a search key.
 *     description: Searches for authors using a search key with optional pagination. Accessible only by Admin.
 *     tags: [Authors_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     parameters:
 *       - name: searchKey
 *         in: query
 *         description: The keyword to search for authors.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Shiref"
 *       - name: limit
 *         in: query
 *         description: Number of authors per page.
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
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Author object structure.
 *       400:
 *         description: Invalid search parameters.
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
router
    .route("/search")
    .get(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin), authorsController_1.searchAuthors);
/**
 * @swagger
 * /authors/count:
 *   get:
 *     summary: Retrieve the total count of authors.
 *     description: Fetches the total number of authors in the system. Accessible only by Admin.
 *     tags: [Authors_V1]
 *     security:
 *       - BearerAuth: [] # Use Bearer token authentication
 *     responses:
 *       200:
 *         description: Total authors count successfully retrieved.
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
 *                   example: "Total authors count retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAuthorsCount:
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
router
    .route("/count")
    .get(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin), authorsController_1.getTotalAuthorsCount);
/**
 * @swagger
 * /authors/{authorId}:
 *   get:
 *     summary: Retrieve a author by their ID.
 *     description: Fetches a author's details by ID. Accessible for all.
 *     tags: [Authors_V1]
 *     parameters:
 *       - name: authorId
 *         in: path
 *         required: true
 *         description: The ID of the author to retrieve.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *     responses:
 *       200:
 *         description: Author retrieved successfully.
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
 *                   example: "Author retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     author:
 *                       type: object
 *                       description: Author object structure.
 *       404:
 *         description: Author not found.
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
 *                   example: "Account not found."
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
router.route("/:authorId").get(authorsController_1.getAuthor);
/**
 * @swagger
 * /authors/{authorId}/permissions:
 *   patch:
 *     summary: Update an author's permissions.
 *     description: Updates the permissions of a specific author. Accessible only by Admins.
 *     tags: [Authors_V1]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: authorId
 *         in: path
 *         required: true
 *         description: The ID of the author whose permissions are to be updated.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: object
 *                 description: Object containing the author's permissions.
 *                 properties:
 *                   user_id:
 *                     type: string
 *                     description: The UUID of the author to update permissions for.
 *                     example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *                   create:
 *                     type: boolean
 *                     description: Whether the author has create permissions.
 *                     example: true
 *                   update:
 *                     type: boolean
 *                     description: Whether the author has update permissions.
 *                     example: true
 *                   delete:
 *                     type: boolean
 *                     description: Whether the author has delete permissions.
 *                     example: true
 *     responses:
 *       200:
 *         description: Author permissions updated successfully.
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
 *                   example: "Author permissions updated successfully."
 *       400:
 *         description: Permissions are required.
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
 *                   example: "Permissions are required."
 *       403:
 *         description: Forbidden. Only Admin authors can update permissions.
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
 *                   example: "Access denied. Admin role required."
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
    .route("/:authorId/permissions")
    .patch(verifyJWT_1.verifyJWT, (0, verifyRole_1.verifyRole)(rolesList_1.ROLES_LIST.Admin), authorsController_1.updateAuthorPermissions);
/**
 * @swagger
 * /authors/{authorId}/articles:
 *   get:
 *     summary: Retrieve articles by a specific author.
 *     description: Fetches a paginated list of articles by a specific author. Accessible for all.
 *     tags: [Authors_V1]
 *     parameters:
 *       - name: authorId
 *         in: path
 *         required: true
 *         description: The ID of the author whose articles to retrieve.
 *         schema:
 *           type: string
 *           example: "f0457cb8-748f-4f4a-9147-a13e1ec28d28"
 *       - name: order
 *         in: query
 *         description: Order of the articles. "old" for ascending, "new" for descending.
 *         required: false
 *         schema:
 *           type: string
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
 *         description: Page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
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
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Author's articles retrieved successfully."
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
router.route("/:authorId/articles").get(authorsController_1.getAuthorArticles);
exports.default = router;
