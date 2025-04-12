import fs from "fs";
import path from "path";
import { Pool } from "pg";

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
export const runMigrations = async (pool: Pool): Promise<void> => {
  // Ensure the migrations table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      migration_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  // Read migration files
  const migrationsDir = path.join(
    process.cwd(),
    "src",
    "database",
    "postgreSQL",
    "migrations",
  );

  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    // Check if the migration has already been run
    const { rowCount } = await pool.query("SELECT 1 FROM migrations WHERE name = $1", [file]);
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
};
