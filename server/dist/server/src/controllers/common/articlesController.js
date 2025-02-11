"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveArticle = exports.saveArticle = exports.isArticleSaved = exports.getSavedArticles = exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticle = exports.getLatestArticles = exports.getTrendArticles = exports.getExploredArticles = exports.getTotalArticlesCount = exports.searchArticles = exports.getArticles = void 0;
var logger_1 = require("../../config/logger");
var database_1 = require("../../database");
var cacheResponse_1 = require("../../utils/cacheResponse");
var deleteFileFromCloudinary_1 = require("../../utils/deleteFileFromCloudinary");
var deleteRelatedCachedItemsForRequest_1 = require("../../utils/deleteRelatedCachedItemsForRequest");
var httpStatusText_1 = require("../../utils/httpStatusText");
var isFileExistsInCloudinary_1 = require("../../utils/isFileExistsInCloudinary");
var rolesList_1 = require("../../utils/rolesList");
// Logger for articles service
var articlesLogger = (0, logger_1.getServiceLogger)("articles");
/**
 * Retrieves a paginated list of articles.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getArticles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, limit, page, skip, articles, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                order = req.query.order === "old" ? 1 : -1;
                limit = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) ? Number(req.query.limit) : 10;
                page = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.page) ? Number(req.query.page) : 1;
                // Ensure valid pagination values
                if (limit <= 0 || page <= 0) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid pagination parameters. Limit and page must be positive integers.",
                        })];
                }
                skip = (page - 1) * limit;
                return [4 /*yield*/, database_1.articlesModel.getArticles(order, limit, skip)];
            case 1:
                articles = _c.sent();
                // Send response with articles and pagination metadata
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Articles retrieved successfully.",
                    data: { articles: articles },
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _c.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getArticles = getArticles;
/**
 * Searches for articles based on a search key.
 * Accepts optional query parameters for search, sorting, and pagination.
 * Responds with the list of matching articles or an appropriate error message.
 *
 * @param req - Express request object containing `searchKey` and optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var searchArticles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchKey, order, limit, page, skip, articles, err_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                searchKey = req.query.searchKey || "";
                order = req.query.order === "old" ? 1 : -1;
                limit = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) ? Number(req.query.limit) : 10;
                page = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.page) ? Number(req.query.page) : 1;
                // Ensure valid pagination values
                if (limit <= 0 || page <= 0) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid pagination parameters. Limit and page must be positive integers.",
                        })];
                }
                skip = (page - 1) * limit;
                return [4 /*yield*/, database_1.articlesModel.searchArticles(searchKey, order, limit, skip)];
            case 1:
                articles = _c.sent();
                // Send response with articles and pagination metadata
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Articles searched successfully.",
                    data: { articles: articles },
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _c.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchArticles = searchArticles;
/**
 * Retrieves the total count of articles in the system.
 * Responds with the total user count or an appropriate error message.
 *
 * @param req - Express request object (unused in this case).
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getTotalArticlesCount = function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var totalArticlesCount, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.articlesModel.getArticlesCount()];
            case 1:
                totalArticlesCount = _a.sent();
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Total articles count retrieved successfully.",
                    data: { totalArticlesCount: totalArticlesCount },
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTotalArticlesCount = getTotalArticlesCount;
/**
 * Retrieves a list of random articles.
 * Accepts an optional `limit` query parameter to specify the number of random articles to return.
 * Responds with the list of random articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `limit` query parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getExploredArticles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, articles, err_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                limit = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) ? Number(req.query.limit) : 10;
                // Ensure valid limit value
                if (limit <= 0) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid limit. Limit must be a positive integer.",
                        })];
                }
                return [4 /*yield*/, database_1.articlesModel.getRandomArticles(limit)];
            case 1:
                articles = _b.sent();
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { articles: articles });
                // Send response with the list of random articles
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Explored Random articles retrieved successfully.",
                    data: { articles: articles },
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                next(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getExploredArticles = getExploredArticles;
/**
 * Retrieves a list of trending articles based on views.
 * Accepts an optional `limit` query parameter to specify the number of trending articles to return.
 * Responds with the list of trending articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `limit` query parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getTrendArticles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, articles, err_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                limit = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) ? Number(req.query.limit) : 10;
                // Ensure valid limit value
                if (limit <= 0) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid limit. Limit must be a positive integer.",
                        })];
                }
                return [4 /*yield*/, database_1.articlesModel.getTrendingArticles(limit)];
            case 1:
                articles = _b.sent();
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { articles: articles });
                // Send response with the list of trending articles
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Trending articles retrieved successfully.",
                    data: { articles: articles },
                });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _b.sent();
                next(err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTrendArticles = getTrendArticles;
/**
 * Retrieves a list of the latest articles based on their creation date.
 * Accepts an optional `limit` query parameter to specify the number of latest articles to return.
 * Responds with the list of latest articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `limit` query parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getLatestArticles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, articles, err_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                limit = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) ? Number(req.query.limit) : 10;
                // Ensure valid limit value
                if (limit <= 0) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid limit. Limit must be a positive integer.",
                        })];
                }
                return [4 /*yield*/, database_1.articlesModel.getLatestArticles(limit)];
            case 1:
                articles = _b.sent();
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { articles: articles });
                // Send response with the list of latest articles
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Latest articles retrieved successfully.",
                    data: { articles: articles },
                });
                return [3 /*break*/, 3];
            case 2:
                err_6 = _b.sent();
                next(err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getLatestArticles = getLatestArticles;
/**
 * Retrieves details of a specific article by ID and I increase article views by one.
 * Responds with the article details or an appropriate error message.
 *
 * @param req - Express request object containing the `articleId` parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getArticle = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var article, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.articlesModel.findArticleById(req.params.articleId)];
            case 1:
                article = _a.sent();
                // Handle article not found
                if (!article) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Article not found.",
                        })];
                }
                // Increase article views
                database_1.articlesModel.updateArticle(article.article_id, {
                    views: article.views + 1,
                });
                // Send response with the article details
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Article retrieved successfully.",
                    data: { article: article },
                });
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                next(err_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getArticle = getArticle;
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
var createArticle = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, image, category_id, creatorId, author, existingArticle, category, newArticle, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, title = _a.title, content = _a.content, image = _a.image, category_id = _a.category_id;
                if (!title || !content || !image || !category_id) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Article title, content, image, and category_id are required.",
                        })];
                }
                creatorId = res.locals.userInfo.user_id;
                if (!(res.locals.userInfo.role === rolesList_1.ROLES_LIST.Author)) return [3 /*break*/, 2];
                return [4 /*yield*/, database_1.authorsModel.findAuthorById(creatorId, ["user_id"])];
            case 1:
                author = _b.sent();
                if (!author) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Author not found.",
                        })];
                }
                // Verify if the author has permission to create articles
                if (!author.permissions.create) {
                    articlesLogger.warn("createArticle: Author {".concat(author.user_id, "} with no create permission tries to create new article"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have permission to create articles.",
                        })];
                }
                _b.label = 2;
            case 2: return [4 /*yield*/, database_1.articlesModel.findArticleByTitle(title, [
                    "article_id",
                ])];
            case 3:
                existingArticle = _b.sent();
                if (existingArticle) {
                    return [2 /*return*/, res.status(409).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "An article with the same title already exists.",
                        })];
                }
                return [4 /*yield*/, (0, isFileExistsInCloudinary_1.isFileExistsInCloudinary)(image)];
            case 4:
                // Verify that the image exists in Cloudinary storage
                if (!(_b.sent())) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Image is not uploaded to the storage.",
                        })];
                }
                return [4 /*yield*/, database_1.categoriesModel.findCategoryById(category_id, [
                        "category_id",
                    ])];
            case 5:
                category = _b.sent();
                if (!category) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Category not found.",
                        })];
                }
                return [4 /*yield*/, database_1.articlesModel.createArticle({
                        title: title,
                        content: content,
                        image: image,
                        category_id: category_id,
                        creator_id: creatorId,
                    })];
            case 6:
                newArticle = _b.sent();
                articlesLogger.info("createArticle: New Article with title {".concat(title, "} created successfully"));
                // Send a success response with the new article data
                res.status(201).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Article created successfully.",
                    data: { newArticle: newArticle },
                });
                return [3 /*break*/, 8];
            case 7:
                err_8 = _b.sent();
                next(err_8);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createArticle = createArticle;
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
var updateArticle = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var articleId, requesterId, requesterRole, _a, title, content, image, category_id, article, author, message, updatedFields, duplicateArticle, category, updatedArticle, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 13, , 14]);
                articleId = req.params.articleId;
                requesterId = res.locals.userInfo.user_id;
                requesterRole = res.locals.userInfo.role;
                _a = req.body, title = _a.title, content = _a.content, image = _a.image, category_id = _a.category_id;
                return [4 /*yield*/, database_1.articlesModel.findArticleById(req.params.articleId, [
                        "article_id",
                        "image",
                        "creator_id",
                    ])];
            case 1:
                article = _b.sent();
                if (!article) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Article not found.",
                        })];
                }
                // Handle case where admin is not the creator
                if (requesterRole === rolesList_1.ROLES_LIST.Admin &&
                    requesterId !== article.creator_id) {
                    articlesLogger.warn("updateArticle: Unauthorized update attempt, Admin {".concat(requesterId, "} tried to update article {").concat(articleId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have access to this resource.",
                        })];
                }
                if (!(requesterRole === rolesList_1.ROLES_LIST.Author)) return [3 /*break*/, 3];
                // Handle case where author is not the creator
                if (requesterId !== article.creator_id) {
                    articlesLogger.warn("updateArticle: Unauthorized article update attempted on {".concat(articleId, "} by author {").concat(requesterId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have access to this resource.",
                        })];
                }
                return [4 /*yield*/, database_1.authorsModel.findAuthorById(requesterId, [
                        "user_id",
                    ])];
            case 2:
                author = _b.sent();
                // Handle case where author is not found
                if (!author) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Author not found.",
                        })];
                }
                // Check if the author has permission to update articles
                if (!author.permissions.update) {
                    articlesLogger.warn("updateArticle: Permission denied, Author ".concat(requesterId, " attempted to update article ").concat(articleId, " without sufficient permissions."));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have permission to update articles.",
                        })];
                }
                _b.label = 3;
            case 3:
                message = "Article updated.";
                updatedFields = {};
                if (!title) return [3 /*break*/, 5];
                return [4 /*yield*/, database_1.articlesModel.findArticleByTitle(title, [
                        "article_id",
                    ])];
            case 4:
                duplicateArticle = _b.sent();
                if (duplicateArticle && duplicateArticle.article_id !== articleId) {
                    message +=
                        " Title is not updated as another article with the same title exists.";
                }
                else {
                    updatedFields.title = title;
                }
                _b.label = 5;
            case 5:
                // Update the content if provided
                if (content) {
                    updatedFields.content = content;
                }
                if (!image) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, isFileExistsInCloudinary_1.isFileExistsInCloudinary)(image)];
            case 6:
                if (!(_b.sent())) {
                    message +=
                        " Image is not updated as it is not uploaded to the storage.";
                }
                else {
                    updatedFields.image = image;
                }
                _b.label = 7;
            case 7:
                if (!category_id) return [3 /*break*/, 9];
                return [4 /*yield*/, database_1.categoriesModel.findCategoryById(category_id, [
                        "category_id",
                    ])];
            case 8:
                category = _b.sent();
                if (!category) {
                    message += " category_id is not updated as it was not found.";
                }
                else {
                    updatedFields.category_id = category_id;
                }
                _b.label = 9;
            case 9: return [4 /*yield*/, database_1.articlesModel.updateArticle(req.params.articleId, updatedFields)];
            case 10:
                updatedArticle = _b.sent();
                if (!updatedFields.image) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, deleteFileFromCloudinary_1.deleteFileFromCloudinary)(article.image)];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                articlesLogger.info("updateArticle: Article {".concat(articleId, "} updated successfully by {").concat(requesterRole, "}."));
                // Send success response with the updated article
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: message,
                    data: { updatedArticle: updatedArticle },
                });
                return [3 /*break*/, 14];
            case 13:
                err_9 = _b.sent();
                next(err_9);
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.updateArticle = updateArticle;
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
var deleteArticle = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var articleId, requesterId, requesterRole, article, author, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                articleId = req.params.articleId;
                requesterId = res.locals.userInfo.user_id;
                requesterRole = res.locals.userInfo.role;
                return [4 /*yield*/, database_1.articlesModel.findArticleById(articleId, [
                        "article_id",
                        "image",
                        "creator_id",
                    ])];
            case 1:
                article = _a.sent();
                if (!article) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Article not found.",
                        })];
                }
                if (!(requesterRole === rolesList_1.ROLES_LIST.Author)) return [3 /*break*/, 3];
                // Handle case where author is not the creator
                if (requesterId !== article.creator_id) {
                    articlesLogger.warn("deleteArticle: Unauthorized delete attempt, Author {".concat(requesterId, "} tried to delete article {").concat(articleId, "}."));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have access to this resource.",
                        })];
                }
                return [4 /*yield*/, database_1.authorsModel.findAuthorById(requesterId, [
                        "user_id",
                    ])];
            case 2:
                author = _a.sent();
                // Handle case where author is not found
                if (!author) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Author not found.",
                        })];
                }
                // Check if the author has permission to delete articles
                if (!author.permissions.delete) {
                    articlesLogger.warn("deleteArticle: Permission denied, Author {".concat(requesterId, "} attempted to delete article {").concat(articleId, "} without sufficient permissions."));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have permission to delete articles.",
                        })];
                }
                _a.label = 3;
            case 3: 
            // Perform the deletion
            return [4 /*yield*/, database_1.articlesModel.deleteArticle(articleId)];
            case 4:
                // Perform the deletion
                _a.sent();
                if (!article.image) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, deleteFileFromCloudinary_1.deleteFileFromCloudinary)(article.image)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                articlesLogger.info("deleteArticle: Article {".concat(articleId, "} deleted successfully by {").concat(requesterRole, "}."));
                // Delete related cached item for this request
                (0, deleteRelatedCachedItemsForRequest_1.deleteRelatedCachedItemsForRequest)(req);
                // Send a success response with no content (204 No Content)
                res.sendStatus(204);
                return [3 /*break*/, 8];
            case 7:
                err_10 = _a.sent();
                next(err_10);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.deleteArticle = deleteArticle;
