import dotenv from "dotenv";
import request from "supertest";

import app, { initializeApp } from "../../../app";
import { disconnectDB } from "../../../database";

dotenv.config();

/**
 * API end points tests for the HealthZ.
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

describe("healthZ API test", () => {
  it("should respond with a 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
