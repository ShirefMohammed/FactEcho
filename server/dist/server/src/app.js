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
exports.initializeApp = void 0;
var compression_1 = __importDefault(require("compression"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var node_path_1 = __importDefault(require("node:path"));
var passport_1 = __importDefault(require("passport"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var cache_1 = require("./cache");
var corsOptions_1 = require("./config/corsOptions");
require("./config/passportConfig");
var swaggerConfig_1 = __importDefault(require("./config/swaggerConfig"));
var database_1 = require("./database");
var handleCors_1 = require("./middleware/handleCors");
var handleErrors_1 = require("./middleware/handleErrors");
var limiter_1 = require("./middleware/limiter");
var articlesRouter_1 = __importDefault(require("./routes/v1/articlesRouter"));
var authRouter_1 = __importDefault(require("./routes/v1/authRouter"));
var authorsRouter_1 = __importDefault(require("./routes/v1/authorsRouter"));
var categoriesRouter_1 = __importDefault(require("./routes/v1/categoriesRouter"));
var usersRouter_1 = __importDefault(require("./routes/v1/usersRouter"));
var handleNotFoundRoutes_1 = require("./utils/handleNotFoundRoutes");
dotenv_1.default.config();
var app = (0, express_1.default)();
var initializeApp = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Connect to database
            return [4 /*yield*/, (0, database_1.connectDB)()];
            case 1:
                // Connect to database
                _a.sent();
                // Initialize cache
                return [4 /*yield*/, (0, cache_1.initializeCache)()];
            case 2:
                // Initialize cache
                _a.sent();
                // Security middleware
                app.use((0, helmet_1.default)()); // Sets various HTTP headers to secure the app (e.g., XSS protection, no sniff, etc.)
                app.use((0, compression_1.default)()); // Compresses response bodies to reduce size and improve performance
                // Rate limiting
                app.use(limiter_1.rateLimiter); // Limits the number of requests from a single IP to prevent abuse
                // Slow down repeated requests
                app.use(limiter_1.speedLimiter); // Slows down repeated requests from a single IP to mitigate DoS attacks
                // CORS
                app.use(handleCors_1.handleCors, (0, cors_1.default)(corsOptions_1.corsOptions)); // Handles Cross-Origin Resource Sharing (CORS) to allow only trusted origins
                // Built-in middleware to handle urlencoded form data
                app.use(express_1.default.urlencoded({ extended: false, limit: "100kb" })); // Parses URL-encoded data with a 100kb limit
                // Built-in middleware for JSON
                app.use(express_1.default.json({ limit: "100kb" })); // Parses JSON data with a 100kb limit
                // Middleware for cookies
                app.use((0, cookie_parser_1.default)()); // Parses cookies attached to the client request
                // Initialize passport to handle OAuth
                app.use(passport_1.default.initialize());
                // Routes - HealthZ
                app.get("/", function (_, res) {
                    res.sendFile(node_path_1.default.join(__dirname, "views", "index.html"));
                });
                // V1 API Routes
                app.use("/api/v1/auth", authRouter_1.default);
                app.use("/api/v1/users", usersRouter_1.default);
                app.use("/api/v1/authors", authorsRouter_1.default);
                app.use("/api/v1/categories", categoriesRouter_1.default);
                app.use("/api/v1/articles", articlesRouter_1.default);
                // Swagger setup
                if (process.env.NODE_ENV === "development" ||
                    process.env.NODE_ENV === "testing") {
                    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.default));
                }
                // Handle not found routes
                app.all("*", handleNotFoundRoutes_1.handleNotFoundRoutes);
                // Handle error middleware
                app.use(handleErrors_1.handleErrors);
                return [2 /*return*/];
        }
    });
}); };
exports.initializeApp = initializeApp;
exports.default = app;