/**
 * Retrieves a paginated list of saved articles for a user.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of saved articles or an appropriate error message.
 *
 * @param req - Express request object containing optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getSavedArticles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, order, limit, page, skip, savedArticles, err_11;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId = res.locals.userInfo.user_id;
                order = req.query.order === "old" ? 1 : -1;
                limit = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) ? Number(req.query.limit) : 10;
                page = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.page) ? Number(req.query.page) : 1;
                // Ensure valid pagination values
                if (limit <= 0 || page <= 0) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid pagination parameters. Limit and page must be positive integers.",
                        })];
                }
                skip = (page - 1) * limit;
                return [4 /*yield*/, database_1.articlesModel.getSavedArticles(userId, order, limit, skip)];
            case 1:
                savedArticles = _c.sent();
                // Send response with saved articles
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Saved articles retrieved successfully.",
                    data: { articles: savedArticles },
                });
                return [3 /*break*/, 3];
            case 2:
                err_11 = _c.sent();
                next(err_11);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSavedArticles = getSavedArticles;
/**
 * Checks if a specific article is saved by the user.
 * Responds with a boolean indicating whether the article is saved or an error message.
 *
 * @param req - Express request object containing `userId` in res.locals and `articleId` in params.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var isArticleSaved = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, articleId, isArticleSaved_1, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = res.locals.userInfo.user_id;
                articleId = req.params.articleId;
                // Validate articleId
                if (!articleId) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Missing articleId parameter.",
                        })];
                }
                return [4 /*yield*/, database_1.articlesModel.isArticleSaved(userId, articleId)];
            case 1:
                isArticleSaved_1 = _a.sent();
                // Send response with the result
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Article save status retrieved successfully.",
                    data: { isArticleSaved: isArticleSaved_1 },
                });
                return [3 /*break*/, 3];
            case 2:
                err_12 = _a.sent();
                next(err_12);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.isArticleSaved = isArticleSaved;
