"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetPasswordToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a reset password token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} The generated JWT reset password token.
 */
var generateResetPasswordToken = function (userId) {
    return jsonwebtoken_1.default.sign({ user_id: userId }, process.env.RESETPASSWORD_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};
exports.generateResetPasswordToken = generateResetPasswordToken;
