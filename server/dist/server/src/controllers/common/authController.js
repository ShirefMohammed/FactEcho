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
exports.loginWithFacebookCallback = exports.loginWithFacebook = exports.loginWithGoogleCallback = exports.loginWithGoogle = exports.resetPassword = exports.sendResetPasswordForm = exports.forgetPassword = exports.verifyAccount = exports.logout = exports.refresh = exports.login = exports.register = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var node_path_1 = __importDefault(require("node:path"));
var passport_1 = __importDefault(require("passport"));
var logger_1 = require("../../config/logger");
var database_1 = require("../../database");
var RgxList_1 = require("../../utils/RgxList");
var generateAccessToken_1 = require("../../utils/generateAccessToken");
var generateRefreshToken_1 = require("../../utils/generateRefreshToken");
var generateResetPasswordToken_1 = require("../../utils/generateResetPasswordToken");
var generateVerificationToken_1 = require("../../utils/generateVerificationToken");
var httpStatusText_1 = require("../../utils/httpStatusText");
var rolesList_1 = require("../../utils/rolesList");
var sendResetPasswordEmail_1 = require("../../utils/sendResetPasswordEmail");
var sendVerificationEmail_1 = require("../../utils/sendVerificationEmail");
// Logger for auth service
var authLogger = (0, logger_1.getServiceLogger)("auth");
/**
 * Handles user registration.
 * Validates user input, creates a new user in the database, generates a verification token,
 * and sends a verification email.
 *
 * @param req - Express request object containing `name`, `email`, and `password` in the body.
 * @param res - Express response object used to send statusText and message.
 * @param next - Express next function to handle errors.
 */
