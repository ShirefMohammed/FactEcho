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
exports.CategoriesModel = void 0;
var connectToPostgreSQL_1 = require("../setup/connectToPostgreSQL");
/**
 * Model for performing categories-related database operations.
 */
var CategoriesModel = /** @class */ (function () {
    function CategoriesModel() {
    }
    /* ===== Private Helpers ===== */
    /**
     * Helper function for dynamic selection of fields.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param selectedFields - Optional CategoryFields[] of selected fields to be fetched.
     * @returns The selected fields or default to '*' if not provided.
     */
    CategoriesModel.prototype.getSelectedFields = function (selectedFields) {
        return selectedFields && selectedFields.length > 0
            ? selectedFields.join(", ")
            : "*";
    };
    /* ===== Create Operations ===== */
    /**
     * Creates a new category.
     *
     * @param category - The category object to be created.
     * @returns created category.
     */
    CategoriesModel.prototype.createCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "INSERT INTO categories (title, creator_id) VALUES ($1, $2) RETURNING *";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [
                                category.title,
                                category.creator_id || null,
                            ])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Error in createCategory:", err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Read Operations ===== */
    /**
     * Finds a category by its ID.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param categoryId - The ID of the category to find.
     * @param selectedFields - Optional array of fields to return;
     * @returns The category matching the ID, or null if not found.
     */
    CategoriesModel.prototype.findCategoryById = function (categoryId, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT ".concat(this.getSelectedFields(selectedFields), " FROM categories WHERE category_id = $1");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [categoryId])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_2 = _a.sent();
                        console.error("Error in findCategoryById:", err_2);
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds a category by its title.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param title - The title of the category to find.
     * @param selectedFields - Optional array of fields to return;
     * @returns The category matching the title, or null if not found.
     */
    CategoriesModel.prototype.findCategoryByTitle = function (title, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT ".concat(this.getSelectedFields(selectedFields), " FROM categories WHERE title = $1");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [title])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_3 = _a.sent();
                        console.error("Error in findCategoryByTitle:", err_3);
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of categories with optional sorting, pagination, and selected fields.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of categories to retrieve.
     * @param skip - Optional number of categories to skip for pagination.
     * @param selectedFields - Optional array of fields to return; defaults to all fields.
     * @returns Array of category objects.
     */
    CategoriesModel.prototype.getCategories = function (order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT ".concat(this.getSelectedFields(selectedFields), " FROM categories\n        ORDER BY created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
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
                        err_4 = _a.sent();
                        console.error("Error in getCategories:", err_4);
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the total count of categories from the records_count table.
     *
     * Ensures fast retrieval without performing a direct count on the categories table.
     *
     * @returns Total number of categories as a number.
     */
    CategoriesModel.prototype.getCategoriesCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT record_count AS total_categories FROM records_count WHERE table_name = 'categories'";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        // Return the count value, ensuring it's parsed as a number
                        return [2 /*return*/, rows.length ? Number(rows[0].total_categories) : 0];
                    case 2:
                        err_5 = _a.sent();
                        console.error("Error in getCategoriesCount:", err_5);
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Searches for categories by title with optional sorting, pagination, and selected fields.
     *
     * If no selectedFields provided it returns all fields.
     *
     * @param searchKey - The search term to look for in the category title.
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of categories to retrieve.
     * @param skip - Optional number of categories to skip for pagination.
     * @param selectedFields - Optional array of fields to return; defaults to all fields.
     * @returns Array of category objects matching the search criteria.
     */
    CategoriesModel.prototype.searchCategories = function (searchKey, order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, rows, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT ".concat(this.getSelectedFields(selectedFields), " FROM categories\n        WHERE title ILIKE $1\n        ORDER BY created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
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
                        err_6 = _a.sent();
                        console.error("Error in searchCategories:", err_6);
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Update Operations ===== */
    /**
     * Updates a category by its ID.
     *
     * @param categoryId - The unique identifier of the category.
     * @param category - Partial category data to update.
     * @returns updated category.
     */
    CategoriesModel.prototype.updateCategory = function (categoryId, category) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedCategory, fields, query, rows, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updatedCategory = {};
                        fields = Object.keys(category)
                            .filter(function (key) { return category[key] !== undefined; })
                            .map(function (key, index) { return "".concat(key, " = $").concat(index + 2); })
                            .join(", ");
                        if (!fields)
                            return [2 /*return*/, updatedCategory];
                        query = "UPDATE categories SET ".concat(fields, " WHERE category_id = $1 RETURNING *");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, __spreadArray([
                                categoryId
                            ], Object.values(category), true))];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_7 = _a.sent();
                        console.error("Error in updateCategory:", err_7);
                        throw err_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Delete Operations ===== */
    /**
     * Deletes a category by its ID.
     *
     * @param categoryId - The ID of the category to delete.
     * @returns void
     */
    CategoriesModel.prototype.deleteCategory = function (categoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query("DELETE FROM categories WHERE category_id = $1", [
                                categoryId,
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_8 = _a.sent();
                        console.error("Error in deleteCategory:", err_8);
                        throw err_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CategoriesModel;
}());
exports.CategoriesModel = CategoriesModel;
