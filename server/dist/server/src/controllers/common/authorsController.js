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
exports.getAuthorArticles = exports.updateAuthorPermissions = exports.getAuthor = exports.getTotalAuthorsCount = exports.searchAuthors = exports.getAuthors = void 0;
var logger_1 = require("../../config/logger");
var database_1 = require("../../database");
var cacheResponse_1 = require("../../utils/cacheResponse");
var deleteRelatedCachedItemsForRequest_1 = require("../../utils/deleteRelatedCachedItemsForRequest");
var httpStatusText_1 = require("../../utils/httpStatusText");
// Logger for authors service
var authorsLogger = (0, logger_1.getServiceLogger)("authors");
/**
 * Retrieves a paginated list of authors.
 * Accessible only by Admin users.
 * Responds with the list of authors or an appropriate error message.
 *
 * @param req - Express request object.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getAuthors = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, page, skip, authors, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
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
                return [4 /*yield*/, database_1.authorsModel.getAuthors(-1, limit, skip)];
            case 1:
                authors = _c.sent();
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { authors: authors });
                // Send response with authors
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Authors retrieved successfully.",
                    data: { authors: authors },
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
exports.getAuthors = getAuthors;
/**
 * Searches for authors based on a search key.
 * Accessible only by Admin users.
 * Responds with the list of matching authors or an appropriate error message.
 *
 * @param req - Express request object containing `searchKey` in the query.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var searchAuthors = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchKey, limit, page, skip, authors, err_2;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                searchKey = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.searchKey) || "";
                if (!searchKey.trim()) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Search key is required.",
                        })];
                }
                limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
                page = ((_c = req.query) === null || _c === void 0 ? void 0 : _c.page) ? Number(req.query.page) : 1;
                if (limit <= 0 || page <= 0) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid pagination parameters. Limit and page must be positive integers.",
                        })];
                }
                skip = (page - 1) * limit;
                return [4 /*yield*/, database_1.authorsModel.searchAuthors(searchKey, -1, limit, skip)];
            case 1:
                authors = _d.sent();
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { authors: authors });
                // Send response with authors
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Authors retrieved successfully.",
                    data: { authors: authors },
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _d.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchAuthors = searchAuthors;
/**
 * Retrieves the total count of authors in the system.
 * Responds with the total authors count or an appropriate error message.
 *
 * @param req - Express request object (unused in this case).
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getTotalAuthorsCount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var totalAuthorsCount, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.authorsModel.getAuthorsCount()];
            case 1:
                totalAuthorsCount = _a.sent();
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { totalAuthorsCount: totalAuthorsCount });
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Total authors count retrieved successfully.",
                    data: { totalAuthorsCount: totalAuthorsCount },
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
exports.getTotalAuthorsCount = getTotalAuthorsCount;
/**
 * Retrieves an author by their ID.
 * Responds with the author details or an appropriate error message.
 *
 * @param req - Express request object containing `authorId` in the route parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getAuthor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var author, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.authorsModel.findAuthorById(req.params.authorId, [
                        "user_id",
                        "name",
                    ])];
            case 1:
                author = _a.sent();
                // If the author is not found, return a 404 error
                if (!author) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Author not found.",
                        })];
                }
                // Delete the permissions field from the author object
                delete author.permissions;
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { author: author });
                // Return the author details with a success message
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Author retrieved successfully.",
                    data: { author: author },
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAuthor = getAuthor;
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
var updateAuthorPermissions = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var permissions, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                permissions = req.body.permissions;
                // Validate that permissions are provided
                if (!permissions) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Permissions are required.",
                        })];
                }
                // Update the author's permissions in the database
                return [4 /*yield*/, database_1.authorsModel.updateAuthorPermissions(req.params.authorId, permissions)];
            case 1:
                // Update the author's permissions in the database
                _a.sent();
                authorsLogger.info("Author permissions updated for author {".concat(req.params.authorId, "}"));
                // Delete related cached item for this request
                (0, deleteRelatedCachedItemsForRequest_1.deleteRelatedCachedItemsForRequest)(req);
                // Send success response
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Author permissions updated successfully.",
                });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateAuthorPermissions = updateAuthorPermissions;
/**
 * Retrieves a paginated list of articles for a specific author.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of articles or an appropriate error message.
 *
 * @param req - Express request object containing `authorId` in params and optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getAuthorArticles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, limit, page, skip, articles, err_6;
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
                return [4 /*yield*/, database_1.articlesModel.getCreatedArticles(req.params.authorId, order, limit, skip)];
            case 1:
                articles = _c.sent();
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { articles: articles });
                // Send response with articles
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Author's articles retrieved successfully.",
                    data: { articles: articles },
                });
                return [3 /*break*/, 3];
            case 2:
                err_6 = _c.sent();
                next(err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAuthorArticles = getAuthorArticles;