var register = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, user, hashedPassword, newUser, verificationToken, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password;
                // Validate required fields
                if (!name_1 || !email || !password) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "All fields are required",
                        })];
                }
                // Validate name format
                if (!RgxList_1.RgxList.NAME_REGEX.test(name_1)) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid name format",
                        })];
                }
                // Validate email format
                if (!RgxList_1.RgxList.EMAIL_REGEX.test(email)) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Enter a valid email",
                        })];
                }
                // Validate password format
                if (!RgxList_1.RgxList.PASS_REGEX.test(password)) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Invalid password format",
                        })];
                }
                return [4 /*yield*/, database_1.usersModel.findUserByEmail(email, ["user_id"])];
            case 1:
                user = _b.sent();
                if (user) {
                    authLogger.warn("Register: User with the same email {".concat(email, "} already exists"));
                    return [2 /*return*/, res.status(409).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "User with the same email already exists",
                        })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, database_1.usersModel.createUser({
                        name: name_1,
                        email: email,
                        password: hashedPassword,
                    })];
            case 3:
                newUser = _b.sent();
                verificationToken = (0, generateVerificationToken_1.generateVerificationToken)(newUser.user_id);
                return [4 /*yield*/, database_1.usersModel.setVerificationToken(newUser.user_id, verificationToken)];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, sendVerificationEmail_1.sendVerificationEmail)(email, verificationToken)];
            case 5:
                _b.sent();
                authLogger.info("Register: Verification email sent to {".concat(email, "}"));
                // Success response
                res.status(201).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Registration succeeded. Check email for verification link",
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
/**
 * Handles user login.
 * Validates user input, checks credentials, verifies account status, and generates tokens.
 * Sets a secure HTTP-only refresh token in cookies and returns an access token.
 *
 * @param req - Express request object containing `email` and `password` in the body.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Express next function to handle errors.
 */
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordMatch, userAvatar, _b, accessToken, refreshToken, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                _a = req.body, email = _a.email, password = _a.password;
                // Validate required fields
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "All fields are required",
                        })];
                }
                return [4 /*yield*/, database_1.usersModel.findUserByEmail(email)];
            case 1:
                user = _c.sent();
                if (!user || (user.provider && user.provider_user_id)) {
                    authLogger.warn("Login: User account with email {".concat(email, "} not found"));
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "User not found",
                        })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                isPasswordMatch = _c.sent();
                if (!isPasswordMatch) {
                    authLogger.warn("Login: Wrong password attempt by {".concat(email, "}"));
                    return [2 /*return*/, res.status(401).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Wrong password",
                        })];
                }
                // Check if the user's account is verified
                if (!user.is_verified) {
                    authLogger.warn("Login: Unverified account login attempt by {".concat(email, "}"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Your account is not verified",
                        })];
                }
                if (![rolesList_1.ROLES_LIST.Admin, rolesList_1.ROLES_LIST.Author].includes(user.role)) return [3 /*break*/, 4];
                return [4 /*yield*/, database_1.usersModel.findUserAvatar(user.user_id)];
            case 3:
                _b = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                _b = null;
                _c.label = 5;
            case 5:
                userAvatar = _b;
                accessToken = (0, generateAccessToken_1.generateAccessToken)(user.user_id, user.role);
                refreshToken = (0, generateRefreshToken_1.generateRefreshToken)(user.user_id);
                // Clear any existing JWT cookie
                res.clearCookie("jwt", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                // Set a new secure refresh token cookie
                res.cookie("jwt", refreshToken, {
                    httpOnly: true, // Accessible only by the server
                    secure: true, // HTTPS only
                    sameSite: "none", // Allows cross-site cookies
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                authLogger.info("Login: User with email {".concat(email, "} logged in"));
                // Respond with user data and access token
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Login succeeded",
                    data: {
                        user: {
                            user_id: user.user_id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            avatar: userAvatar,
                        },
                        accessToken: accessToken,
                    },
                });
                return [3 /*break*/, 7];
            case 6:
                err_2 = _c.sent();
                next(err_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
/**
 * Handles refresh token rotation and generates new access and refresh tokens.
 * Clears the old refresh token cookie, validates the token, and sets a new cookie.
 *
 * @param req - Express request object with cookies.
 * @param res - Express response object used to send statusText, message, and data.
 * @param next - Middleware function for error handling.
 */
var refresh = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshTokenCookie;
    return __generator(this, function (_a) {
        try {
            refreshTokenCookie = req.cookies.jwt;
            // Ensure refresh token cookie exists
            if (!refreshTokenCookie) {
                return [2 /*return*/, res.status(401).send({
                        statusText: httpStatusText_1.httpStatusText.FAIL,
                        message: "Refresh token jwt is required",
                    })];
            }
            // Clear old refresh token cookie
            res.clearCookie("jwt", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            // Verify the refresh token
            jsonwebtoken_1.default.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                var user, userAvatar, _a, accessToken, newRefreshToken;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (err) {
                                return [2 /*return*/, res.status(401).send({
                                        statusText: httpStatusText_1.httpStatusText.RefreshTokenExpiredError,
                                        message: "Refresh token is forbidden",
                                    })];
                            }
                            return [4 /*yield*/, database_1.usersModel.findUserById(decoded === null || decoded === void 0 ? void 0 : decoded.user_id)];
                        case 1:
                            user = _b.sent();
                            if (!user) {
                                return [2 /*return*/, res.status(404).send({
                                        statusText: httpStatusText_1.httpStatusText.FAIL,
                                        message: "Account is not found",
                                    })];
                            }
                            if (![rolesList_1.ROLES_LIST.Admin, rolesList_1.ROLES_LIST.Author].includes(user.role)) return [3 /*break*/, 3];
                            return [4 /*yield*/, database_1.usersModel.findUserAvatar(user.user_id)];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = null;
                            _b.label = 4;
                        case 4:
                            userAvatar = _a;
                            accessToken = (0, generateAccessToken_1.generateAccessToken)(user.user_id, user.role);
                            newRefreshToken = (0, generateRefreshToken_1.generateRefreshToken)(user.user_id);
                            // Set new refresh token cookie
                            res.cookie("jwt", newRefreshToken, {
                                httpOnly: true,
                                secure: true,
                                sameSite: "none",
                                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                            });
                            authLogger.info("Refresh: Tokens rotated successfully to {".concat(user.user_id, "}"));
                            // Respond with user data and access token
                            res.status(200).send({
                                statusText: httpStatusText_1.httpStatusText.SUCCESS,
                                message: "Refresh succeeded",
                                data: {
                                    user: {
                                        user_id: user.user_id,
                                        name: user.name,
                                        email: user.email,
                                        role: user.role,
                                        avatar: userAvatar,
                                    },
                                    accessToken: accessToken,
                                },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (err) {
            next(err);
        }
        return [2 /*return*/];
    });
}); };
exports.refresh = refresh;
/**
 * Handles user logout by clearing the refresh token cookie.
 * Sends a 204 No Content response upon successful logout.
 *
 * @param _req - Express request object (unused in this handler).
 * @param res - Express response object to send status.
 * @param next - Middleware function for error handling.
 */
var logout = function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // Clear the refresh token cookie
            res.clearCookie("jwt", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            authLogger.info("Logout: User logged out");
            // Respond with no content status
            res.sendStatus(204);
        }
        catch (err) {
            next(err);
        }
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
/**
 * Verifies a user's account using a verification token.
 * Updates the user's verification status if the token is valid.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Middleware for error handling.
 */
var verifyAccount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var verificationToken, user, decodedToken, error_1, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                verificationToken = req.query.verificationToken;
                // Validate the presence and type of the verification token
                if (!verificationToken || typeof verificationToken !== "string") {
                    return [2 /*return*/, res.status(400).send("Verification token is missing")];
                }
                return [4 /*yield*/, database_1.usersModel.findUserByVerificationToken(verificationToken, ["user_id"])];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send("Invalid verification token")];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                decodedToken = jsonwebtoken_1.default.verify(verificationToken, process.env.VERIFICATION_TOKEN_SECRET);
                // Check if the decoded token matches the user's ID
                if (typeof decodedToken === "object" &&
                    decodedToken !== null &&
                    "user_id" in decodedToken &&
                    decodedToken.user_id !== user.user_id) {
                    return [2 /*return*/, res.status(409).send("Invalid verification token")];
                }
                // Update the user's verification status and clear the token
                return [4 /*yield*/, database_1.usersModel.updateUser(user.user_id, { is_verified: true })];
            case 3:
                // Update the user's verification status and clear the token
                _a.sent();
                return [4 /*yield*/, database_1.usersModel.setVerificationToken(user.user_id, "")];
            case 4:
                _a.sent();
                authLogger.info("VerifyAccount: User {".concat(user.user_id, "} account verified successfully"));
                // Send the confirmation page to the user
                return [2 /*return*/, res
                        .status(200)
                        .sendFile(node_path_1.default.join(__dirname, "..", "..", "views", "verification_confirmation.html"))];
            case 5:
                error_1 = _a.sent();
                authLogger.warn("VerifyAccount: User {".concat(user.user_id, "} account is verification token has been expired"));
                return [2 /*return*/, res
                        .status(401)
                        .send("Verification token has been expired. Go to forget password page to generate a new verification token")];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.verifyAccount = verifyAccount;
/**
 * Sends a reset password email with a reset password token.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Middleware for error handling.
 */
var forgetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, resetPasswordToken, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                email = req.body.email;
                // Check if the email field is provided
                if (!email) {
                    return [2 /*return*/, res.status(400).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "Email is required",
                        })];
                }
                return [4 /*yield*/, database_1.usersModel.findUserByEmail(email, [
                        "user_id",
                        "provider",
                        "provider_user_id",
                    ])];
            case 1:
                user = _a.sent();
                // Return 404 if no user is found
                if (!user) {
                    authLogger.warn("forgetPassword: No user found with this email {".concat(email, "}"));
                    return [2 /*return*/, res.status(404).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "User not found",
                        })];
                }
                // Return 403 if user registered via OAuth
                if (user.provider && user.provider_user_id) {
                    authLogger.warn("forgetPassword: User with email {".concat(email, "} from OAuth forbidden"));
                    return [2 /*return*/, res.status(403).send({
                            statusText: httpStatusText_1.httpStatusText.FAIL,
                            message: "This action is not available for user who registered with OAuth",
                        })];
                }
                resetPasswordToken = (0, generateResetPasswordToken_1.generateResetPasswordToken)(user.user_id);
                return [4 /*yield*/, database_1.usersModel.setResetPasswordToken(user.user_id, resetPasswordToken)];
            case 2:
                _a.sent();
                // Send the reset password email
                return [4 /*yield*/, (0, sendResetPasswordEmail_1.sendResetPasswordEmail)(email, resetPasswordToken)];
            case 3:
                // Send the reset password email
                _a.sent();
                // Respond with a success message
                authLogger.info("forgetPassword: Reset password email sent successfully to {".concat(email, "}"));
                res.status(200).send({
                    statusText: httpStatusText_1.httpStatusText.SUCCESS,
                    message: "Check your email for the reset password link",
                });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.forgetPassword = forgetPassword;
