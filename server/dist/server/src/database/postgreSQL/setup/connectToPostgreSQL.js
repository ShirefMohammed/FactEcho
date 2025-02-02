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
exports.connectToPostgreSQL = exports.pool = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var pg_1 = require("pg");
var resetTestingDatabase_1 = require("./resetTestingDatabase");
var runMigrations_1 = require("./runMigrations");
dotenv_1.default.config();
/**
 * Connects to a PostgreSQL database based on the current environment.
 * It supports "development", "testing", and "production" environments.
 *
 * - Production: Uses `DATABASE_URL` with optional SSL.
 * - Testing: Connects to the testing database, cleans the database, runs migrations, and adds test data.
 * - Development: Connects to the development database and runs migrations.
 *
 * @async
 * @returns {Promise<void>} Resolves when all connectToPostgreSQL succeeded.
 * @throws {Error} If the environment is not valid or connection fails.
 */
var connectToPostgreSQL = function () { return __awaiter(void 0, void 0, void 0, function () {
    var environment, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                environment = ((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) || "development";
                if (!["production", "testing", "development"].includes(environment)) {
                    throw new Error("Not valid environment");
                }
                if (!(environment === "production")) return [3 /*break*/, 2];
                // Production environment: Use the full DATABASE_URL or handle production-specific settings
                exports.pool = new pg_1.Pool({
                    connectionString: process.env.DATABASE_URL,
                    ssl: { rejectUnauthorized: false }, // Optional: set to false if you're using self-signed certs
                });
                return [4 /*yield*/, (0, runMigrations_1.runMigrations)(exports.pool)];
            case 1:
                _b.sent();
                return [3 /*break*/, 7];
            case 2:
                if (!(environment === "testing")) return [3 /*break*/, 5];
                // Testing environment: Use a separate database or mock settings
                exports.pool = new pg_1.Pool({
                    user: process.env.POSTGRESQL_DB_USER,
                    host: process.env.POSTGRESQL_DB_HOST,
                    database: process.env.POSTGRESQL_DB_TESTING_NAME,
                    password: process.env.POSTGRESQL_DB_PASSWORD,
                    port: Number(process.env.POSTGRESQL_DB_PORT),
                    ssl: false, // Typically no SSL for local testing
                });
                return [4 /*yield*/, (0, resetTestingDatabase_1.resetTestingDatabase)(exports.pool)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, runMigrations_1.runMigrations)(exports.pool)];
            case 4:
                _b.sent();
                return [3 /*break*/, 7];
            case 5:
                if (!(environment === "development")) return [3 /*break*/, 7];
                // Development environment: Use local settings or mock settings
                exports.pool = new pg_1.Pool({
                    user: process.env.POSTGRESQL_DB_USER,
                    host: process.env.POSTGRESQL_DB_HOST,
                    database: process.env.POSTGRESQL_DB_DEVELOPMENT_NAME,
                    password: process.env.POSTGRESQL_DB_PASSWORD,
                    port: Number(process.env.POSTGRESQL_DB_PORT),
                    ssl: false,
                });
                return [4 /*yield*/, (0, runMigrations_1.runMigrations)(exports.pool)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                err_1 = _b.sent();
                console.error("PostgreSQL DB Connection failed:", err_1);
                process.exit(1); // Exit with general error code
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.connectToPostgreSQL = connectToPostgreSQL;
