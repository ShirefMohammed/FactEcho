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
exports.getCategoryArticles = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getTotalCategoriesCount = exports.searchCategories = exports.getCategories = void 0;
var logger_1 = require("../../config/logger");
var database_1 = require("../../database");
var cacheResponse_1 = require("../../utils/cacheResponse");
var httpStatusText_1 = require("../../utils/httpStatusText");
// Logger for categories service
var categoriesLogger = (0, logger_1.getServiceLogger)("categories");
/**
 * Retrieves a paginated list of categories.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of categories or an appropriate error message.
 *
 * @param req - Express request object containing optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getCategories = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, limit, page, skip, categories, err_1;
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
                return [4 /*yield*/, database_1.categoriesModel.getCategories(order, limit, skip)];
            case 1:
                categories = _c.sent();
                // Send response with categories
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Categories retrieved successfully.",
                    data: { categories: categories },
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
exports.getCategories = getCategories;
/**
 * Searches for categories based on a search key.
 * Accepts optional query parameters for search, sorting, and pagination.
 * Responds with the list of matching categories or an appropriate error message.
 *
 * @param req - Express request object containing `searchKey` and optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var searchCategories = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchKey, order, limit, page, skip, categories, err_2;
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
                return [4 /*yield*/, database_1.categoriesModel.searchCategories(searchKey, order, limit, skip)];
            case 1:
                categories = _c.sent();
                // Send response with categories and pagination metadata
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Categories searched successfully.",
                    data: { categories: categories },
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
exports.searchCategories = searchCategories;
/**
 * Retrieves the total count of categories in the system.
 * Responds with the total user count or an appropriate error message.
 *
 * @param req - Express request object (unused in this case).
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getTotalCategoriesCount = function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var totalCategoriesCount, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.categoriesModel.getCategoriesCount()];
            case 1:
                totalCategoriesCount = _a.sent();
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Total categories count retrieved successfully.",
                    data: { totalCategoriesCount: totalCategoriesCount },
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
exports.getTotalCategoriesCount = getTotalCategoriesCount;
/**
 * Retrieves details of a specific category by ID.
 * Responds with the category details or an appropriate error message.
 *
 * @param req - Express request object containing the `categoryId` parameter.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var category, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.categoriesModel.findCategoryById(req.params.categoryId)];
            case 1:
                category = _a.sent();
                // Handle category not found
                if (!category) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Category not found.",
                        })];
                }
                // Send response with the category details
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Category retrieved successfully.",
                    data: { category: category },
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
exports.getCategory = getCategory;
/**
 * Creates a new category with the provided title and creator ID.
 * Validates the request body and ensures no duplicate titles exist.
 * Responds with the newly created category or an appropriate error message.
 *
 * @param req - Express request object containing the `title` in the body.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var createCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var title, existingCategory, creatorId, newCategory, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                title = req.body.title;
                if (!title) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Category title is required.",
                        })];
                }
                return [4 /*yield*/, database_1.categoriesModel.findCategoryByTitle(title, [
                        "category_id",
                    ])];
            case 1:
                existingCategory = _a.sent();
                if (existingCategory) {
                    return [2 /*return*/, res.status(409).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "A category with the same title already exists.",
                        })];
                }
                creatorId = res.locals.userInfo.user_id;
                return [4 /*yield*/, database_1.categoriesModel.createCategory({
                        title: title,
                        creator_id: creatorId,
                    })];
            case 2:
                newCategory = _a.sent();
                categoriesLogger.info("createCategory: New Category with title {".concat(title, "} created successfully"));
                // Send success response with the new category
                res.status(201).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Category created successfully.",
                    data: { newCategory: newCategory },
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createCategory = createCategory;
/**
 * Updates an existing category with the provided fields.
 * Validates if the category exists and ensures no duplicate titles are used.
 * Responds with the updated category or an appropriate error message.
 *
 * @param req - Express request object containing the `categoryId` in params and optional `title` in the body.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var updateCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, existingCategory, message, updatedFields, title, duplicateCategory, updatedCategory, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                categoryId = req.params.categoryId;
                return [4 /*yield*/, database_1.categoriesModel.findCategoryById(categoryId)];
            case 1:
                existingCategory = _a.sent();
                if (!existingCategory) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Category not found.",
                        })];
                }
                message = "Category updated successfully.";
                updatedFields = {};
                title = req.body.title;
                if (!title) return [3 /*break*/, 3];
                return [4 /*yield*/, database_1.categoriesModel.findCategoryByTitle(title, ["category_id"])];
            case 2:
                duplicateCategory = _a.sent();
                if (duplicateCategory && duplicateCategory.category_id !== categoryId) {
                    message +=
                        " Title was not updated as another category with the same title exists.";
                }
                else {
                    updatedFields.title = title;
                }
                _a.label = 3;
            case 3:
                updatedCategory = {};
                if (!(Object.keys(updatedFields).length > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, database_1.categoriesModel.updateCategory(categoryId, updatedFields)];
            case 4:
                updatedCategory = _a.sent();
                _a.label = 5;
            case 5:
                categoriesLogger.info("updateCategory: Category with id {".concat(categoryId, "} updated successfully"));
                // Send success response with updated category
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: message,
                    data: { updatedCategory: updatedCategory },
                });
                return [3 /*break*/, 7];
            case 6:
                err_6 = _a.sent();
                next(err_6);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateCategory = updateCategory;
/**
 * Deletes an existing category by ID.
 * Validates if the category exists before deletion.
 * Responds with appropriate success or error messages.
 *
 * @param req - Express request object containing the `categoryId` in params.
 * @param res - Express response object used to send the statusText and message.
 * @param next - Express next function to handle errors.
 */
var deleteCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, existingCategory, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                categoryId = req.params.categoryId;
                return [4 /*yield*/, database_1.categoriesModel.findCategoryById(categoryId, ["category_id"])];
            case 1:
                existingCategory = _a.sent();
                if (!existingCategory) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Category not found.",
                        })];
                }
                // Perform the deletion
                return [4 /*yield*/, database_1.categoriesModel.deleteCategory(categoryId)];
            case 2:
                // Perform the deletion
                _a.sent();
                categoriesLogger.info("deleteCategory: Category with id {".concat(categoryId, "} deleted successfully"));
                // Send a success response with no content
                res.sendStatus(204);
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                next(err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
/**
 * Retrieves a paginated list of articles for a specific category.
 * Accepts optional query parameters for sorting, pagination (limit and page).
 * Responds with the list of articles or an appropriate error message.
 *
 * @param req - Express request object containing `categoryId` in params and optional `order`, `limit`, and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getCategoryArticles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, limit, page, skip, articles, err_8;
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
                return [4 /*yield*/, database_1.articlesModel.getCategoryArticles(req.params.categoryId, order, limit, skip)];
            case 1:
                articles = _c.sent();
                // Cache response data
                (0, cacheResponse_1.cacheResponse)(req, { articles: articles });
                // Send response with articles
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Articles retrieved successfully.",
                    data: { articles: articles },
                });
                return [3 /*break*/, 3];
            case 2:
                err_8 = _c.sent();
                next(err_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryArticles = getCategoryArticles;