/**
 * Verifies a reset password token and sends the reset password form.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Middleware for error handling.
 */
var sendResetPasswordForm = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var resetPasswordToken, user, decodedToken, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                resetPasswordToken = req.query.resetPasswordToken;
                // Check if the reset password token is present and valid
                if (!resetPasswordToken || typeof resetPasswordToken !== "string") {
                    return [2 /*return*/, res.status(400).send("Reset password token is missing")];
                }
                return [4 /*yield*/, database_1.usersModel.findUserByResetPasswordToken(resetPasswordToken, ["user_id"])];
            case 1:
                user = _a.sent();
                // Return 404 if the token is invalid or the user is not found
                if (!user) {
                    return [2 /*return*/, res.status(404).send("Invalid reset password token")];
                }
                try {
                    decodedToken = jsonwebtoken_1.default.verify(resetPasswordToken, process.env.RESETPASSWORD_TOKEN_SECRET);
                    // Check if the token matches the user's ID
                    if (typeof decodedToken === "object" &&
                        decodedToken !== null &&
                        "userId" in decodedToken &&
                        decodedToken.user_id !== user.user_id) {
                        return [2 /*return*/, res.status(409).send("Invalid reset password token")];
                    }
                    // Serve the reset password form
                    authLogger.info("sendResetPasswordForm: Serving reset password form to user {".concat(user.user_id, "}"));
                    return [2 /*return*/, res
                            .status(200)
                            .sendFile(node_path_1.default.join(__dirname, "..", "..", "views", "reset_password_form.html"))];
                }
                catch (error) {
                    authLogger.warn("sendResetPasswordForm: User {".concat(user.user_id, "} account is reset password token has been expired"));
                    return [2 /*return*/, res
                            .status(401)
                            .send("Reset password token has been expired. Go to forget password page to generate a new reset password token")];
                }
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendResetPasswordForm = sendResetPasswordForm;
/**
 * Resets the user's password using a valid reset password token.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Middleware for error handling.
 */
var resetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, resetPasswordToken, newPassword, user, _b, _c, _d, err_6;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 6, , 7]);
                _a = req.body, resetPasswordToken = _a.resetPasswordToken, newPassword = _a.newPassword;
                // Validate input fields
                if (!resetPasswordToken) {
                    return [2 /*return*/, res.status(400).send("Reset password token is required")];
                }
                if (!newPassword) {
                    return [2 /*return*/, res.status(400).send("New password is required")];
                }
                return [4 /*yield*/, database_1.usersModel.findUserByResetPasswordToken(resetPasswordToken, ["user_id"])];
            case 1:
                user = _f.sent();
                // Return 404 if the token is invalid or the user is not found
                if (!user) {
                    return [2 /*return*/, res.status(404).send("Invalid reset password token")];
                }
                // Validate the new password format
                if (!RgxList_1.RgxList.PASS_REGEX.test(newPassword)) {
                    return [2 /*return*/, res
                            .status(400)
                            .send("Password must be in english, 8 to 24 characters, Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: !, @, #, $, %")];
                }
                _c = (_b = database_1.usersModel).updateUser;
                _d = [user.user_id];
                _e = {};
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 2: 
            // Update the user's password and clear tokens
            return [4 /*yield*/, _c.apply(_b, _d.concat([(_e.password = _f.sent(),
                        _e.is_verified = true,
                        _e)]))];
            case 3:
                // Update the user's password and clear tokens
                _f.sent();
                return [4 /*yield*/, database_1.usersModel.setVerificationToken(user.user_id, "")];
            case 4:
                _f.sent();
                return [4 /*yield*/, database_1.usersModel.setResetPasswordToken(user.user_id, "")];
            case 5:
                _f.sent();
                // Respond with a success message
                authLogger.info("resetPassword: Password reset successfully for user {".concat(user.user_id, "}"));
                res.status(200).send("Reset password succeeded, You can login now");
                return [3 /*break*/, 7];
            case 6:
                err_6 = _f.sent();
                next(err_6);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
