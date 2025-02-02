"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AuthorsModel = void 0;
var __1 = require("../..");
var rolesList_1 = require("../../../utils/rolesList");
var connectToPostgreSQL_1 = require("../setup/connectToPostgreSQL");
/**
 * Model for performing author-related database operations.
 */
var AuthorsModel = /** @class */ (function () {
    function AuthorsModel() {
        /* ===== Fields for users and users_oauth ===== */
        this.userFields = [
            "user_id",
            "name",
            "email",
            "password",
            "is_verified",
            "role",
            "created_at",
            "updated_at",
        ];
        this.userOAuthFields = ["provider", "provider_user_id"];
    }
    /* ===== Private Helpers ===== */
    /**
     * Filters selected fields to include only valid fields for the `users` table
     * and prefixes them with the given table alias.
     *
     * If no selectedFields provided return all fields from the `users` table with the provided alias.
     *
     * @param tableAlias - The table alias or name to prefix the fields with.
     * @param selectedFields - Optional array of fields to filter.
     * @returns A comma-separated string of valid selected fields prefixed with the table alias.
     */
    AuthorsModel.prototype.getUserSelectedFieldsWithAlias = function (tableAlias, selectedFields) {
        var _this = this;
        if (!selectedFields || selectedFields.length === 0) {
            // Return all fields from the `users` table with the provided alias
            return this.userFields
                .map(function (field) { return "".concat(tableAlias, ".").concat(field); })
                .join(", ");
        }
        var selectedFieldsAfterFilter = selectedFields.filter(function (field) {
            return _this.userFields.includes(field);
        });
        return selectedFieldsAfterFilter
            .map(function (field) { return "".concat(tableAlias, ".").concat(field); })
            .join(", ");
    };
    /**
     * Filters selected fields to include only valid fields for the `users_oauth` table
     * and prefixes them with the given table alias.
     *
     * If no selectedFields provided return all fields from the `users_oauth` table with the provided alias.
     *
     * @param tableAlias - The table alias or name to prefix the fields with.
     * @param selectedFields - Optional array of fields to filter.
     * @returns A comma-separated string of valid selected fields prefixed with the table alias.
     */
    AuthorsModel.prototype.getUserOAuthSelectedFieldsWithAlias = function (tableAlias, selectedFields) {
        var _this = this;
        if (!selectedFields || selectedFields.length === 0) {
            // Return all fields from the `users_oauth` table with the provided alias
            return this.userOAuthFields
                .map(function (field) { return "".concat(tableAlias, ".").concat(field); })
                .join(", ");
        }
        var selectedFieldsAfterFilter = selectedFields.filter(function (field) {
            return _this.userOAuthFields.includes(field);
        });
        return selectedFieldsAfterFilter
            .map(function (field) { return "".concat(tableAlias, ".").concat(field); })
            .join(", ");
    };
    /* ===== Create Operations ===== */
    /**
     * Creates an author's permissions.
     *
     * @param authorId - The unique identifier of the author.
     * @param authorPermissions - The permissions data to create.
     * @returns created authorPermissions.
     */
    AuthorsModel.prototype.createAuthorPermissions = function (authorId, authorPermissions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        INSERT INTO author_permissions (user_id, \"create\", \"update\", \"delete\") \n        VALUES ($1, $2, $3, $4) RETURNING *\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [
                                authorId,
                                Boolean(authorPermissions.create),
                                Boolean(authorPermissions.update),
                                Boolean(authorPermissions.delete),
                            ])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Error in createAuthorPermissions:", err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Read Operations ===== */
    /**
     * Finds an author by their ID, including user details, avatar, and permissions.
     *
     * If no selectedFields provided it will return all author fields form `users` table
     *
     * @param authorId - The unique identifier of the author.
     * @param selectedFields - Optional array of fields to return. Avatar and permissions will always be included in the result.
     * @returns The author object if found, otherwise null.
     */
    AuthorsModel.prototype.findAuthorById = function (authorId, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var authorUserData, avatar, permissionsQuery, permissionsRows, permissions, author, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, __1.usersModel.findUserById(authorId, selectedFields)];
                    case 1:
                        authorUserData = _a.sent();
                        if (!authorUserData)
                            return [2 /*return*/, null]; // If user data is not found, return null
                        return [4 /*yield*/, __1.usersModel.findUserAvatar(authorId)];
                    case 2:
                        avatar = _a.sent();
                        permissionsQuery = "\n        SELECT *\n        FROM author_permissions\n        WHERE user_id = $1\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(permissionsQuery, [
                                authorId,
                            ])];
                    case 3:
                        permissionsRows = (_a.sent()).rows;
                        permissions = permissionsRows[0] || {
                            create: false,
                            update: false,
                            delete: false,
                        };
                        author = __assign(__assign({}, authorUserData), { avatar: avatar || "", permissions: permissions });
                        return [2 /*return*/, author];
                    case 4:
                        err_2 = _a.sent();
                        console.error("Error in findAuthorById:", err_2);
                        throw err_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of authors with optional sorting, pagination, and selected fields.
     *
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of authors to retrieve.
     * @param skip - Optional number of authors to skip for pagination.
     * @param selectedFields - Optional array of fields to return. Avatar, permissions, and OAuth data will always be included in the result.
     * @returns Array of author objects.
     */
    AuthorsModel.prototype.getAuthors = function (order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, userOAuthFields, query, params, userRows, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        query = "\n        SELECT ".concat(userFields, ", ").concat(userOAuthFields, ", ua.avatar, ap.\"create\", ap.\"update\", ap.\"delete\"\n        FROM users u\n        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id\n        LEFT JOIN users_avatars ua ON u.user_id = ua.user_id\n        LEFT JOIN author_permissions ap ON u.user_id = ap.user_id\n        WHERE u.role = $1\n        ORDER BY u.created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
                        // Add LIMIT and OFFSET conditionally
                        if (limit)
                            query += " LIMIT $2";
                        if (skip)
                            query += " OFFSET $3";
                        params = [rolesList_1.ROLES_LIST.Author];
                        if (limit)
                            params.push(limit);
                        if (skip)
                            params.push(skip);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        userRows = (_a.sent()).rows;
                        // Return the list of authors
                        return [2 /*return*/, userRows.map(function (userRow) { return (__assign(__assign({}, userRow), { avatar: userRow.avatar, permissions: {
                                    create: userRow.create || false,
                                    update: userRow.update || false,
                                    delete: userRow.delete || false,
                                } })); })];
                    case 2:
                        err_3 = _a.sent();
                        console.error("Error in getAuthors:", err_3);
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the total count of authors by checking the users table where role is "Author".
     *
     * @returns Total count of authors as a number.
     */
    AuthorsModel.prototype.getAuthorsCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT COUNT(*) AS total_count\n        FROM users\n        WHERE role = $1\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [rolesList_1.ROLES_LIST.Author])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, Number(rows[0].total_count)];
                    case 2:
                        err_4 = _a.sent();
                        console.error("Error in getAuthorsCount:", err_4);
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Searches for authors by a keyword in their name or email, including avatars, permissions, and OAuth data.
     *
     * If no selectedFields provided it will return all author fields form `users` table
     *
     * @param searchKey - The keyword to search for.
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of authors to retrieve.
     * @param skip - Optional number of authors to skip for pagination.
     * @param selectedFields - Optional array of fields to return. Avatar, permissions, and OAuth data will always be included in the result.
     * @returns Array of author objects matching the search criteria.
     */
    AuthorsModel.prototype.searchAuthors = function (searchKey, order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, userOAuthFields, query, params, userRows, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        query = "\n        SELECT ".concat(userFields, ", ").concat(userOAuthFields, ", ua.avatar, ap.\"create\", ap.\"update\", ap.\"delete\"\n        FROM users u\n        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id\n        LEFT JOIN users_avatars ua ON u.user_id = ua.user_id\n        LEFT JOIN author_permissions ap ON u.user_id = ap.user_id\n        WHERE u.role = $1 AND (u.name ILIKE $2 OR u.email ILIKE $2)\n        ORDER BY u.created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
                        // Add LIMIT and OFFSET conditionally
                        if (limit)
                            query += " LIMIT $3";
                        if (skip)
                            query += " OFFSET $4";
                        params = [rolesList_1.ROLES_LIST.Author, "%".concat(searchKey, "%")];
                        if (limit)
                            params.push(limit);
                        if (skip)
                            params.push(skip);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, params)];
                    case 1:
                        userRows = (_a.sent()).rows;
                        // Return the list of authors
                        return [2 /*return*/, userRows.map(function (userRow) { return (__assign(__assign({}, userRow), { avatar: userRow.avatar, permissions: {
                                    create: userRow.create || false,
                                    update: userRow.update || false,
                                    delete: userRow.delete || false,
                                } })); })];
                    case 2:
                        err_5 = _a.sent();
                        console.error("Error in searchAuthors:", err_5);
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Update Operations ===== */
    /**
     * Updates an author's permissions by ID.
     *
     * @param authorId - The unique identifier of the author.
     * @param authorPermissions - The permissions data to update.
     * @returns updated authorPermissions.
     */
    AuthorsModel.prototype.updateAuthorPermissions = function (authorId, authorPermissions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        UPDATE author_permissions \n        SET \n          \"create\" = $1, \n          \"update\" = $2, \n          \"delete\" = $3 \n        WHERE user_id = $4\n        RETURNING *\n    ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [
                                Boolean(authorPermissions.create),
                                Boolean(authorPermissions.update),
                                Boolean(authorPermissions.delete),
                                authorId,
                            ])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_6 = _a.sent();
                        console.error("Error in updateAuthorPermissions:", err_6);
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Delete Operations ===== */
    /**
     * Deletes an author's permissions by ID.
     *
     * @param authorId - The unique identifier of the author.
     * @returns void
     */
    AuthorsModel.prototype.deleteAuthorPermissions = function (authorId) {
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query("DELETE FROM author_permissions WHERE user_id = $1", [
                                authorId,
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_7 = _a.sent();
                        console.error("Error in deleteAuthorPermissions:", err_7);
                        throw err_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthorsModel;
}());
exports.AuthorsModel = AuthorsModel;
