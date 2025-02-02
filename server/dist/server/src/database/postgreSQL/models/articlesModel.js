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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesModel = void 0;
var connectToPostgreSQL_1 = require("../setup/connectToPostgreSQL");
/**
 * Model for performing articles-related database operations.
 */
var ArticlesModel = /** @class */ (function () {
    function ArticlesModel() {
    }
    /* ===== Private Helpers ===== */
    /**
     * Helper function for dynamic selection of fields.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param selectedFields - Optional ArticleFields[] of selected fields to be fetched.
     * @returns The selected fields or default to '*' if not provided.
     */
    ArticlesModel.prototype.getSelectedFields = function (selectedFields) {
        return selectedFields && selectedFields.length > 0
            ? selectedFields.join(", ")
            : "*";
    };
    /* ===== Create Operations ===== */
    /**
     * Creates a new article.
     *
     * @param article - The article object to be created.
     * @returns created article.
     */
    ArticlesModel.prototype.createArticle = function (article) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        INSERT INTO articles (title, content, image, category_id, creator_id)\n        VALUES ($1, $2, $3, $4, $5)\n        RETURNING *\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [
                                article.title,
                                article.content,
                                article.image,
                                article.category_id,
                                article.creator_id,
                            ])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Error in createArticle:", err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Saves an article for the user.
     *
     * @param userId - The ID of the user who is saving the article.
     * @param articleId - The ID of the article to save.
     * @returns void.
     */
    ArticlesModel.prototype.saveArticle = function (userId, articleId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        INSERT INTO users_saved_articles (user_id, article_id)\n        VALUES ($1, $2)\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [userId, articleId])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.error("Error in saveArticle:", err_2);
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Read Operations ===== */
    /**
     * Finds an article by its ID.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param articleId - The unique identifier of the article.
     * @param selectedFields - Optional string specifying fields to return.
     * @returns The article object if found, otherwise null.
     */
    ArticlesModel.prototype.findArticleById = function (articleId, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT ".concat(this.getSelectedFields(selectedFields), " FROM articles WHERE article_id = $1");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [articleId])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_3 = _a.sent();
                        console.error("Error in findArticleById:", err_3);
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds an article by its title.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param title - The title of the article.
     * @param selectedFields - Optional string specifying fields to return.
     * @returns The article object if found, otherwise null.
     */
    ArticlesModel.prototype.findArticleByTitle = function (title, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT ".concat(this.getSelectedFields(selectedFields), " FROM articles WHERE title = $1");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [title])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_4 = _a.sent();
                        console.error("Error in findArticleByTitle:", err_4);
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of articles with optional sorting, pagination, and selected fields.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of articles to retrieve.
     * @param skip - Optional number of articles to skip for pagination.
     * @param selectedFields - Optional string of fields to return.
     * @returns Array of article objects.
     */
    ArticlesModel.prototype.getArticles = function (order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT ".concat(this.getSelectedFields(selectedFields), "\n        FROM articles\n        ORDER BY created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
                        // Add LIMIT and OFFSET conditionally
                        if (limit)
                            query += " LIMIT $1";
                        if (skip)
                            query += " OFFSET $2";
                        params = [];
                        if (limit)
                            params.push(limit);
                        if (skip)
                            params.push(skip);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                    case 2:
                        err_5 = _a.sent();
                        console.error("Error in getArticles:", err_5);
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the total count of articles from the records_count table.
     *
     * Ensures fast retrieval without performing a direct count on the articles table.
     *
     * @returns Total number of articles as a number.
     */
    ArticlesModel.prototype.getArticlesCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT record_count AS total_articles FROM records_count WHERE table_name = 'articles'";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        // Return the count value, ensuring it's parsed as a number
                        return [2 /*return*/, rows.length ? Number(rows[0].total_articles) : 0];
                    case 2:
                        err_6 = _a.sent();
                        console.error("Error in getArticlesCount:", err_6);
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Searches for articles by title with optional sorting, pagination, and selected fields.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param searchKey - The search term to look for in the article title.
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of articles to retrieve.
     * @param skip - Optional number of articles to skip for pagination.
     * @param selectedFields - Optional string of fields to return.
     * @returns Array of article objects matching the search criteria.
     */
    ArticlesModel.prototype.searchArticles = function (searchKey, order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT ".concat(this.getSelectedFields(selectedFields), "\n        FROM articles\n        WHERE title ILIKE $1\n        ORDER BY created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
                        // Add LIMIT and OFFSET conditionally
                        if (limit)
                            query += " LIMIT $2";
                        if (skip)
                            query += " OFFSET $3";
                        params = ["%".concat(searchKey, "%")];
                        if (limit)
                            params.push(limit);
                        if (skip)
                            params.push(skip);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                    case 2:
                        err_7 = _a.sent();
                        console.error("Error in searchArticles:", err_7);
                        throw err_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of random articles.
     *
     * @param limit - Optional maximum number of random articles to retrieve.
     * @returns Array of random article objects.
     */
    ArticlesModel.prototype.getRandomArticles = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT * \n        FROM articles\n        ORDER BY RANDOM()\n      ";
                        // Add LIMIT conditionally
                        if (limit)
                            query += " LIMIT $1";
                        params = [];
                        if (limit)
                            params.push(limit);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                    case 2:
                        err_8 = _a.sent();
                        console.error("Error in getRandomArticles:", err_8);
                        throw err_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of trending articles based on views.
     *
     * @param limit - Optional maximum number of trending articles to retrieve.
     * @returns Array of trending article objects.
     */
    ArticlesModel.prototype.getTrendingArticles = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT * \n        FROM articles\n        ORDER BY views DESC\n      ";
                        // Add LIMIT conditionally
                        if (limit)
                            query += " LIMIT $1";
                        params = [];
                        if (limit)
                            params.push(limit);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                    case 2:
                        err_9 = _a.sent();
                        console.error("Error in getTrendingArticles:", err_9);
                        throw err_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of the latest articles based on their creation date.
     *
     * @param limit - Optional maximum number of latest articles to retrieve.
     * @returns Array of latest article objects.
     */
    ArticlesModel.prototype.getLatestArticles = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT * \n        FROM articles\n        ORDER BY created_at DESC\n      ";
                        // Add LIMIT conditionally
                        if (limit)
                            query += " LIMIT $1";
                        params = [];
                        if (limit)
                            params.push(limit);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                    case 2:
                        err_10 = _a.sent();
                        console.error("Error in getLatestArticles:", err_10);
                        throw err_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of articles for a specific category with optional sorting, pagination.
     *
     * @param categoryId - The unique identifier of the category.
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of articles to retrieve.
     * @param skip - Optional number of articles to skip for pagination.
     * @returns Array of article objects in the specified category.
     */
    ArticlesModel.prototype.getCategoryArticles = function (categoryId, order, limit, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT * FROM articles\n        WHERE category_id = $1\n        ORDER BY created_at ".concat(order === -1 ? "DESC" : "ASC", "\n      ");
                        // Add LIMIT and OFFSET conditionally
                        if (limit)
                            query += " LIMIT $2";
                        if (skip)
                            query += " OFFSET $3";
                        params = [categoryId];
                        if (limit)
                            params.push(limit);
                        if (skip)
                            params.push(skip);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                    case 2:
                        err_11 = _a.sent();
                        console.error("Error in getCategoryArticles:", err_11);
                        throw err_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of created articles for a user with optional sorting, pagination, and selected fields.
     *
     * @param userId - The ID of the user whose created articles are being retrieved.
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of articles to retrieve.
     * @param skip - Optional number of articles to skip for pagination.
     * @param selectedFields - Optional array of fields to return; defaults to all fields.
     * @returns Array of created article objects.
     */
    ArticlesModel.prototype.getCreatedArticles = function (userId, order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT ".concat(this.getSelectedFields(selectedFields), " \n        FROM articles \n        WHERE creator_id = $1\n        ORDER BY created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
                        // Add LIMIT and OFFSET conditionally
                        if (limit)
                            query += " LIMIT $2";
                        if (skip)
                            query += " OFFSET $".concat(limit ? "3" : "2");
                        params = [userId];
                        if (limit)
                            params.push(limit);
                        if (skip)
                            params.push(skip);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                    case 2:
                        err_12 = _a.sent();
                        console.error("Error in getCreatedArticles:", err_12);
                        throw err_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of saved articles for a user with optional sorting, pagination, and selected fields.
     *
     * @param userId - The ID of the user whose saved articles are being retrieved.
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of articles to retrieve.
     * @param skip - Optional number of articles to skip for pagination.
     * @param selectedFields - Optional array of fields to return.
     * @returns Array of saved article objects.
     */
    ArticlesModel.prototype.getSavedArticles = function (userId, order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT ".concat(this.getSelectedFields(selectedFields), "\n        FROM articles\n        WHERE article_id IN (\n          SELECT article_id\n          FROM users_saved_articles\n          WHERE user_id = $1\n        )\n        ORDER BY created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
                        // Add LIMIT and OFFSET conditionally
                        if (limit)
                            query += " LIMIT $2";
                        if (skip)
                            query += " OFFSET $3";
                        params = [userId];
                        if (limit)
                            params.push(limit);
                        if (skip)
                            params.push(skip);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                    case 2:
                        err_13 = _a.sent();
                        console.error("Error in getSavedArticles:", err_13);
                        throw err_13;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if the specified article is saved by the user.
     *
     * @param userId - The ID of the user.
     * @param articleId - The ID of the article to check.
     * @returns Boolean indicating whether the article is saved by the user.
     */
    ArticlesModel.prototype.isArticleSaved = function (userId, articleId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rowCount, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT 1\n        FROM users_saved_articles\n        WHERE user_id = $1 AND article_id = $2\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [userId, articleId])];
                    case 1:
                        rowCount = (_a.sent()).rowCount;
                        return [2 /*return*/, rowCount ? rowCount > 0 : false];
                    case 2:
                        err_14 = _a.sent();
                        console.error("Error in isArticleSaved:", err_14);
                        throw err_14;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Update Operations ===== */
    /**
     * Updates an article by its ID.
     *
     * @param articleId - The unique identifier of the article.
     * @param article - Partial article data to update.
     * @returns updated article.
     */
    ArticlesModel.prototype.updateArticle = function (articleId, article) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedArticle, fields, query, rows, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updatedArticle = {};
                        fields = Object.keys(article)
                            .filter(function (key) { return article[key] !== undefined; })
                            .map(function (key, index) { return "".concat(key, " = $").concat(index + 2); })
                            .join(", ");
                        if (!fields)
                            return [2 /*return*/, updatedArticle];
                        query = "UPDATE articles SET ".concat(fields, " WHERE article_id = $1 RETURNING *");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, __spreadArray([
                                articleId
                            ], Object.values(article), true))];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_15 = _a.sent();
                        console.error("Error in updateArticle:", err_15);
                        throw err_15;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Delete Operations ===== */
    /**
     * Removes a saved article for the user.
     *
     * @param userId - The ID of the user who is removing the saved article.
     * @param articleId - The ID of the article to remove from saved articles.
     * @returns void.
     */
    ArticlesModel.prototype.unsaveArticle = function (userId, articleId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        DELETE FROM users_saved_articles\n        WHERE user_id = $1 AND article_id = $2\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [userId, articleId])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_16 = _a.sent();
                        console.error("Error in unsaveArticle:", err_16);
                        throw err_16;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes an article by its ID.
     *
     * @param articleId - The ID of the article to delete.
     * @returns void
     */
    ArticlesModel.prototype.deleteArticle = function (articleId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "DELETE FROM articles WHERE article_id = $1";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [articleId])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_17 = _a.sent();
                        console.error("Error in deleteArticle:", err_17);
                        throw err_17;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ArticlesModel;
}());
exports.ArticlesModel = ArticlesModel;