/**
 * Login with Google.
 *
 * This function initiates the OAuth 2.0 flow with Google to authenticate the user.
 * It requests profile and email scopes from the Google API.
 */
exports.loginWithGoogle = passport_1.default.authenticate("google", { scope: ["profile", "email"] });
/**
 * Callback handler for Google login.
 *
 * This function is triggered after the user completes the OAuth 2.0 login process with Google.
 * It processes the Google response, checks if the user exists, creates a new user if needed,
 * and generates authentication tokens (refresh) for the user.
 *
 * @param req - Express request object that contains the authentication response from Google.
 * @param res - Express response object used to send the response to the client.
 * @param next - Express middleware function to handle errors.
 */
var loginWithGoogleCallback = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Authenticate the user using the Google profile provided by OAuth
        passport_1.default.authenticate("google", function (err, profile) { return __awaiter(void 0, void 0, void 0, function () {
            var name_2, email, provider, provider_user_id, user, newUser, refreshToken, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (err) {
                            // Forward error to error handling middleware if authentication fails
                            return [2 /*return*/, next(err)];
                        }
                        if (!profile) {
                            // If the profile is missing, send a 401 Unauthorized response
                            return [2 /*return*/, res.status(401).send({
                                    statusText: httpStatusText_1.httpStatusText.FAIL,
                                    message: "Authentication failed",
                                })];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        name_2 = profile === null || profile === void 0 ? void 0 : profile.displayName;
                        email = (_b = (_a = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
                        provider = profile === null || profile === void 0 ? void 0 : profile.provider;
                        provider_user_id = profile === null || profile === void 0 ? void 0 : profile.id;
                        // Validate the essential fields (name, email, provider, and provider_user_id)
                        if (!name_2 || !email || !provider || !provider_user_id) {
                            return [2 /*return*/, res.status(400).send({
                                    statusText: httpStatusText_1.httpStatusText.FAIL,
                                    message: "Missing required fields (name, email, provider, provider_user_id)",
                                })];
                        }
                        return [4 /*yield*/, database_1.usersModel.findUserByOAuth(provider, provider_user_id)];
                    case 2:
                        user = _c.sent();
                        if (!!user) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_1.usersModel.createUser({
                                name: name_2,
                                email: email,
                                is_verified: true, // Automatically verify the user since it's Google login
                                provider: provider,
                                provider_user_id: provider_user_id,
                            })];
                    case 3:
                        newUser = _c.sent();
                        user = newUser;
                        authLogger.info("loginWithGoogleCallback: New user with email {".concat(email, "} created successfully"));
                        _c.label = 4;
                    case 4:
                        refreshToken = (0, generateRefreshToken_1.generateRefreshToken)(user.user_id);
                        // Clear the existing JWT cookie and set the new refresh token
                        res.clearCookie("jwt", {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                        });
                        res.cookie("jwt", refreshToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                        });
                        authLogger.info("loginWithGoogleCallback: User with email {".concat(email, "} logged in via Google"));
                        // Server redirects after successful login
                        res.redirect("".concat(process.env.CLIENT_URL, "/auth/oauth-success"));
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _c.sent();
                        next(error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); })(req, res, next);
        return [2 /*return*/];
    });
}); };
exports.loginWithGoogleCallback = loginWithGoogleCallback;
/**
 * Login with Facebook.
 *
 * This function initiates the OAuth 2.0 flow with Facebook to authenticate the user.
 * It requests profile and email scopes from the Facebook API.
 */
