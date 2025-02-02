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
exports.UsersModel = void 0;
var rolesList_1 = require("../../../utils/rolesList");
var connectToPostgreSQL_1 = require("../setup/connectToPostgreSQL");
/**
 * Model for performing user-related database operations.
 */
var UsersModel = /** @class */ (function () {
    function UsersModel() {
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
    UsersModel.prototype.getUserSelectedFieldsWithAlias = function (tableAlias, selectedFields) {
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
    UsersModel.prototype.getUserOAuthSelectedFieldsWithAlias = function (tableAlias, selectedFields) {
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
     * Creates a new user and inserts data into the `users` table.
     * Optionally inserts OAuth-related data into the `users_oauth` table if provided.
     *
     * This function runs within a transaction to ensure data consistency.
     *
     * @param user - The user data to create a new record.
     * @returns The created user object with fields from both `users` and `users_oauth` (if applicable).
     */
    UsersModel.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var client, createdUser, insertUserQuery, userRows, insertUserOAuthQuery, oauthRows, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connectToPostgreSQL_1.pool.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, 10, 11]);
                        createdUser = {};
                        return [4 /*yield*/, client.query("BEGIN")];
                    case 3:
                        _a.sent();
                        insertUserQuery = "\n      INSERT INTO users (name, email, password, role, is_verified)\n      VALUES ($1, $2, $3, $4, $5)\n      RETURNING *\n    ";
                        return [4 /*yield*/, client.query(insertUserQuery, [
                                user.name,
                                user.email,
                                user.password,
                                user.role || rolesList_1.ROLES_LIST.User,
                                Boolean(user.is_verified),
                            ])];
                    case 4:
                        userRows = (_a.sent()).rows;
                        createdUser = __assign(__assign({}, createdUser), userRows[0]);
                        if (!(user.provider && user.provider_user_id)) return [3 /*break*/, 6];
                        insertUserOAuthQuery = "\n        INSERT INTO users_oauth (user_id, provider, provider_user_id)\n        VALUES ($1, $2, $3)\n        RETURNING *\n      ";
                        return [4 /*yield*/, client.query(insertUserOAuthQuery, [
                                createdUser.user_id,
                                user.provider,
                                user.provider_user_id,
                            ])];
                    case 5:
                        oauthRows = (_a.sent()).rows;
                        createdUser = __assign(__assign({}, createdUser), oauthRows[0]); // Merge OAuth fields
                        _a.label = 6;
                    case 6: 
                    // Commit the transaction
                    return [4 /*yield*/, client.query("COMMIT")];
                    case 7:
                        // Commit the transaction
                        _a.sent();
                        return [2 /*return*/, createdUser];
                    case 8:
                        err_1 = _a.sent();
                        return [4 /*yield*/, client.query("ROLLBACK")];
                    case 9:
                        _a.sent();
                        console.error("Error in createUser:", err_1);
                        throw err_1;
                    case 10:
                        client.release();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Read Operations ===== */
    /**
     * Finds a user by their ID, including data from the `users` and `users_oauth` tables.
     *
     * If no selectedFields provided it will returns all fields.
     *
     * @param userId - The unique identifier of the user.
     * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
     * @returns The user object if found, otherwise null.
     */
    UsersModel.prototype.findUserById = function (userId, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, userOAuthFields, selectFields, query, rows, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        selectFields = [userFields, userOAuthFields]
                            .filter(Boolean)
                            .join(", ");
                        query = "\n        SELECT ".concat(selectFields, " \n        FROM users u\n        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id\n        WHERE u.user_id = $1\n      ");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [userId])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_2 = _a.sent();
                        console.error("Error in findUserById:", err_2);
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds a user by their email, including data from the `users` and `users_oauth` tables.
     *
     * If no selectedFields provided it will returns all fields.
     *
     * @param email - The user's email address.
     * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
     * @returns The user object if found, otherwise null.
     */
    UsersModel.prototype.findUserByEmail = function (email, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, userOAuthFields, selectFields, query, rows, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        selectFields = [userFields, userOAuthFields]
                            .filter(Boolean)
                            .join(", ");
                        query = "\n        SELECT ".concat(selectFields, " \n        FROM users u\n        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id\n        WHERE u.email = $1\n      ");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [email])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_3 = _a.sent();
                        console.error("Error in findUserByEmail:", err_3);
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds a user by OAuth, including data from the `users` and `users_oauth` tables.
     *
     * If no selectedFields provided it will returns all fields.
     *
     * @param provider - The users_oauth provider.
     * @param providerUserId - The users_oauth providerUserId.
     * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
     * @returns The user object if found, otherwise null.
     */
    UsersModel.prototype.findUserByOAuth = function (provider, providerUserId, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, userOAuthFields, selectFields, query, rows, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        selectFields = [userFields, userOAuthFields]
                            .filter(Boolean)
                            .join(", ");
                        query = "\n        SELECT ".concat(selectFields, "\n        FROM users u\n        INNER JOIN users_oauth uo ON u.user_id = uo.user_id\n        WHERE uo.provider = $1 AND uo.provider_user_id = $2\n      ");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [provider, providerUserId])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_4 = _a.sent();
                        console.error("Error in findUserByOAuth:", err_4);
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds a user by their verification token, including data from the `users` and `users_oauth` tables.
     *
     * If no selectedFields provided it will returns all fields.
     *
     * @param verificationToken - The user's verification token.
     * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
     * @returns The user object if found, otherwise null.
     */
    UsersModel.prototype.findUserByVerificationToken = function (verificationToken, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, userOAuthFields, selectFields, query, rows, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        selectFields = [userFields, userOAuthFields]
                            .filter(Boolean)
                            .join(", ");
                        query = "\n        SELECT ".concat(selectFields, "\n        FROM users u\n        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id\n        JOIN users_verification_tokens uvt ON u.user_id = uvt.user_id\n        WHERE uvt.verification_token = $1\n      ");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [verificationToken])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_5 = _a.sent();
                        console.error("Error in findUserByVerificationToken:", err_5);
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds a user by their reset password token, including data from the `users` and `users_oauth` tables.
     *
     * If no selectedFields provided it will returns all fields.
     *
     * @param resetPasswordToken - The reset password token associated with the user.
     * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
     * @returns The user object if found, otherwise null.
     */
    UsersModel.prototype.findUserByResetPasswordToken = function (resetPasswordToken, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, userOAuthFields, selectFields, query, rows, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        selectFields = [userFields, userOAuthFields]
                            .filter(Boolean)
                            .join(", ");
                        query = "\n        SELECT ".concat(selectFields, "\n        FROM users u\n        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id\n        JOIN users_reset_password_tokens urpt ON u.user_id = urpt.user_id\n        WHERE urpt.reset_password_token = $1\n      ");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [resetPasswordToken])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                    case 2:
                        err_6 = _a.sent();
                        console.error("Error in findUserByResetPasswordToken:", err_6);
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the avatar for a user.
     *
     * @param userId - The unique identifier of the user.
     * @returns The avatar URL if found, otherwise null.
     */
    UsersModel.prototype.findUserAvatar = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = "SELECT avatar FROM users_avatars WHERE user_id = $1";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [userId])];
                    case 1:
                        rows = (_b.sent()).rows;
                        return [2 /*return*/, (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.avatar];
                    case 2:
                        err_7 = _b.sent();
                        console.error("Error in findUserAvatar:", err_7);
                        throw err_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a list of users with optional sorting, pagination, and selected fields.
     *
     * Includes OAuth details if they exist.
     *
     * If no selectedFields provided it will returns all fields of the user.
     *
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional Maximum number of users to retrieve.
     * @param skip - Optional Number of users to skip for pagination.
     * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
     * @returns Array of user objects with OAuth details.
     */
    UsersModel.prototype.getUsers = function (order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, oauthFields, selectFields, query, params, rows, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        oauthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        selectFields = [userFields, oauthFields].filter(Boolean).join(", ");
                        query = "\n        SELECT ".concat(selectFields, "\n        FROM users u\n        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id\n        ORDER BY u.created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
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
                        err_8 = _a.sent();
                        console.error("Error in getUsers:", err_8);
                        throw err_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the total count of users from the records_count table.
     *
     * Ensures fast retrieval without performing a direct count on the users table.
     *
     * @returns Total number of users as a number.
     */
    UsersModel.prototype.getUsersCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT record_count AS total_users FROM records_count WHERE table_name = 'users'";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        // Return the count value, ensuring it's parsed as a number
                        return [2 /*return*/, rows.length ? Number(rows[0].total_users) : 0];
                    case 2:
                        err_9 = _a.sent();
                        console.error("Error in getUsersCount:", err_9);
                        throw err_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Searches for users by a keyword in their name or email.
     *
     * Includes OAuth details if they exist.
     *
     * If no selectedFields provided it will returns all fields of the user.
     *
     * @param searchKey - The keyword to search for in user names or emails.
     * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
     * @param limit - Optional maximum number of users to retrieve.
     * @param skip - Optional number of users to skip for pagination.
     * @param selectedFields - Optional array of fields to return; defaults to all fields.
     * @returns Array of user objects matching the search criteria with OAuth details.
     */
    UsersModel.prototype.searchUsers = function (searchKey, order, limit, skip, selectedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var userFields, oauthFields, selectFields, query, params, rows, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userFields = this.getUserSelectedFieldsWithAlias("u", selectedFields);
                        oauthFields = this.getUserOAuthSelectedFieldsWithAlias("uo", selectedFields);
                        selectFields = [userFields, oauthFields].filter(Boolean).join(", ");
                        query = "\n        SELECT ".concat(selectFields, "\n        FROM users u\n        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id\n        WHERE u.name ILIKE $1 OR u.email ILIKE $1\n        ORDER BY u.created_at ").concat(order === -1 ? "DESC" : "ASC", "\n      ");
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
                        err_10 = _a.sent();
                        console.error("Error in searchUsers:", err_10);
                        throw err_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Update Operations ===== */
    /**
     * Updates user information by their ID only for `users` table
     * and returns updatedUser their fields only from `users` table.
     *
     * @param userId - The unique identifier of the user.
     * @param user - Partial user data to update.
     * @returns updatedUser their fields only from `users` table.
     */
    UsersModel.prototype.updateUser = function (userId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser, fields, query, rows, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updatedUser = {};
                        fields = Object.keys(user)
                            .filter(function (key) { return user[key] !== undefined; })
                            .map(function (key, index) { return "".concat(key, " = $").concat(index + 2); })
                            .join(", ");
                        if (!fields)
                            return [2 /*return*/, updatedUser];
                        query = "UPDATE users SET ".concat(fields, " WHERE user_id = $1 RETURNING *");
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, __spreadArray([
                                userId
                            ], Object.values(user), true))];
                    case 1:
                        rows = (_a.sent()).rows;
                        updatedUser = __assign(__assign({}, updatedUser), rows[0]);
                        return [2 /*return*/, updatedUser];
                    case 2:
                        err_11 = _a.sent();
                        console.error("Error in updateUser:", err_11);
                        throw err_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets or deletes a verification token for a user.
     *
     * @param userId - The unique identifier of the user.
     * @param verificationToken - The verification token; pass an empty string to delete.
     * @returns void
     */
    UsersModel.prototype.setVerificationToken = function (userId, verificationToken) {
        return __awaiter(this, void 0, void 0, function () {
            var query, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(verificationToken === "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query("DELETE FROM users_verification_tokens WHERE user_id = $1", [userId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        query = "\n        INSERT INTO users_verification_tokens (user_id, verification_token) \n        VALUES ($1, $2)\n        ON CONFLICT (user_id) DO UPDATE SET verification_token = $2\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [userId, verificationToken])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_12 = _a.sent();
                        console.error("Error in setVerificationToken:", err_12);
                        throw err_12;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets or deletes a reset password token for a user.
     *
     * @param userId - The unique identifier of the user.
     * @param resetPasswordToken - The reset password token; pass an empty string to delete.
     * @returns void
     */
    UsersModel.prototype.setResetPasswordToken = function (userId, resetPasswordToken) {
        return __awaiter(this, void 0, void 0, function () {
            var query, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(resetPasswordToken === "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query("DELETE FROM users_reset_password_tokens WHERE user_id = $1", [userId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        query = "\n        INSERT INTO users_reset_password_tokens (user_id, reset_password_token) \n        VALUES ($1, $2)\n        ON CONFLICT (user_id) DO UPDATE SET reset_password_token = $2\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [userId, resetPasswordToken])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_13 = _a.sent();
                        console.error("Error in setResetPasswordToken:", err_13);
                        throw err_13;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets or deletes the avatar for a user.
     *
     * @param userId - The unique identifier of the user.
     * @param avatar - The avatar URL; pass an empty string to delete.
     * @returns void
     */
    UsersModel.prototype.setAvatar = function (userId, avatar) {
        return __awaiter(this, void 0, void 0, function () {
            var query, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(avatar === "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query("DELETE FROM users_avatars WHERE user_id = $1", [
                                userId,
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        query = "\n        INSERT INTO users_avatars (user_id, avatar) \n        VALUES ($1, $2)\n        ON CONFLICT (user_id) DO UPDATE SET avatar = $2\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [userId, avatar])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_14 = _a.sent();
                        console.error("Error in setAvatar:", err_14);
                        throw err_14;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /* ===== Delete Operations ===== */
    /**
     * Deletes a user by their ID.
     *
     * @param userId - The unique identifier of the user to delete.
     * @returns void
     */
    UsersModel.prototype.deleteUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Only delete the user from the 'users' table, cascading will take care of the rest
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query("DELETE FROM users WHERE user_id = $1", [userId])];
                    case 1:
                        // Only delete the user from the 'users' table, cascading will take care of the rest
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_15 = _a.sent();
                        console.error("Error in deleteUser:", err_15);
                        throw err_15;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes unverified user accounts that are older than a specified interval.
     *
     * @param interval - The time interval (e.g., '30 days') to determine stale accounts.
     * @example
     * deleteStaleUnverifiedUsers('1 day') deletes all unverified accounts older than 1 day.
     * @returns number of deleted accounts.
     */
    UsersModel.prototype.deleteStaleUnverifiedUsers = function (interval) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rowCount, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        DELETE FROM users \n        WHERE is_verified = false AND created_at < NOW() - $1::INTERVAL;\n      ";
                        return [4 /*yield*/, connectToPostgreSQL_1.pool.query(query, [interval])];
                    case 1:
                        rowCount = (_a.sent()).rowCount;
                        return [2 /*return*/, Number(rowCount)];
                    case 2:
                        err_16 = _a.sent();
                        console.error("Error in deleteStaleUnverifiedUsers:", err_16);
                        throw err_16;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UsersModel;
}());
exports.UsersModel = UsersModel;
