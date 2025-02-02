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
var dotenv_1 = __importDefault(require("dotenv"));
// import request from "supertest";
var app_1 = require("../../../app");
var database_1 = require("../../../database");
dotenv_1.default.config();
/**
 * API end points tests for the authRouter.
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
                return [4 /*yield*/, (0, app_1.initializeApp)()];
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
 * Auth end points
 */
// const authEndPoints = {
//   register: "/api/v1/auth/register",
//   login: "/api/v1/auth/login",
//   refresh: "/api/v1/auth/refresh",
//   logout: "/api/v1/auth/logout",
//   forgetPassword: "/api/v1/auth/forget-password",
//   loginWithGoogle: "/api/v1/auth/login/google",
//   loginWithFaceBook: "/api/v1/auth/login/facebook",
// };
/**
 * Test suite for authRouter API
 */
describe("authRouter API tests", function () {
    it("should respond with true", function () {
        expect(true).toBe(true);
    });
    // const validUser = {
    //   name: "Test_User",
    //   email: "testuser@example.com",
    //   password: "SecureP@ss123",
    // };
    // const invalidEmailUser = { ...validUser, email: "invalid-email" };
    // const weakPasswordUser = { ...validUser, password: "123" };
    /**
     * Utility function to create a new user
     */
    // const createUser = async (user: {
    //   name: string | null;
    //   email: string | null;
    //   password: string | null;
    // }) => {
    //   return request(app).post(authEndPoints.register).send(user);
    // };
    /**
     * Tests for the `login` endpoint
     */
    // describe(`POST ${authEndPoints.login}`, () => {
    //   it("should respond with 200 for valid credentials", async () => {
    //     // Register a user first
    //     await createUser(validUser);
    //     const response = await request(app).post(authEndPoints.login).send({
    //       email: validUser.email,
    //       password: validUser.password,
    //     });
    //     expect(response.statusCode).toBe(403); // unverified
    //   });
    //   it("should respond with 400 for missing required fields", async () => {
    //     const response = await request(app).post(authEndPoints.login).send({
    //       email: validUser.email,
    //     });
    //     expect(response.statusCode).toBe(400);
    //   });
    //   it("should respond with 401 for wrong password", async () => {
    //     const response = await request(app).post(authEndPoints.login).send({
    //       email: validUser.email,
    //       password: "WrongPassword123",
    //     });
    //     expect(response.statusCode).toBe(401);
    //   });
    //   it("should respond with 404 for unregistered email", async () => {
    //     const response = await request(app).post(authEndPoints.login).send({
    //       email: "notfound@example.com",
    //       password: validUser.password,
    //     });
    //     expect(response.statusCode).toBe(404);
    //   });
    //   it("should respond with 403 for unverified account", async () => {
    //     // Mock an unverified user (Adjust your `usersModel` or setup)
    //     // Assuming the user is created unverified by default
    //     await createUser(validUser);
    //     const response = await request(app).post(authEndPoints.login).send({
    //       email: validUser.email,
    //       password: validUser.password,
    //     });
    //     expect(response.statusCode).toBe(403);
    //   });
    // });
    /**
     * Tests for the `register` endpoint
     */
    // describe(`POST ${authEndPoints.register}`, () => {
    //   it("should respond with 201 for valid user data", async () => {
    //     const response = await createUser(validUser);
    //     expect(response.statusCode).toBe(201);
    //   });
    //   it("should respond with 400 for missing required fields", async () => {
    //     const missingName = {
    //       name: null,
    //       email: validUser.email,
    //       password: validUser.password,
    //     };
    //     const response = await createUser(missingName);
    //     expect(response.statusCode).toBe(400);
    //   });
    //   it("should respond with 400 for invalid email format", async () => {
    //     const response = await createUser(invalidEmailUser);
    //     expect(response.statusCode).toBe(400);
    //   });
    //   it("should respond with 400 for weak password", async () => {
    //     const response = await createUser(weakPasswordUser);
    //     expect(response.statusCode).toBe(400);
    //   });
    //   it("should respond with 409 for duplicate email", async () => {
    //     await createUser(validUser); // First registration
    //     const response = await createUser(validUser); // Duplicate registration
    //     expect(response.statusCode).toBe(409);
    //   });
    // });
});
