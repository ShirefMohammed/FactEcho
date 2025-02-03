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
exports.NodeCacheUtils = exports.DEFAULT_CACHE_TTL = void 0;
var node_cache_1 = __importDefault(require("node-cache"));
exports.DEFAULT_CACHE_TTL = 300; // Default TTL in seconds
var NodeCacheUtils = /** @class */ (function () {
    function NodeCacheUtils() {
        var _this = this;
        this.cache = null;
        /**
         * Initializes and configures a `node-cache` instance.
         * - Creates a new `node-cache` instance with optional configuration.
         * - Sets up error handling for the cache instance.
         *
         * @throws {Error} If the cache initialization fails.
         */
        this.initializeNodeCache = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // Initialize the cache with optional configuration
                    this.cache = new node_cache_1.default({
                        stdTTL: exports.DEFAULT_CACHE_TTL, // Default time-to-live for keys in seconds
                        checkperiod: 120, // Automatic delete check interval in seconds
                        useClones: true, // Store cloned copies of values to avoid reference issues
                    });
                    console.log("NodeCache initialized successfully");
                }
                catch (error) {
                    console.error("Failed to initialize NodeCache:", error);
                    // process.exit(1); // Exit with general error code
                }
                return [2 /*return*/];
            });
        }); };
        /**
         * Generates a cache key based on the request method and original URL.
         * This ensures that each unique request (including query parameters) is cached separately.
         *
         * @param req - The Express request object.
         * @returns A string representing the cache key.
         *
         * @example
         * const key = generateKey(req); // "GET:/users?page=1&limit=10"
         */
        this.generateKey = function (req) {
            return "".concat(req.method, ":").concat(req.originalUrl);
        };
        /**
         * Sets a value in the cache.
         * The cache key is generated using the request method and original URL.
         *
         * @param key - The cache key.
         * @param value - The value to cache.
         * @param ttl - Optional time-to-live in seconds. If not provided, the cache default TTL will be used.
         *
         * @example
         * set("GET:/users", { users: [...] }, 60); // Cache for 60 seconds
         */
        this.set = function (key, value, ttl) {
            if (_this.cache) {
                if (ttl !== undefined) {
                    _this.cache.set(key, value, ttl);
                }
                else {
                    _this.cache.set(key, value);
                }
            }
        };
        /**
         * Retrieves a value from the cache.
         * The cache key is generated using the request method and original URL.
         *
         * @param key - The cache key.
         * @returns The cached value or undefined if not found.
         *
         * @example
         * const cachedData = get("GET:/users");
         */
        this.get = function (key) {
            if (_this.cache) {
                return _this.cache.get(key);
            }
            return undefined;
        };
        /**
         * Updates the time-to-live (TTL) for a cached item.
         * The cache key is generated using the request method and original URL.
         *
         * @param key - The cache key.
         * @param ttl - The new time-to-live in seconds.
         *
         * @example
         * ttl("GET:/users", 60); // Reset TTL to 60 seconds
         */
        this.ttl = function (key, ttl) {
            if (_this.cache) {
                if (ttl !== undefined) {
                    _this.cache.ttl(key, ttl);
                }
                else {
                    _this.cache.ttl(key, exports.DEFAULT_CACHE_TTL);
                }
            }
        };
        /**
         * Deletes a cached item.
         *
         * @param key - The cache key.
         *
         * @example
         * del("GET:/users"); // Deletes the cached item for the key "GET:/users"
         */
        this.del = function (key) {
            if (_this.cache) {
                _this.cache.del(key);
            }
        };
        /**
         * Deletes all cached items that start with the given base URL.
         * This function skips the "METHOD:" prefix when checking cache keys.
         *
         * @param baseUrl - The base URL to match (e.g., "/api/v1/articles/").
         */
        this.deleteCachedItemsByBaseUrl = function (baseUrl) {
            if (_this.cache) {
                var keys = _this.cache.keys(); // Get all cache keys
                keys.forEach(function (key) {
                    var _a;
                    // Skip the "METHOD:" prefix and check if the URL part starts with the base URL
                    var urlPart = key.split(":").slice(1).join(":");
                    if (urlPart.startsWith(baseUrl)) {
                        (_a = _this.cache) === null || _a === void 0 ? void 0 : _a.del(key); // Delete the cached item
                        // console.log(`nodeCacheUtils: key: ${key} is deleted.`);
                    }
                });
            }
        };
    }
    return NodeCacheUtils;
}());
exports.NodeCacheUtils = NodeCacheUtils;
