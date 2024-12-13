import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

dotenv.config();

export let pool: Pool;

export async function connectToPostgreSQL() {
  try {
    const environment = process.env.NODE_ENV || "development";

    if (environment === "production") {
      // Production environment: Use the full DATABASE_URL or handle production-specific settings
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Optional: set to false if you're using self-signed certs
      });
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
    } else {
      // Development environment: Use local settings or mock settings
      pool = new Pool({
        user: process.env.POSTGRESQL_DB_USER,
        host: process.env.POSTGRESQL_DB_HOST,
        database: process.env.POSTGRESQL_DB_DEVELOPMENT_NAME,
        password: process.env.POSTGRESQL_DB_PASSWORD,
        port: Number(process.env.POSTGRESQL_DB_PORT),
        ssl: false,
      });
    }

    // Ensure the migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        migration_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Read migration files
    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      // Check if the migration has already been run
      const { rowCount } = await pool.query(
        "SELECT 1 FROM migrations WHERE name = $1",
        [file],
      );
      if (rowCount && rowCount > 0) {
        console.log(`Skipping already executed migration: ${file}`);
        continue;
      }

      // Read and execute the migration
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");
      await pool.query(sql);

      // Record the migration as executed
      await pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
      console.log(`Successfully executed migration: ${file}`);
    }

    console.log("All migrations executed successfully!");
  } catch (err) {
    console.error("PostgresSQL DB Connection failed:", err);
    process.exit(1);
  }
}
