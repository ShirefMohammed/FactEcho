import { pool } from "./connectToPostgreSQL";

export const disconnectFromPostgreSQL = async () => {
  if (pool) await pool.end();
};
