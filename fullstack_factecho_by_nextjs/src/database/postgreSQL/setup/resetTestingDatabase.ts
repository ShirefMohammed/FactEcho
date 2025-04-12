import { Pool } from "pg";

/**
 * Resets the testing database by dropping all tables and the migrations table.
 *
 * - Retrieves all tables in the `public` schema.
 * - Drops each table, including cascading dependencies, ensuring a clean state.
 *
 * @async
 * @param {Pool} pool - The PostgreSQL connection pool.
 * @throws Will throw an error if resetting the database fails.
 * @returns {Promise<void>} Resolves when all tables are dropped successfully.
 */
export const resetTestingDatabase = async (pool: Pool): Promise<void> => {
  try {
    console.log("Resetting the testing database...");

    // Get a list of all tables in the database
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
    );

    // Drop each table, including the migrations table
    for (const row of result.rows) {
      const tableName = row.table_name;
      // console.log(`Dropping table: ${tableName}`);
      await pool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
    }

    console.log("All tables and the migrations table dropped successfully!");
  } catch (err) {
    console.error("Error resetting the testing database:", err);
    throw new Error("Error resetting the testing database");
  }
};
