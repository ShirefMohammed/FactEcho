"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a refresh token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} The generated JWT refresh token.
 */
var generateRefreshToken = function (userId) {
    return jsonwebtoken_1.default.sign({ user_id: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
