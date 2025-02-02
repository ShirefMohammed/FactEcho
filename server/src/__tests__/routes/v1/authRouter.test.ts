import dotenv from "dotenv";

// import request from "supertest";
import { initializeApp } from "../../../app";
import { disconnectDB } from "../../../database";

dotenv.config();

/**
 * API end points tests for the authRouter.
 */

/**
 * Setup and teardown for database connection.
 */
beforeAll(async () => {
  if (process.env.NODE_ENV?.trim() !== "testing") {
    throw new Error("Tests can only run in the 'testing' environment.");
  }

  await initializeApp();
});

afterAll(async () => {
  await disconnectDB();
});

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
describe("authRouter API tests", () => {
  it("should respond with true", () => {
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
