import dotenv from "dotenv";
import { Pool } from "pg";

import { resetTestingDatabase } from "./resetTestingDatabase";
import { runMigrations } from "./runMigrations";

dotenv.config();

export let pool: Pool;

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
export const connectToPostgreSQL = async () => {
  try {
    const environment = process.env.NODE_ENV?.trim() || "development";

    if (!["production", "testing", "development"].includes(environment)) {
      throw new Error("Not valid environment");
    }

    if (environment === "production") {
      // Production environment: Use the full DATABASE_URL or handle production-specific settings
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Optional: set to false if you're using self-signed certs
      });

      await runMigrations(pool);
    } else if (environment === "testing") {
      // Testing environment: Use a separate database or mock settings
      pool = new Pool({
        user: process.env.POSTGRESQL_DB_USER,
        host: process.env.POSTGRESQL_DB_HOST,
        database: process.env.POSTGRESQL_DB_TESTING_NAME,
        password: process.env.POSTGRESQL_DB_PASSWORD,
        port: Number(process.env.POSTGRESQL_DB_PORT),
        ssl: false, // Typically no SSL for local testing
      });

      await resetTestingDatabase(pool);

      await runMigrations(pool);
    } else if (environment === "development") {
      // Development environment: Use local settings or mock settings
      pool = new Pool({
        user: process.env.POSTGRESQL_DB_USER,
        host: process.env.POSTGRESQL_DB_HOST,
        database: process.env.POSTGRESQL_DB_DEVELOPMENT_NAME,
        password: process.env.POSTGRESQL_DB_PASSWORD,
        port: Number(process.env.POSTGRESQL_DB_PORT),
        ssl: false,
      });

      await runMigrations(pool);
    }
  } catch (err) {
    console.error("PostgreSQL DB Connection failed:", err);
    process.exit(1); // Exit with general error code
  }
};