/**
 * Saves an article for the user.
 * Responds with a success message or an appropriate error message.
 *
 * @param req - Express request object containing `userId` in res.locals and `articleId` in params.
 * @param res - Express response object used to send statusText and message.
 * @param next - Express next function to handle errors.
 */
var saveArticle = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, articleId, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = res.locals.userInfo.user_id;
                articleId = req.params.articleId;
                // Validate articleId
                if (!articleId) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Missing articleId in the request params.",
                        })];
                }
                // Save the article for the user
                return [4 /*yield*/, database_1.articlesModel.saveArticle(userId, articleId)];
            case 1:
                // Save the article for the user
                _a.sent();
                // Send success response
                res.status(201).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Article saved successfully.",
                });
                return [3 /*break*/, 3];
            case 2:
                err_13 = _a.sent();
                next(err_13);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.saveArticle = saveArticle;
/**
 * Removes a saved article for the user.
 * Responds with a success message or an appropriate error message.
 *
 * @param req - Express request object containing `userId` in res.locals and `articleId` in params.
 * @param res - Express response object used to send statusText and message.
 * @param next - Express next function to handle errors.
 */
var unsaveArticle = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, articleId, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = res.locals.userInfo.user_id;
                articleId = req.params.articleId;
                // Validate articleId
                if (!articleId) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Missing articleId parameter.",
                        })];
                }
                // Remove the saved article for the user
                return [4 /*yield*/, database_1.articlesModel.unsaveArticle(userId, articleId)];
            case 1:
                // Remove the saved article for the user
                _a.sent();
                // Send success response
                res.sendStatus(204);
                return [3 /*break*/, 3];
            case 2:
                err_14 = _a.sent();
                next(err_14);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.unsaveArticle = unsaveArticle;
