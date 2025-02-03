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
 * Integration tests for the usersModel.
 *
 * This suite tests the create, read, update, and delete operations for user management.
 */
/**
 * Test data setup.
 */
var testUser = {
    user_id: "testUser.UUID",
    name: "testUser.name",
    email: "testUser.email",
    password: "testUser.password",
    is_verified: true,
    role: rolesList_1.ROLES_LIST.User,
    created_at: "",
    updated_at: "",
    provider: "testUser.provider",
    provider_user_id: "testUser.provider_user_id",
};
var testVerificationToken = "verificationToken";
var testResetPasswordToken = "resetPasswordToken";
var testAvatar = "avatar";
describe("usersModel Integration Tests", function () {
    /* ===== Create Operations ===== */
    describe("Create Operations", function () {
        it("should create a normal new user", function () { return __awaiter(void 0, void 0, void 0, function () {
            var newUser, createdUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newUser = {
                            name: testUser.name,
                            email: testUser.email,
                            password: testUser.password,
                            role: testUser.role,
                            is_verified: testUser.is_verified,
                        };
                        return [4 /*yield*/, database_1.usersModel.createUser(newUser)];
                    case 1:
                        createdUser = _a.sent();
                        expect(createdUser.name).toBe(newUser.name);
                        expect(createdUser.email).toBe(newUser.email);
                        expect(createdUser.password).toBe(newUser.password);
                        expect(createdUser.role).toBe(newUser.role);
                        expect(createdUser.is_verified).toBe(newUser.is_verified);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should create a new user with OAuth data", function () { return __awaiter(void 0, void 0, void 0, function () {
            var newUser, createdUser, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newUser = {
                            name: testUser.name,
                            email: "".concat(testUser.email, "_OAuth"),
                            password: testUser.password,
                            role: testUser.role,
                            is_verified: testUser.is_verified,
                            provider: testUser.provider,
                            provider_user_id: testUser.provider_user_id,
                        };
                        return [4 /*yield*/, database_1.usersModel.createUser(newUser)];
                    case 1:
                        createdUser = _a.sent();
                        // OAuth createdUser should have all fields in testUser
                        for (key in testUser) {
                            expect(createdUser).toHaveProperty(key);
                        }
                        expect(createdUser.name).toBe(newUser.name);
                        expect(createdUser.email).toBe(newUser.email);
                        expect(createdUser.password).toBe(newUser.password);
                        expect(createdUser.role).toBe(newUser.role);
                        expect(createdUser.is_verified).toBe(newUser.is_verified);
                        expect(createdUser.provider).toBe(newUser.provider);
                        expect(createdUser.provider_user_id).toBe(newUser.provider_user_id);
                        testUser = __assign(__assign({}, testUser), createdUser);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    /* ===== Read Operations ===== */
    describe("Read Operations", function () {
        it("should findUserById", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.findUserById(testUser.user_id)];
                    case 1:
                        user = _a.sent();
                        if (user)
                            expect(user).toEqual(testUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should findUserByEmail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.findUserByEmail(testUser.email)];
                    case 1:
                        user = _a.sent();
                        if (user)
                            expect(user).toEqual(testUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should findUserByOAuth", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.findUserByOAuth(testUser.provider, testUser.provider_user_id)];
                    case 1:
                        user = _a.sent();
                        if (user)
                            expect(user).toEqual(testUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should findUserByVerificationToken", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.findUserByVerificationToken(testVerificationToken)];
                    case 1:
                        user = _a.sent();
                        if (user)
                            expect(user).toEqual(testUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should findUserByResetPasswordToken", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.findUserByResetPasswordToken(testResetPasswordToken)];
                    case 1:
                        user = _a.sent();
                        if (user)
                            expect(user).toEqual(testUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should findUserAvatar", function () { return __awaiter(void 0, void 0, void 0, function () {
            var avatar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.findUserAvatar(testUser.user_id)];
                    case 1:
                        avatar = _a.sent();
                        if (avatar)
                            expect(avatar).toBe(testAvatar);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should getUsers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.getUsers(1, 100, 0)];
                    case 1:
                        users = _a.sent();
                        expect(users).toBeInstanceOf(Array);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should getUsersCount", function () { return __awaiter(void 0, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.getUsersCount()];
                    case 1:
                        count = _a.sent();
                        expect(typeof count).toBe("number");
                        return [2 /*return*/];
                }
            });
        }); });
        it("should searchUsers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.searchUsers(testUser.name, 1, 100, 0)];
                    case 1:
                        users = _a.sent();
                        expect(users).toBeInstanceOf(Array);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    /* ===== Update Operations ===== */
    describe("Update Operations", function () {
        it("should updateUser", function () { return __awaiter(void 0, void 0, void 0, function () {
            var updates, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = {
                            name: "".concat(testUser.name, "_Updated"),
                            email: "".concat(testUser.email, "_Updated"),
                            password: "".concat(testUser.password, "_Updated"),
                        };
                        return [4 /*yield*/, database_1.usersModel.updateUser(testUser.user_id, updates)];
                    case 1:
                        updatedUser = _a.sent();
                        expect(updatedUser.name).toBe(updates.name);
                        expect(updatedUser.email).toBe(updates.email);
                        expect(updatedUser.password).toBe(updates.password);
                        testUser = __assign(__assign({}, testUser), updatedUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should setVerificationToken", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.setVerificationToken(testUser.user_id, testVerificationToken)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should setResetPasswordToken", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.setResetPasswordToken(testUser.user_id, testVerificationToken)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should setAvatar", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.setAvatar(testUser.user_id, testAvatar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    /* ===== Delete Operations ===== */
    describe("Delete Operations", function () {
        it("should deleteUser", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.deleteUser(testUser.user_id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should deleteStaleUnverifiedUsers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var deletedCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.usersModel.deleteStaleUnverifiedUsers("1 day")];
                    case 1:
                        deletedCount = _a.sent();
                        expect(typeof deletedCount).toBe("number");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
