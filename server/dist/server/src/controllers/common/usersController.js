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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserAvatar = exports.updateUserPassword = exports.updateUserRole = exports.updateUserDetails = exports.getUser = exports.cleanupUnverifiedUsers = exports.getTotalUsersCount = exports.searchUsers = exports.getUsers = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var logger_1 = require("../../config/logger");
var database_1 = require("../../database");
var RgxList_1 = require("../../utils/RgxList");
var deleteFileFromCloudinary_1 = require("../../utils/deleteFileFromCloudinary");
var httpStatusText_1 = require("../../utils/httpStatusText");
var isFileExistsInCloudinary_1 = require("../../utils/isFileExistsInCloudinary");
var rolesList_1 = require("../../utils/rolesList");
// Logger for users service
var usersLogger = (0, logger_1.getServiceLogger)("users");
/**
 * Retrieves a paginated list of users.
 * Accepts optional query parameters for pagination (limit and page).
 * Responds with the list of users or an appropriate error message.
 *
 * @param req - Express request object containing optional `limit` and `page` query parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, page, skip, users, err_1;
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
                return [4 /*yield*/, database_1.usersModel.getUsers(-1, limit, skip)];
            case 1:
                users = _c.sent();
                // Send response with users and pagination metadata
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Users retrieved successfully.",
                    data: { users: users },
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
exports.getUsers = getUsers;
/**
 * Searches for users based on a search key.
 * Accepts optional query parameters for `searchKey`, `limit`, and `page`.
 * Responds with the list of matching users or an appropriate error message.
 *
 * @param req - Express request object containing `searchKey` in the query and optional `limit` and `page` parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var searchUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchKey, limit, page, skip, users, err_2;
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
                return [4 /*yield*/, database_1.usersModel.searchUsers(searchKey, -1, limit, skip)];
            case 1:
                users = _d.sent();
                // Respond with search results and pagination metadata
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Search results retrieved successfully.",
                    data: { users: users },
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
exports.searchUsers = searchUsers;
/**
 * Retrieves the total count of users in the system.
 * Responds with the total user count or an appropriate error message.
 *
 * @param req - Express request object (unused in this case).
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getTotalUsersCount = function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var totalUsersCount, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.usersModel.getUsersCount()];
            case 1:
                totalUsersCount = _a.sent();
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Total users count retrieved successfully.",
                    data: { totalUsersCount: totalUsersCount },
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
exports.getTotalUsersCount = getTotalUsersCount;
/**
 * Deletes unverified user accounts older than the specified interval.
 * Accessible only by Admin via this route.
 *
 * @param req - Express request object containing an optional `interval` query parameter.
 * @param res - Express response object.
 * @param next - Express next function to handle errors.
 */
var cleanupUnverifiedUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var interval, validIntervals, count, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                interval = req.query.interval || "1 day";
                validIntervals = [
                    "1 day",
                    "7 days",
                    "30 days",
                    "1 hour",
                    "12 hours",
                ];
                if (!validIntervals.includes(interval)) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid interval. Allowed intervals: ".concat(validIntervals.join(", "), "."),
                        })];
                }
                return [4 /*yield*/, database_1.usersModel.deleteStaleUnverifiedUsers(interval)];
            case 1:
                count = _a.sent();
                usersLogger.info("cleanupUnverifiedUsers: ".concat(count, " unverified users older than ").concat(interval, " deleted successfully."));
                res.status(204).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "".concat(count, " unverified users older than ").concat(interval, " deleted successfully."),
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
exports.cleanupUnverifiedUsers = cleanupUnverifiedUsers;
/**
 * Retrieves a user by their ID.
 * Verifies that the current user is authorized to access the requested user's data.
 * Responds with the user details or an appropriate error message.
 *
 * @param req - Express request object containing the user ID in the route parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var getUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, requesterId, requesterRole, user, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                requesterId = res.locals.userInfo.user_id;
                requesterRole = res.locals.userInfo.role;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Authorization check
                if (requesterRole !== rolesList_1.ROLES_LIST.Admin && requesterId !== userId) {
                    usersLogger.warn("getUser: Unauthorized access attempt by user {".concat(requesterId, "} to user {").concat(userId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have access to this resource.",
                        })];
                }
                return [4 /*yield*/, database_1.usersModel.findUserById(userId, [
                        "user_id",
                        "name",
                        "email",
                        "role",
                        "is_verified",
                        "created_at",
                        "updated_at",
                        "provider",
                        "provider_user_id",
                    ])];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Account not found.",
                        })];
                }
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "User retrieved successfully.",
                    data: { user: user },
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
exports.getUser = getUser;
/**
 * Updates the user's details (name).
 * Verifies that the current user is authorized to make the update.
 *
 * @param req - Express request object containing the user ID in the route parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var updateUserDetails = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, requesterId, name_1, updatedFields, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                requesterId = res.locals.userInfo.user_id;
                name_1 = req.body.name;
                // Check if the current user is trying to update their own information (authorization check)
                if (requesterId !== userId) {
                    usersLogger.warn("updateUserDetails: Unauthorized update attempt by {".concat(requesterId, "} on {").concat(userId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have access to this resource.", // Forbidden if user is not the owner
                        })];
                }
                updatedFields = {};
                // Validate and update the name if provided
                if (name_1) {
                    // Use a regular expression to ensure the name is valid
                    if (!RgxList_1.RgxList.NAME_REGEX.test(name_1)) {
                        return [2 /*return*/, res.status(400).send({
                                statusText: httpStatusText_1.httpStatusText.FAIL,
                                message: "Invalid name format.", // Invalid name format error
                            })];
                    }
                    updatedFields.name = name_1; // Update name in the fields to be updated
                }
                // Perform the update in the database
                return [4 /*yield*/, database_1.usersModel.updateUser(userId, updatedFields)];
            case 1:
                // Perform the update in the database
                _a.sent();
                usersLogger.info("updateUserDetails: User with ID {".concat(userId, "} updated successfully"));
                // Send a success response with a message confirming the update
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "User details updated successfully.",
                });
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                next(err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUserDetails = updateUserDetails;
/**
 * Updates the user's role (Only admin who can do this).
 * Verifies that the current user has the right privileges.
 *
 * @param req - Express request object containing the user ID and new role.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var updateUserRole = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, newRole, user, newAuthorPermissions, authorAvatar, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                userId = req.params.userId;
                newRole = req.body.role;
                return [4 /*yield*/, database_1.usersModel.findUserById(userId, ["user_id", "role"])];
            case 1:
                user = _a.sent();
                // If the user is not found, return a 404 error
                if (!user) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Account not found.", // User account not found error
                        })];
                }
                // Prevent updating admin 's role
                if (user.role === rolesList_1.ROLES_LIST.Admin) {
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Can not update admin 's role.",
                        })];
                }
                // Validate the new role to ensure it's one of the allowed roles
                if (newRole !== rolesList_1.ROLES_LIST.User && newRole !== rolesList_1.ROLES_LIST.Author) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid role.",
                        })];
                }
                // Update the user's role in the database
                return [4 /*yield*/, database_1.usersModel.updateUser(req.params.userId, { role: newRole })];
            case 2:
                // Update the user's role in the database
                _a.sent();
                if (!(user.role === rolesList_1.ROLES_LIST.User && newRole === rolesList_1.ROLES_LIST.Author)) return [3 /*break*/, 5];
                newAuthorPermissions = {
                    user_id: user.user_id, // Reference to the user's ID
                    create: true, // Grant permissions to create articles
                    update: true, // Grant permissions to update articles
                    delete: true, // Grant permissions to delete articles
                };
                // Add the new author permissions to the database
                return [4 /*yield*/, database_1.authorsModel.createAuthorPermissions(user.user_id, newAuthorPermissions)];
            case 3:
                // Add the new author permissions to the database
                _a.sent();
                // Add the new author avatar to the database
                return [4 /*yield*/, database_1.usersModel.setAvatar(user.user_id, process.env.CLOUDINARY_DEFAULT_AVATAR || "")];
            case 4:
                // Add the new author avatar to the database
                _a.sent();
                usersLogger.info("updateUserRole: User {".concat(userId, "} upgraded to author"));
                return [3 /*break*/, 11];
            case 5:
                if (!(user.role === rolesList_1.ROLES_LIST.Author && newRole === rolesList_1.ROLES_LIST.User)) return [3 /*break*/, 11];
                // Delete the author permissions from the database for this user
                return [4 /*yield*/, database_1.authorsModel.deleteAuthorPermissions(user.user_id)];
            case 6:
                // Delete the author permissions from the database for this user
                _a.sent();
                return [4 /*yield*/, database_1.usersModel.findUserAvatar(user.user_id)];
            case 7:
                authorAvatar = _a.sent();
                return [4 /*yield*/, database_1.usersModel.setAvatar(user.user_id, "")];
            case 8:
                _a.sent();
                if (!authorAvatar) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, deleteFileFromCloudinary_1.deleteFileFromCloudinary)(authorAvatar)];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                usersLogger.info("updateUserRole: Author {".concat(userId, "} downgraded to user"));
                _a.label = 11;
            case 11:
                // Send a success response confirming the role update
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "User role updated successfully.",
                });
                return [3 /*break*/, 13];
            case 12:
                err_7 = _a.sent();
                next(err_7);
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.updateUserRole = updateUserRole;
/**
 * Updates the user's password.
 * Verifies that the current user has the right credentials and provides a new password.
 *
 * @param req - Express request object containing the user ID, old password, and new password.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var updateUserPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, requesterId, _a, oldPassword, newPassword, user, isOldPasswordMatch, hashedPassword, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                userId = req.params.userId;
                requesterId = res.locals.userInfo.user_id;
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                // Validate that both old and new passwords are provided
                if (!oldPassword || !newPassword) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "oldPassword and newPassword are required.",
                        })];
                }
                // Verify if the current user is authorized to update the password for the specified user ID
                if (requesterId !== userId) {
                    usersLogger.warn("updateUserPassword: Unauthorized update password attempt by {".concat(requesterId, "} on {").concat(userId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have access to this resource.",
                        })];
                }
                return [4 /*yield*/, database_1.usersModel.findUserById(userId, ["user_id", "password"])];
            case 1:
                user = _b.sent();
                // If the user is not found, return a 404 error
                if (!user) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Account not found.",
                        })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(oldPassword, user.password)];
            case 2:
                isOldPasswordMatch = _b.sent();
                // If the old password is incorrect, return a 403 error
                if (!isOldPasswordMatch) {
                    usersLogger.warn("updateUserPassword: Wrong old password while updating password attempt on {".concat(userId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Incorrect old password.",
                        })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 3:
                hashedPassword = _b.sent();
                // Update the user's password in the database
                return [4 /*yield*/, database_1.usersModel.updateUser(userId, { password: hashedPassword })];
            case 4:
                // Update the user's password in the database
                _b.sent();
                usersLogger.info("updateUserPassword: Password updated successfully for {".concat(userId, "}"));
                // Send a success response confirming the password update
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Password updated successfully.",
                });
                return [3 /*break*/, 6];
            case 5:
                err_8 = _b.sent();
                next(err_8);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateUserPassword = updateUserPassword;
