"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedOrigins = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Retrieves the list of allowed origins from the environment variable `ALLOWED_ORIGINS`.
 *
 * The `ALLOWED_ORIGINS` environment variable should contain a comma-separated string of URLs
 * that represent the allowed origins. This function parses that string and returns an array
 * of strings representing the allowed origins.
 *
 * Example of the `ALLOWED_ORIGINS` value in `.env`:
 * ```
 * ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
 * ```
 *
 * The returned array will contain the individual origins like so:
 * ```
 * ["http://localhost:3000", "http://localhost:5173"]
 * ```
 *
 * If the `ALLOWED_ORIGINS` environment variable is not set or is empty, the function will
 * return an empty array.
 *
 * @returns {string[]} An array of allowed origin URLs.
 *
 * @throws {Error} Throws an error if the environment variable is malformed or cannot be parsed.
 */
var getAllowedOrigins = function () {
    var allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";
    var allowedOrigins = allowedOriginsEnv
        .split(",")
        .map(function (origin) { return origin.trim(); });
    return allowedOrigins;
};
exports.getAllowedOrigins = getAllowedOrigins;
