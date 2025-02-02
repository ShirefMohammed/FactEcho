"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates an access token for a user.
 * @param {string} userId - The ID of the user.
 * @param {number} role - The user's role identifier.
 * @returns {string} The generated JWT access token.
 */
var generateAccessToken = function (userId, role) {
    var userInfo = { user_id: userId, role: role };
    return jsonwebtoken_1.default.sign({ userInfo: userInfo }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};
exports.generateAccessToken = generateAccessToken;