/**
 * Updates the user's avatar.
 * Verifies that the current user is authorized to upload a new avatar.
 *
 * @param req - Express request object containing the user ID and new avatar file.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var updateUserAvatar = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, requesterId, newAvatar, oldUserAvatar, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                userId = req.params.userId;
                requesterId = res.locals.userInfo.user_id;
                newAvatar = req.body.avatar;
                // Validate that an avatar file is provided in the request
                if (!newAvatar) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "avatar is required.",
                        })];
                }
                // Ensure that only the account owner can update their avatar
                if (requesterId !== userId) {
                    usersLogger.warn("updateUserAvatar: Unauthorized avatar update attempt by {".concat(requesterId, "} on {").concat(userId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have access to this resource.",
                        })];
                }
                return [4 /*yield*/, (0, isFileExistsInCloudinary_1.isFileExistsInCloudinary)(newAvatar)];
            case 1:
                // Check if avatar exists in media storage (Cloudinary)
                if (!(_a.sent())) {
                    usersLogger.warn("updateUserAvatar: Avatar {".concat(newAvatar, "} not found in media storage for user {").concat(userId, "}"));
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Avatar is not uploaded to the storage.",
                        })];
                }
                return [4 /*yield*/, database_1.usersModel.findUserAvatar(userId)];
            case 2:
                oldUserAvatar = _a.sent();
                // Update the user's avatar in the database
                return [4 /*yield*/, database_1.usersModel.setAvatar(userId, newAvatar)];
            case 3:
                // Update the user's avatar in the database
                _a.sent();
                if (!(oldUserAvatar &&
                    oldUserAvatar !== process.env.CLOUDINARY_DEFAULT_AVATAR)) return [3 /*break*/, 5];
                usersLogger.info("updateUserAvatar: Deleting old avatar {".concat(oldUserAvatar, "} from Cloudinary for user {").concat(userId, "}"));
                return [4 /*yield*/, (0, deleteFileFromCloudinary_1.deleteFileFromCloudinary)(oldUserAvatar)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                // Log successful avatar update
                usersLogger.info("updateUserAvatar: Avatar updated successfully for user {".concat(userId, "}"));
                // Send a success response confirming the avatar update
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Avatar updated successfully.",
                });
                return [3 /*break*/, 7];
            case 6:
                err_9 = _a.sent();
                next(err_9);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateUserAvatar = updateUserAvatar;
