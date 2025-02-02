"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var dotenv_1 = __importDefault(require("dotenv"));
var database_1 = require("../../../../database");
var rolesList_1 = require("../../../../utils/rolesList");
dotenv_1.default.config();
/**
 * Integration tests for the authorsModel.
 *
 * This suite tests the create, read, update, and delete operations for author management.
 */
/**
 * Setup and teardown for database connection.
 */
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) !== "testing") {
                    throw new Error("Tests can only run in the 'testing' environment.");
                }
                return [4 /*yield*/, (0, database_1.connectDB)()];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.disconnectDB)()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
/**
 * Test data setup.
 */
var testAuthor = {
    user_id: "testAuthor.UUID",
    name: "testAuthor.name",
    email: "testAuthor.email",
    password: "testAuthor.password",
    is_verified: true,
    role: rolesList_1.ROLES_LIST.Author,
    created_at: "",
    updated_at: "",
    provider: "testAuthor.provider",
    provider_user_id: "testAuthor.provider_user_id",
    avatar: "",
    permissions: {
        user_id: "testAuthor.permissions.UUID",
        create: true,
        update: true,
        delete: true,
    },
};
describe("authorsModel Integration Tests", function () {
    /* ===== Create Operations ===== */
    describe("Create Operations", function () {
        it("should create a new user with OAuth data", function () { return __awaiter(void 0, void 0, void 0, function () {
            var newUser, createdUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newUser = {
                            name: testAuthor.name,
                            email: "".concat(testAuthor.email, "_OAuth"),
                            password: testAuthor.password,
                            role: testAuthor.role,
                            is_verified: testAuthor.is_verified,
                            provider: testAuthor.provider,
                            provider_user_id: testAuthor.provider_user_id,
                        };
                        return [4 /*yield*/, database_1.usersModel.createUser(newUser)];
                    case 1:
                        createdUser = _a.sent();
                        testAuthor = __assign(__assign({}, testAuthor), createdUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should create a new author permissions", function () { return __awaiter(void 0, void 0, void 0, function () {
            var newAuthorPermissions, createdAuthorPermissions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newAuthorPermissions = {
                            user_id: testAuthor.user_id,
                            create: true,
                            update: true,
                            delete: true,
                        };
                        return [4 /*yield*/, database_1.authorsModel.createAuthorPermissions(testAuthor.user_id, newAuthorPermissions)];
                    case 1:
                        createdAuthorPermissions = _a.sent();
                        expect(createdAuthorPermissions.user_id).toBe(newAuthorPermissions.user_id);
                        expect(createdAuthorPermissions.create).toBe(newAuthorPermissions.create);
                        expect(createdAuthorPermissions.update).toBe(newAuthorPermissions.update);
                        expect(createdAuthorPermissions.delete).toBe(newAuthorPermissions.delete);
                        testAuthor = __assign(__assign({}, testAuthor), { permissions: createdAuthorPermissions });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    /* ===== Read Operations ===== */
    describe("Read Operations", function () {
        it("should findAuthorById", function () { return __awaiter(void 0, void 0, void 0, function () {
            var author;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.authorsModel.findAuthorById(testAuthor.user_id)];
                    case 1:
                        author = _a.sent();
                        if (author)
                            expect(author).toEqual(testAuthor);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should getAuthors", function () { return __awaiter(void 0, void 0, void 0, function () {
            var authors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.authorsModel.getAuthors(1, 100, 0)];
                    case 1:
                        authors = _a.sent();
                        expect(authors).toBeInstanceOf(Array);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should getAuthorsCount", function () { return __awaiter(void 0, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.authorsModel.getAuthorsCount()];
                    case 1:
                        count = _a.sent();
                        expect(typeof count).toBe("number");
                        return [2 /*return*/];
                }
            });
        }); });
        it("should searchAuthors", function () { return __awaiter(void 0, void 0, void 0, function () {
            var authors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.authorsModel.searchAuthors(testAuthor.name, 1, 100, 0)];
                    case 1:
                        authors = _a.sent();
                        expect(authors).toBeInstanceOf(Array);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    /* ===== Update Operations ===== */
    describe("Update Operations", function () {
        it("should updateAuthorPermissions", function () { return __awaiter(void 0, void 0, void 0, function () {
            var updates, updatedAuthorPermissions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = {
                            user_id: testAuthor.user_id,
                            create: true,
                            update: true,
                            delete: true,
                        };
                        return [4 /*yield*/, database_1.authorsModel.updateAuthorPermissions(testAuthor.user_id, updates)];
                    case 1:
                        updatedAuthorPermissions = _a.sent();
                        expect(updatedAuthorPermissions.create).toBe(updates.create);
                        expect(updatedAuthorPermissions.update).toBe(updates.update);
                        expect(updatedAuthorPermissions.delete).toBe(updates.delete);
                        testAuthor = __assign(__assign({}, testAuthor), { permissions: updatedAuthorPermissions });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    /* ===== Delete Operations ===== */
    describe("Delete Operations", function () {
        it("should deleteAuthorPermissions", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.authorsModel.deleteAuthorPermissions(testAuthor.user_id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
