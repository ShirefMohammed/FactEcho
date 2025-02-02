"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a verification token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} The generated JWT verification token.
 */
var generateVerificationToken = function (userId) {
    return jsonwebtoken_1.default.sign({ user_id: userId }, process.env.VERIFICATION_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};
exports.generateVerificationToken = generateVerificationToken;