/**
 * Deletes a user by their ID.
 * Verifies that the current user is authorized to delete the requested user.
 * Responds with appropriate success or error messages.
 *
 * @param req - Express request object containing the user ID in the route parameters.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var deleteUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, requesterId, requesterRole, password, user, isPasswordMatch, userAvatar, _a, err_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.params.userId;
                requesterId = res.locals.userInfo.user_id;
                requesterRole = res.locals.userInfo.role;
                password = req.body.password;
                usersLogger.info("deleteUser: Request to delete user with ID {".concat(userId, "} by {").concat(requesterId, "} (").concat(requesterRole, ")"));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                // Check if the user has permission to delete the account
                if (requesterRole !== rolesList_1.ROLES_LIST.Admin && requesterId !== userId) {
                    usersLogger.warn("deleteUser: Unauthorized delete attempt by {".concat(requesterId, "} on {").concat(userId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "You don't have access to this resource.",
                        })];
                }
                return [4 /*yield*/, database_1.usersModel.findUserById(userId, [
                        "user_id",
                        "password",
                        "role",
                        "provider",
                        "provider_user_id",
                    ])];
            case 2:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Account not found.",
                        })];
                }
                // Prevent deleting admins
                if (user.role === rolesList_1.ROLES_LIST.Admin) {
                    usersLogger.warn("deleteUser: Attempt to delete admin account {".concat(userId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Admin cannot be deleted.",
                        })];
                }
                if (!(requesterRole !== rolesList_1.ROLES_LIST.Admin &&
                    !(user.provider && user.provider_user_id))) return [3 /*break*/, 4];
                if (!password) {
                    usersLogger.warn("deleteUser: Password not provided for deletion attempt by {".concat(requesterId, "}"));
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Password is required.",
                        })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                isPasswordMatch = _b.sent();
                if (!isPasswordMatch) {
                    usersLogger.warn("deleteUser: Incorrect password for deletion attempt by {".concat(requesterId, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Wrong password.",
                        })];
                }
                _b.label = 4;
            case 4:
                if (![rolesList_1.ROLES_LIST.Admin, rolesList_1.ROLES_LIST.Author].includes(user.role)) return [3 /*break*/, 6];
                return [4 /*yield*/, database_1.usersModel.findUserAvatar(user.user_id)];
            case 5:
                _a = _b.sent();
                return [3 /*break*/, 7];
            case 6:
                _a = null;
                _b.label = 7;
            case 7:
                userAvatar = _a;
                if (!(userAvatar && userAvatar !== process.env.CLOUDINARY_DEFAULT_AVATAR)) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, deleteFileFromCloudinary_1.deleteFileFromCloudinary)(userAvatar)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9: 
            // Delete the user
            return [4 /*yield*/, database_1.usersModel.deleteUser(userId)];
            case 10:
                // Delete the user
                _b.sent();
                usersLogger.info("deleteUser: User with ID {".concat(userId, "} deleted successfully"));
                res.status(204).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "User deleted successfully.",
                });
                return [3 /*break*/, 12];
            case 11:
                err_10 = _b.sent();
                next(err_10);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