exports.loginWithFacebook = passport_1.default.authenticate("facebook", { scope: ["public_profile"] });
/**
 * Callback handler for Facebook login.
 *
 * This function is triggered after the user completes the OAuth 2.0 login process with Facebook.
 * It processes the Facebook response, checks if the user exists, creates a new user if needed,
 * and generates authentication tokens (refresh) for the user.
 *
 * @param req - Express request object that contains the authentication response from Facebook.
 * @param res - Express response object used to send the response to the client.
 * @param next - Express middleware function to handle errors.
 */
var loginWithFacebookCallback = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Authenticate the user using the Facebook public_profile provided by OAuth
        passport_1.default.authenticate("facebook", function (err, public_profile) { return __awaiter(void 0, void 0, void 0, function () {
            var name_3, provider, provider_user_id, user, newUser, refreshToken, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            // Forward error to error handling middleware if authentication fails
                            return [2 /*return*/, next(err)];
                        }
                        if (!public_profile) {
                            // If the public_profile is missing, send a 401 Unauthorized response
                            return [2 /*return*/, res.status(401).send({
                                    statusText: httpStatusText_1.httpStatusText.FAIL,
                                    message: "Authentication failed",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        name_3 = public_profile === null || public_profile === void 0 ? void 0 : public_profile.displayName;
                        provider = public_profile === null || public_profile === void 0 ? void 0 : public_profile.provider;
                        provider_user_id = public_profile === null || public_profile === void 0 ? void 0 : public_profile.id;
                        // Validate the essential fields (name, provider, and provider_user_id)
                        if (!name_3 || !provider || !provider_user_id) {
                            return [2 /*return*/, res.status(400).send({
                                    statusText: httpStatusText_1.httpStatusText.FAIL,
                                    message: "Missing required fields (name, provider, provider_user_id)",
                                })];
                        }
                        return [4 /*yield*/, database_1.usersModel.findUserByOAuth(provider, provider_user_id)];
                    case 2:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_1.usersModel.createUser({
                                name: name_3,
                                is_verified: true, // Automatically verify the user since it's Facebook login
                                provider: provider,
                                provider_user_id: provider_user_id,
                            })];
                    case 3:
                        newUser = _a.sent();
                        user = newUser;
                        authLogger.info("loginWithFacebookCallback: New user with provider_user_id {".concat(provider_user_id, "} created successfully"));
                        _a.label = 4;
                    case 4:
                        refreshToken = (0, generateRefreshToken_1.generateRefreshToken)(user.user_id);
                        // Clear the existing JWT cookie and set the new refresh token
                        res.clearCookie("jwt", {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                        });
                        res.cookie("jwt", refreshToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                        });
                        authLogger.info("loginWithFacebookCallback: User with provider_user_id {".concat(provider_user_id, "} logged in via Facebook"));
                        // Server redirects after successful login
                        res.redirect("".concat(process.env.CLIENT_URL, "/auth/oauth-success"));
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        next(error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); })(req, res, next);
        return [2 /*return*/];
    });
}); };
exports.loginWithFacebookCallback = loginWithFacebookCallback;
