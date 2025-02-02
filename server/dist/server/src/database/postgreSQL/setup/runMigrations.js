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
exports.runMigrations = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
/**
 * Runs migration files to update the database schema.
 *
 * - Ensures the `migrations` table exists to track executed migrations.
 * - Reads SQL migration files from the `migrations` directory, sorted in order.
 * - Skips already executed migrations and records new migrations as executed.
 *
 * @async
 * @param {Pool} pool - The PostgreSQL connection pool.
 * @returns {Promise<void>} Resolves when all migrations have been executed successfully.
 */
var runMigrations = function (pool) { return __awaiter(void 0, void 0, void 0, function () {
    var migrationsDir, files, _i, files_1, file, rowCount, filePath, sql;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Ensure the migrations table exists
            return [4 /*yield*/, pool.query("\n    CREATE TABLE IF NOT EXISTS migrations (\n      migration_id SERIAL PRIMARY KEY,\n      name TEXT NOT NULL UNIQUE,\n      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL\n    );\n  ")];
            case 1:
                // Ensure the migrations table exists
                _a.sent();
                migrationsDir = path_1.default.join(__dirname, "..", "migrations");
                files = fs_1.default.readdirSync(migrationsDir).sort();
                _i = 0, files_1 = files;
                _a.label = 2;
            case 2:
                if (!(_i < files_1.length)) return [3 /*break*/, 7];
                file = files_1[_i];
                return [4 /*yield*/, pool.query("SELECT 1 FROM migrations WHERE name = $1", [file])];
            case 3:
                rowCount = (_a.sent()).rowCount;
                if (rowCount && rowCount > 0) {
                    console.log("Skipping already executed migration: ".concat(file));
                    return [3 /*break*/, 6];
                }
                filePath = path_1.default.join(migrationsDir, file);
                sql = fs_1.default.readFileSync(filePath, "utf-8");
                return [4 /*yield*/, pool.query(sql)];
            case 4:
                _a.sent();
                // Record the migration as executed
                return [4 /*yield*/, pool.query("INSERT INTO migrations (name) VALUES ($1)", [file])];
            case 5:
                // Record the migration as executed
                _a.sent();
                console.log("Successfully executed migration: ".concat(file));
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7:
                console.log("All migrations executed successfully!");
                return [2 /*return*/];
        }
    });
}); };
exports.runMigrations = runMigrations;
